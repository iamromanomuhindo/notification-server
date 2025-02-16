import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  campaignId: string
  url?: string
  userAgent?: string
  referrer?: string
  ipAddress?: string
}

const RATE_LIMIT = {
  maxClicks: 10,
  windowMinutes: 5
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Get request data
    const requestData: RequestBody = await req.json()
    const { campaignId, url, userAgent, referrer } = requestData
    
    // Get IP address from request headers
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'

    if (!campaignId) {
      throw new Error('Campaign ID is required')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check rate limit
    const { data: isAllowed, error: rateError } = await supabaseClient
      .rpc('check_click_rate_limit', {
        p_campaign_id: campaignId,
        p_ip_address: ipAddress,
        p_max_clicks: RATE_LIMIT.maxClicks,
        p_window_minutes: RATE_LIMIT.windowMinutes
      })

    if (rateError) {
      throw rateError
    }

    if (!isAllowed) {
      throw new Error(`Rate limit exceeded. Maximum ${RATE_LIMIT.maxClicks} clicks per ${RATE_LIMIT.windowMinutes} minutes.`)
    }

    // Get current notification data
    const { data: notification, error: fetchError } = await supabaseClient
      .from('notifications')
      .select('click_count, clicked_urls')
      .eq('id', campaignId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Prepare click metadata
    const clickData = {
      timestamp: new Date().toISOString(),
      url: url || null,
      userAgent: userAgent || null,
      referrer: referrer || null,
      ipAddress: ipAddress
    }

    // Update notification with new click data
    const { error: updateError } = await supabaseClient
      .from('notifications')
      .update({
        click_count: (notification?.click_count || 0) + 1,
        last_clicked_at: new Date().toISOString(),
        clicked_urls: notification?.clicked_urls 
          ? [...notification.clicked_urls, clickData]
          : [clickData]
      })
      .eq('id', campaignId)

    if (updateError) {
      throw updateError
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Click tracked successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )

  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    )
  }
})
