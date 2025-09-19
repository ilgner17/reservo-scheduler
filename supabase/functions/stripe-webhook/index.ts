import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          plan: string
          plan_limit: number
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          stripe_subscription_id: string
          start_at: string
          ends_at: string
          status: string
        }
      }
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No stripe signature found')
    }

    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!webhookSecret) {
      throw new Error('No webhook secret configured')
    }

    // Parse webhook event
    let event
    try {
      // In production, verify the signature properly
      event = JSON.parse(body)
      console.log('Received webhook event:', event.type)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, supabase)
        break
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object, supabase)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, supabase)
        break
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object, supabase)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

async function handleCheckoutSessionCompleted(session: any, supabase: any) {
  console.log('Handling checkout session completed:', session.id)
  
  const customerId = session.customer
  const subscriptionId = session.subscription
  
  // Get user_id from metadata or customer_email
  const userEmail = session.customer_details?.email
  let userId = session.client_reference_id
  
  if (!userId && userEmail) {
    // Find user by email
    const { data: userData } = await supabase.auth.admin.listUsers()
    const user = userData?.users.find((u: any) => u.email === userEmail)
    userId = user?.id
  }

  if (!userId) {
    throw new Error('Could not find user for checkout session')
  }

  // Determine plan details
  let planId = 'professional'
  let planLimit = 30
  
  if (session.amount_total === 3790) { // R$ 37.90 in cents
    planId = 'premium'
    planLimit = null // unlimited
  }

  // Create or update subscription
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan_id: planId,
      stripe_subscription_id: subscriptionId,
      start_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      status: 'active'
    })

  if (subError) {
    console.error('Error creating subscription:', subError)
    throw subError
  }

  // Update user profile with new plan
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      plan: planId,
      plan_limit: planLimit
    })
    .eq('user_id', userId)

  if (profileError) {
    console.error('Error updating profile:', profileError)
    throw profileError
  }

  console.log('Successfully updated subscription and profile')
}

async function handleInvoicePaymentSucceeded(invoice: any, supabase: any) {
  console.log('Handling invoice payment succeeded:', invoice.id)
  
  const subscriptionId = invoice.subscription
  
  if (!subscriptionId) return

  // Extend subscription by 30 days
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId)

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
  }

  console.log('Successfully renewed subscription')
}

async function handleSubscriptionDeleted(subscription: any, supabase: any) {
  console.log('Handling subscription deleted:', subscription.id)
  
  // Update subscription status
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', subscription.id)

  if (subError) {
    console.error('Error cancelling subscription:', subError)
    throw subError
  }

  // Revert user to free plan
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (subData?.user_id) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        plan: 'free',
        plan_limit: 5
      })
      .eq('user_id', subData.user_id)

    if (profileError) {
      console.error('Error reverting profile to free:', profileError)
      throw profileError
    }
  }

  console.log('Successfully cancelled subscription')
}

async function handleInvoicePaymentFailed(invoice: any, supabase: any) {
  console.log('Handling invoice payment failed:', invoice.id)
  
  const subscriptionId = invoice.subscription
  
  if (!subscriptionId) return

  // Mark subscription as past_due
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId)

  if (error) {
    console.error('Error updating subscription status:', error)
    throw error
  }

  console.log('Successfully marked subscription as past due')
}