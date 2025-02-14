const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://manomedia.onrender.com', 'https://manomedia.shop'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Initialize Supabase client with retry mechanism
function initializeSupabase(retryCount = 0) {
  console.log('Attempting to initialize Supabase...');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 0);
  console.log('First 10 chars of key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) : 'none');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(
    process.env.SUPABASE_URL.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY.trim()
  );

  // Test the connection
  return (async () => {
    try {
      const { data, error } = await supabase.from('notifications').select('count').limit(1);
      if (error) {
        console.error('Supabase connection test failed:', error);
        if (error.message === 'Invalid API key' && retryCount < 3) {
          console.log(`Retrying Supabase initialization (attempt ${retryCount + 1}/3)...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          return initializeSupabase(retryCount + 1);
        }
        throw error;
      }
      console.log('Supabase connection test successful');
      return supabase;
    } catch (error) {
      console.error('Exception during Supabase initialization:', error);
      if (retryCount < 3) {
        console.log(`Retrying Supabase initialization (attempt ${retryCount + 1}/3)...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return initializeSupabase(retryCount + 1);
      }
      throw error;
    }
  })();
}

// Initialize Supabase with retry
let supabase;
(async () => {
  try {
    supabase = await initializeSupabase();
    console.log('Supabase initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase after retries:', error);
    process.exit(1);
  }
})();

// Initialize Firebase Admin
console.log('Initializing Firebase with project ID:', process.env.FIREBASE_PROJECT_ID);
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

console.log('Firebase Admin initialized successfully');

// Health check endpoint with environment variable status
app.get('/health', (req, res) => {
  // Check required environment variables
  const requiredEnvVars = {
    SUPABASE_URL: process.env.SUPABASE_URL || 'Missing',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 
      `Present (length: ${process.env.SUPABASE_SERVICE_ROLE_KEY.length})` : 'Missing',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'Missing',
    FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID ? '✓ Present' : '✗ Missing',
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? '✓ Present' : '✗ Missing',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || 'Missing',
    FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID ? '✓ Present' : '✗ Missing',
    FIREBASE_CLIENT_CERT_URL: process.env.FIREBASE_CLIENT_CERT_URL ? '✓ Present' : '✗ Missing'
  };

  // Log environment details
  console.log('Environment Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Environment variables status:', requiredEnvVars);
  
  // Check if we're running in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.json({ 
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'not set',
    env: requiredEnvVars
  });
});

