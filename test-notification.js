const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestNotification() {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      title: 'Test Notification',
      message: 'Testing notification status update',
      target_device: 'all',
      target_countries: ['ALL'],
      status: 'pending',
      sent_count: 0,
      delivered_count: 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    return;
  }

  console.log('Created notification:', data);
  
  // Now send the notification
  const response = await fetch(`${process.env.SERVER_URL}/send-notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ campaignId: data.id })
  });

  const result = await response.json();
  console.log('Send notification result:', result);
}

createTestNotification().catch(console.error);
