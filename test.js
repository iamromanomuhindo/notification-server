const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jdyugieeawrcbxpoiyho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeXVnaWVlYXdyY2J4cG9peWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzI4NTY3MywiZXhwIjoyMDUyODYxNjczfQ.LjYypQbIYm30-4jgLUg1r8I4Wug5HBEOg_QYPrxQk0M'
);

async function createAndSendNotification() {
  try {
    console.log('Creating notification in Supabase...');
    const { data: notification, error: createError } = await supabase
      .from('notifications')
      .insert({
        title: 'Test Notification',
        message: 'Testing notification status update',
        target_device: 'all',
        target_countries: ['ALL'],
        status: 'scheduled',
        campaign_name: 'Test Campaign',
        cta_text: 'Open',
        click_url: 'https://manomedia.shop',
        schedule_time: new Date().toISOString(),
        sent_count: 0,
        delivered_count: 0,
        click_count: 0,
        view_count: 0,
        icon_url: 'https://jdyugieeawrcbxpoiyho.supabase.co/storage/v1/object/public/notifications/icon_1739678278808.jpg',
        image_url: 'https://jdyugieeawrcbxpoiyho.supabase.co/storage/v1/object/public/notifications/image_1739678284735.jpg'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating notification:', createError);
      return;
    }

    console.log('Created notification:', notification);
    
    console.log('Sending notification...');
    const response = await fetch('https://notification-server-f0so.onrender.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        campaignId: notification.id,
        title: notification.title,
        message: notification.message,
        icon: notification.icon_url,
        image: notification.image_url,
        url: notification.click_url
      })
    });

    const result = await response.json();
    console.log('Send notification result:', result);

    // Check the updated notification
    const { data: updatedNotification, error: fetchError } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', notification.id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated notification:', fetchError);
      return;
    }

    console.log('Updated notification status:', updatedNotification);
  } catch (error) {
    console.error('Error:', error);
  }
}

createAndSendNotification();
