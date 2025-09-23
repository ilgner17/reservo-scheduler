import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          professional_id: string
          client_name: string
          client_phone: string
          client_email: string
          start_at: string
          end_at: string
          status: string
          notes: string
          price_cents: number
        }
      }
      profiles: {
        Row: {
          user_id: string
          name: string
          phone: string
        }
      }
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { bookingId, action } = await req.json()

    if (!bookingId) {
      throw new Error('Booking ID is required')
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles:professional_id (name, phone)
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      throw new Error('Booking not found')
    }

    // Prepare WhatsApp message data
    const whatsappPayload = {
      clienteNome: booking.client_name,
      clienteTelefone: booking.client_phone,
      profissionalNome: booking.profiles?.name || '',
      profissionalTelefone: booking.profiles?.phone || '',
      data: new Date(booking.start_at).toLocaleDateString('pt-BR'),
      hora: new Date(booking.start_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      tipo: 'Consulta',
      preco: `R$ ${(booking.price_cents / 100).toFixed(2)}`,
      action: action || 'novo_agendamento'
    }

    // Send to N8N webhook (if configured)
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
    if (n8nWebhookUrl) {
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whatsappPayload)
      })
    }

    // Update booking status to indicate WhatsApp was sent
    await supabase
      .from('bookings')
      .update({ 
        notes: booking.notes ? `${booking.notes}\n[WhatsApp enviado]` : '[WhatsApp enviado]'
      })
      .eq('id', bookingId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'WhatsApp notification sent',
        payload: whatsappPayload 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})