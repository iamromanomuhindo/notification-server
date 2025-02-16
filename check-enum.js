const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jdyugieeawrcbxpoiyho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeXVnaWVlYXdyY2J4cG9peWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzI4NTY3MywiZXhwIjoyMDUyODYxNjczfQ.LjYypQbIYm30-4jgLUg1r8I4Wug5HBEOg_QYPrxQk0M'
);

async function checkNotifications() {
  try {
    // Get a sample notification to see what status values exist
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    console.log('Sample notifications:', notifications);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkNotifications();
