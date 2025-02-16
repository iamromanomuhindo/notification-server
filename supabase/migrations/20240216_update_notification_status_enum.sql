-- Update notification_status enum to include 'completed'
ALTER TYPE notification_status ADD VALUE IF NOT EXISTS 'completed';

-- Add a comment explaining the enum values
COMMENT ON TYPE notification_status IS 'Notification status: scheduled (initial state), sent (notifications sent), delivered (confirmed delivery), completed (final state), failed (error occurred)';
