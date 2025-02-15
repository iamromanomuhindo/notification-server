const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Enable CORS for your frontend domain
app.use(cors({
  origin: ['https://manomedia.shop', 'http://localhost:3000'],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
          subscriber_id: '', // Will be set per subscriber
        },
        android: {
          notification: {
            icon: campaign.icon_url || '',
            image: campaign.image_url || '',
            click_action: campaign.click_url || '',
          },
          fcm_options: {
            analytics_label: campaignId.toString()
          }
        },
        webpush: {
          notification: {
            icon: campaign.icon_url || '',
            image: campaign.image_url || '',
            requireInteraction: true,
            data: {
              campaign_id: campaignId.toString(),
              subscriber_id: '', // Will be set per subscriber
            }
          },
          fcm_options: {
            link: campaign.click_url || '',
          },
        },
      };

      for (const subscriber of subscribers) {
        if (subscriber.id) {
          try {
            // Set subscriber-specific data
            message.data.subscriber_id = subscriber.id;
            message.webpush.notification.data.subscriber_id = subscriber.id;

            // Send with delivery tracking
            const response = await admin.messaging().send({
              ...message,
              token: subscriber.id,
            });

            if (response) {
              sent++;
              // Track delivery immediately for this subscriber
              try {
                await fetch('http://localhost:3000/track-delivery', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    campaignId,
                    subscriberId: subscriber.id,
                  }),
                });
              } catch (trackError) {
                console.error('Error tracking delivery:', trackError);
              }
            }
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

// Track notification delivery
app.post('/track-delivery', async (req, res) => {
  try {
    const { campaignId, subscriberId } = req.body;

    if (!campaignId || !subscriberId) {
      return res.status(400).json({ error: 'Campaign ID and Subscriber ID are required' });
    }

    // Get current notification data
    const { data: notification, error: notifError } = await supabase
      .from('notifications')
      .select('delivered_count')
      .eq('id', campaignId)
      .single();

    if (notifError) {
      return res.status(500).json({ error: notifError.message });
    }

    // Update delivery count and status
    const { error: updateError } = await supabase
      .from('notifications')
      .update({ 
        delivered_count: (notification?.delivered_count || 0) + 1,
        status: 'delivered',
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({ message: 'Delivery tracked successfully' });
  } catch (error) {
    console.error('Error tracking delivery:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Track notification clicks
app.post('/track-click', async (req, res) => {
  try {
    const { campaignId, subscriberId } = req.body;

    if (!campaignId || !subscriberId) {
      return res.status(400).json({ error: 'Campaign ID and Subscriber ID are required' });
    }

    // Get current notification data
    const { data: notification, error: notifError } = await supabase
      .from('notifications')
      .select('click_count')
      .eq('id', campaignId)
      .single();

    if (notifError) {
      return res.status(500).json({ error: notifError.message });
    }

    // Update click count
    const { error: updateError } = await supabase
      .from('notifications')
      .update({ 
        click_count: (notification?.click_count || 0) + 1,
        clicked: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({ message: 'Click tracked successfully' });
  } catch (error) {
    console.error('Error tracking click:', error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
