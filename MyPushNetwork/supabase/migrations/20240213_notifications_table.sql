-- Create sequence if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS public.notifications_id_seq;

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGINT DEFAULT nextval('public.notifications_id_seq') PRIMARY KEY,
    campaign_name TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    cta_text TEXT,
    click_url TEXT,
    icon_url TEXT,
    image_url TEXT,
    target_countries TEXT[],
    target_device TEXT,
    schedule_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    sent_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0
);

-- Set sequence ownership
ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;

-- Grant access to anon and authenticated roles
GRANT ALL ON public.notifications TO anon;
GRANT ALL ON public.notifications TO authenticated;
GRANT USAGE ON SEQUENCE public.notifications_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.notifications_id_seq TO authenticated;
