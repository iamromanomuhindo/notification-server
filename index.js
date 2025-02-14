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
  allowedHeaders: ['Content-Type'],
  credentials: true
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
    console.log('Received notification request:', req.body);
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
            token: subscriber.id,
            notification: {
              title: campaign.title,
              body: campaign.message,
              image: campaign.image_url || null
            },
            webpush: {
              fcmOptions: {
                link: campaign.click_url
              },
              notification: {
                icon: campaign.icon_url || null,
                image: campaign.image_url || null,
                badge: campaign.icon_url || null,
                actions: [{
                  action: 'open_url',
                  title: campaign.cta_text || 'Open',
                  icon: campaign.icon_url || null
                }],
                requireInteraction: true
              }
            },
            android: {
              priority: 'high',
              notification: {
                icon: '@drawable/ic_notification',
                imageUrl: campaign.image_url || null,
                defaultSound: true,
                channelId: 'default'
              },
              data: {
                click_url: campaign.click_url
              }
            },
            data: {
              click_url: campaign.click_url,
              campaignId: campaignId.toString(),
              title: campaign.title,
              body: campaign.message,
              image: campaign.image_url || '',
              icon: campaign.icon_url || '',
              cta_text: campaign.cta_text || 'Open'
            }
          };

          console.log('Sending FCM message:', message);

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