// Notification endpoint
app.post('/send-notifications', async (req, res) => {
  try {
    console.log('Received notification request:', req.body);
    const { campaignId } = req.body;

    if (!campaignId) {
      console.error('No campaign ID provided');
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    console.log('Fetching campaign with ID:', campaignId);
    console.log('Using Supabase URL:', process.env.SUPABASE_URL);
    console.log('Service Role Key length:', process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 0);

    // Test Supabase connection before making the query
    try {
      const { data: testData, error: testError } = await supabase
        .from('notifications')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('Test query failed:', testError);
        console.error('Test error details:', {
          message: testError.message,
          hint: testError.hint,
          details: testError.details,
          code: testError.code
        });
        throw new Error('Database connection test failed');
      }
      console.log('Test query successful');
    } catch (testError) {
      console.error('Exception during test query:', testError);
      throw testError;
    }

    // Get campaign details from Supabase
    const { data: campaign, error: campaignError } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError) {
      console.error('Error fetching campaign:', campaignError);
      console.error('Error details:', {
        message: campaignError.message,
        hint: campaignError.hint,
        details: campaignError.details,
        code: campaignError.code
      });
      return res.status(500).json({ error: campaignError.message });
    }

    if (!campaign) {
      console.error('Campaign not found:', campaignId);
      return res.status(404).json({ error: 'Campaign not found' });
    }

    console.log('Found campaign:', {
      id: campaign.id,
      name: campaign.campaign_name,
      title: campaign.title,
      targetDevice: campaign.target_device,
      targetCountries: campaign.target_countries
    });

    // Get subscribers based on target criteria
    let subscribersQuery = supabase
      .from('subscribers')
      .select('id, device_id, device_type, country, status')
      .eq('status', 'active'); // Only get active subscribers

    if (campaign.target_device !== 'all') {
      subscribersQuery = subscribersQuery.eq('device_type', campaign.target_device);
    }

    if (campaign.target_countries && campaign.target_countries.length > 0 && !campaign.target_countries.includes('ALL')) {
      subscribersQuery = subscribersQuery.in('country', campaign.target_countries);
    }

    const { data: subscribers, error: subscribersError } = await subscribersQuery;

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      console.error('Error details:', {
        message: subscribersError.message,
        hint: subscribersError.hint,
        details: subscribersError.details,
        code: subscribersError.code
      });
      return res.status(500).json({ error: subscribersError.message });
    }

    console.log(`Found ${subscribers?.length || 0} active subscribers`);

    // Send notifications to each subscriber
    let sent = 0;
    let failed = 0;
    const logs = [];
    const errors = [];
    const currentTime = new Date().toISOString();

    if (subscribers && subscribers.length > 0) {
      for (const subscriber of subscribers) {
        try {
          // Skip if no FCM token (id)
          if (!subscriber.id) {
            console.log(`Skipping subscriber: No FCM token`);
            failed++;
            errors.push({ error: 'No FCM token' });
            continue;
          }

          // Log subscriber details
          console.log('Processing subscriber:', {
            id: subscriber.id,
            deviceId: subscriber.device_id,
            deviceType: subscriber.device_type,
            country: subscriber.country,
            tokenLength: subscriber.id.length
          });

          // Log the click URL from database
          console.log('Campaign details:', {
            id: campaign.id,
            title: campaign.title,
            clickUrl: campaign.click_url,
            targetDevice: campaign.target_device,
            targetCountries: campaign.target_countries
          });

          const message = {
            notification: {
              title: campaign.title,
              body: campaign.message,
              image_url: campaign.image_url,
              icon_url: campaign.icon_url
            },
            data: {
              click_action: campaign.click_url || 'https://manomedia.shop',
              campaign_id: campaignId.toString()
            },
            token: subscriber.id
          };

          console.log('Sending notification:', {
            title: message.notification.title,
            body: message.notification.body,
            clickUrl: message.data.click_action,
            campaignId: message.data.campaign_id,
            subscriberId: subscriber.id
          });

          const result = await admin.messaging().send(message);
          console.log('FCM send result:', result);
          sent++;

          // Add success log
          logs.push({
            notification_id: campaignId,
            subscriber_id: subscriber.id,
            status: 'sent',
            sent_at: currentTime
          });

          // Update subscriber's last_active_at
          await supabase
            .from('subscribers')
            .update({ last_active_at: currentTime })
            .eq('id', subscriber.id);

        } catch (error) {
          console.error('Error sending notification to subscriber:', {
            subscriberId: subscriber.id,
            error: error.message,
            errorCode: error.code,
            errorStack: error.stack
          });
          failed++;
          errors.push({
            subscriberId: subscriber.id,
            error: error.message,
            code: error.code
          });
          
          // Add failure log
          logs.push({
            notification_id: campaignId,
            subscriber_id: subscriber.id,
            status: 'failed',
            error_message: error.message,
            sent_at: currentTime
          });

          // If the token is invalid, mark the subscriber as inactive
          if (error.code === 'messaging/invalid-registration-token' || 
              error.code === 'messaging/registration-token-not-registered') {
            await supabase
              .from('subscribers')
              .update({ 
                status: 'inactive',
                unsubscribed_at: currentTime
              })
              .eq('id', subscriber.id);
          }
        }
      }
    }

    // Insert notification logs
    if (logs.length > 0) {
      const { error: logsError } = await supabase
        .from('notification_logs')
        .insert(logs);

      if (logsError) {
        console.error('Error inserting notification logs:', logsError);
        console.error('Error details:', {
          message: logsError.message,
          hint: logsError.hint,
          details: logsError.details,
          code: logsError.code
        });
      }
    }

    // Update campaign status
    const { error: updateError } = await supabase
      .from('notifications')
      .update({ 
        status: 'sent',
        sent_count: sent,
        updated_at: currentTime
      })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign status:', updateError);
      console.error('Error details:', {
        message: updateError.message,
        hint: updateError.hint,
        details: updateError.details,
        code: updateError.code
      });
    }

    return res.json({ 
      message: 'Notifications sent successfully', 
      sent, 
      failed,
      errors // Include error details in response
    });
  } catch (error) {
    console.error('Error in send-notifications:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Record notification click
app.post('/record-click', async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    // Update click count in notifications table
    const { data, error } = await supabase.rpc('increment_notification_clicks', {
      p_campaign_id: campaignId
    });

    if (error) {
      console.error('Error recording click:', error);
      console.error('Error details:', {
        message: error.message,
        hint: error.hint,
        details: error.details,
        code: error.code
      });
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording click:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
