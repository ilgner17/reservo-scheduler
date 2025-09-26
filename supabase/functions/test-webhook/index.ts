import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
    
    if (!n8nWebhookUrl) {
      throw new Error('N8N_WEBHOOK_URL not configured')
    }

    console.log('Testing webhook URL:', n8nWebhookUrl)

    // Test payload similar to actual booking data
    const testPayload = {
      clienteNome: "João Silva - TESTE",
      clienteTelefone: "+5511999999999",
      profissionalNome: "Dr. Teste",
      profissionalTelefone: "+5511888888888",
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      tipo: "Consulta de Teste",
      preco: "R$ 150,00",
      action: "teste_webhook"
    }

    console.log('Sending test payload:', JSON.stringify(testPayload, null, 2))

    // Send to N8N webhook
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    })

    const responseText = await response.text()
    console.log('N8N response status:', response.status)
    console.log('N8N response body:', responseText)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test webhook sent successfully',
        n8nResponse: {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        },
        payload: testPayload 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Test webhook error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        details: 'Failed to send test webhook to N8N'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})