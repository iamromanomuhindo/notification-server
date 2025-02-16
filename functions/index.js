/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const { createClient } = require('@supabase/supabase-js');
const logger = require("firebase-functions/logger");

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Handle token invalidation and unsubscribes
exports.handleTokenInvalidation = functions.pubsub.onMessagePublished("token-invalidation",
  async (event) => {
    const message = event.data;
    try {
      // Update subscriber status in Supabase
      const { error } = await supabaseClient
        .from("subscribers")
        .update({
          status: "unsubscribed",
          last_active_at: new Date().toISOString(),
        })
        .eq("device_id", message.token);

      if (error) {
        logger.error("Error updating subscriber status:", error);
      }
    } catch (error) {
      logger.error("Error in handleTokenInvalidation:", error);
    }
  });

exports.sendNotifications = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Get the campaign ID from the request
      const { campaignId } = req.body;

      if (!campaignId) {
        return res.status(400).json({ error: 'Campaign ID is required' });
      }

      // Get campaign details from Supabase
      const { data: campaign, error: campaignError } = await supabaseClient
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
      const subscribersQuery = supabaseClient
        .from('subscribers')
        .select('fcm_token');

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
          if (subscriber.fcm_token) {
            try {
              await admin.messaging().send({
                ...message,
                token: subscriber.fcm_token,
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
      const { error: updateError } = await supabaseClient
        .from('notifications')
        .update({ 
          status: 'delivered',
          sent_count: sent,
          delivered_count: sent
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
      console.error('Error in cloud function:', error);
      return res.status(500).json({ error: error.message });
    }
  });
});
