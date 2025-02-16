-- Create enum type for notification status
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'delivered', 'failed');

-- Add status column to notifications table
ALTER TABLE notifications 
ADD COLUMN status notification_status DEFAULT 'pending';

-- Add delivered_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'notifications' 
                  AND column_name = 'delivered_count') THEN
        ALTER TABLE notifications 
        ADD COLUMN delivered_count integer DEFAULT 0;
    END IF;
END $$;
