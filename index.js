const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// CORS configuration
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        url: req.url,
        origin: req.headers.origin,
        headers: req.headers
    });
    next();
});

app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'https://manomedia.onrender.com',
            'https://manomedia.shop',
            'http://manomedia.shop'
        ];
        
        console.log('Request origin:', origin);
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            console.log('Origin not allowed:', origin);
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        
        console.log('Origin allowed:', origin);
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Firebase Admin
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Notification endpoint
app.post('/send-notifications', async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    // Get campaign details from Supabase
    const { data: campaign, error: campaignError } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({ 
        error: campaignError?.message || 'Campaign not found' 
      });
    }

    // Get subscribers based on target criteria
    const subscribersQuery = supabase
      .from('subscribers')
      .select('id, device_type, country');

    if (campaign.target_device !== 'all') {
      subscribersQuery.eq('device_type', campaign.target_device);
    }

    if (campaign.target_countries && campaign.target_countries.length > 0 && !campaign.target_countries.includes('ALL')) {
      subscribersQuery.in('country', campaign.target_countries);
    }

    const { data: subscribers, error: subscribersError } = await subscribersQuery;

    if (subscribersError) {
      return res.status(500).json({ error: subscribersError.message });
    }

    // Send notifications to each subscriber
    let sent = 0;
    let failed = 0;

    if (subscribers && subscribers.length > 0) {
      const message = {
        notification: {
          title: campaign.title,
          body: campaign.message,
        },
        data: {
          click_action: campaign.click_url || '',
          campaign_id: campaignId.toString(),
        },
        android: {
          notification: {
            icon: campaign.icon_url || '',
            image: campaign.image_url || '',
            click_action: campaign.click_url || '',
          },
        },
        webpush: {
          notification: {
            icon: campaign.icon_url || '',
            image: campaign.image_url || '',
          },
          fcm_options: {
            link: campaign.click_url || '',
          },
        },
      };

      for (const subscriber of subscribers) {
        if (subscriber.id) {
          try {
            await admin.messaging().send({
              ...message,
              token: subscriber.id,
            });
            sent++;
          } catch (error) {
            console.error('Error sending notification:', error);
            failed++;
          }
        }
      }
    }

    // Update campaign status and counts
    const { error: updateError } = await supabase
      .from('notifications')
      .update({ 
        status: 'completed',
        sent_count: sent,
      })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign:', updateError);
    }

    // Return success response
    return res.status(200).json({ 
      message: 'Notifications sent successfully',
      sent,
      failed,
    });

  } catch (error) {
    console.error('Error in send-notifications:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Track notification clicks
app.post('/track-click', async (req, res) => {
  try {
    const { campaignId, url, userAgent } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    // Check rate limiting first
    const { data: rateLimit, error: rateLimitError } = await supabase
      .rpc('check_click_rate_limit', {
        p_campaign_id: campaignId,
        p_ip_address: ipAddress,
        p_max_clicks: 10,
        p_window_minutes: 5
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      return res.status(500).json({ error: 'Error checking rate limit' });
    }

    if (!rateLimit) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Update notification click data
    const clickData = {
      timestamp: new Date().toISOString(),
      url: url || null,
      userAgent: userAgent || null,
      ipAddress: ipAddress,
      referrer: req.headers.referer || null
    };

    const { data, error } = await supabase
      .from('notifications')
      .update({
        clicked_urls: supabase.sql`array_append(COALESCE(clicked_urls, ARRAY[]::jsonb[]), ${clickData}::jsonb)`
      })
      .eq('id', campaignId);

    if (error) {
      console.error('Error updating click data:', error);
      return res.status(500).json({ error: 'Error updating click data' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



