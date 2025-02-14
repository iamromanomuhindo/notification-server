-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE subscriber_status AS ENUM ('active', 'inactive', 'unsubscribed');
CREATE TYPE device_type AS ENUM ('mobile', 'tablet', 'desktop');
CREATE TYPE notification_status AS ENUM ('scheduled', 'sent', 'failed');

-- Create subscribers table
CREATE TABLE subscribers (
    id TEXT PRIMARY KEY,
    device_id TEXT NOT NULL UNIQUE,
    browser TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status subscriber_status DEFAULT 'active',
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    device_type device_type NOT NULL,
    is_proxy_or_vpn BOOLEAN DEFAULT false
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon TEXT,
    image TEXT,
    url TEXT,
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    status notification_status DEFAULT 'scheduled',
    target_countries TEXT[], -- NULL means all countries
    target_browsers TEXT[], -- NULL means all browsers
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notification_logs table
CREATE TABLE notification_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    notification_id UUID REFERENCES notifications(id),
    subscriber_id TEXT REFERENCES subscribers(id),
    status TEXT NOT NULL,
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics_daily table for aggregated stats
CREATE TABLE analytics_daily (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    total_subscribers INTEGER DEFAULT 0,
    active_subscribers INTEGER DEFAULT 0,
    notifications_sent INTEGER DEFAULT 0,
    notifications_failed INTEGER DEFAULT 0,
    new_subscribers INTEGER DEFAULT 0,
    unsubscribed INTEGER DEFAULT 0,
    country_distribution JSONB,
    browser_distribution JSONB,
    device_distribution JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_subscribers_country ON subscribers(country);
CREATE INDEX idx_subscribers_created_at ON subscribers(created_at);
CREATE INDEX idx_subscribers_last_active ON subscribers(last_active_at);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at);
CREATE INDEX idx_analytics_daily_date ON analytics_daily(date);

-- Create spatial index for location queries
CREATE INDEX idx_subscribers_location ON subscribers USING gist (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

-- Create function to update analytics_daily
CREATE OR REPLACE FUNCTION update_analytics_daily()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update analytics for today
    INSERT INTO analytics_daily (
        date,
        total_subscribers,
        active_subscribers,
        new_subscribers,
        unsubscribed,
        country_distribution,
        browser_distribution,
        device_distribution
    )
    SELECT
        CURRENT_DATE,
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'active'),
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE),
        COUNT(*) FILTER (WHERE status = 'unsubscribed'),
        (
            SELECT jsonb_object_agg(country, count)
            FROM (
                SELECT country, COUNT(*) as count 
                FROM subscribers 
                WHERE country IS NOT NULL 
                GROUP BY country
            ) as country_counts
        ),
        (
            SELECT jsonb_object_agg(browser, count)
            FROM (
                SELECT browser, COUNT(*) as count 
                FROM subscribers 
                WHERE browser IS NOT NULL 
                GROUP BY browser
            ) as browser_counts
        ),
        (
            SELECT jsonb_object_agg(device_type, count)
            FROM (
                SELECT device_type, COUNT(*) as count 
                FROM subscribers 
                WHERE device_type IS NOT NULL 
                GROUP BY device_type
            ) as device_counts
        )
    FROM subscribers
    ON CONFLICT (date) DO UPDATE
    SET
        total_subscribers = EXCLUDED.total_subscribers,
        active_subscribers = EXCLUDED.active_subscribers,
        new_subscribers = EXCLUDED.new_subscribers,
        unsubscribed = EXCLUDED.unsubscribed,
        country_distribution = EXCLUDED.country_distribution,
        browser_distribution = EXCLUDED.browser_distribution,
        device_distribution = EXCLUDED.device_distribution,
        updated_at = NOW();
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update analytics
CREATE TRIGGER trigger_update_analytics_daily
AFTER INSERT OR UPDATE OR DELETE ON subscribers
FOR EACH STATEMENT
EXECUTE FUNCTION update_analytics_daily();

-- Create function to update notification status
CREATE OR REPLACE FUNCTION update_notification_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update notifications table with sent status
    UPDATE notifications
    SET 
        status = 'sent',
        sent_at = NOW(),
        updated_at = NOW()
    WHERE id = NEW.notification_id
    AND status = 'scheduled'
    AND (
        SELECT COUNT(DISTINCT subscriber_id)
        FROM notification_logs
        WHERE notification_id = NEW.notification_id
    ) = (
        SELECT COUNT(*)
        FROM subscribers
        WHERE status = 'active'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notification status updates
CREATE TRIGGER trigger_update_notification_status
AFTER INSERT ON notification_logs
FOR EACH ROW
EXECUTE FUNCTION update_notification_status();

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON subscribers
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable all access for authenticated users" ON notifications
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON notification_logs
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable read access for authenticated users" ON analytics_daily
    FOR SELECT
    TO authenticated
    USING (true);

-- Create indexes on frequently queried JSON fields
CREATE INDEX idx_analytics_country_dist ON analytics_daily USING gin (country_distribution);
CREATE INDEX idx_analytics_browser_dist ON analytics_daily USING gin (browser_distribution);
CREATE INDEX idx_analytics_device_dist ON analytics_daily USING gin (device_distribution);

-- Create function to clean up old logs (optional)
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
    -- Delete logs older than 90 days
    DELETE FROM notification_logs
    WHERE sent_at < NOW() - INTERVAL '90 days';
    
    -- Delete analytics older than 365 days
    DELETE FROM analytics_daily
    WHERE date < CURRENT_DATE - INTERVAL '365 days';
END;
$$ LANGUAGE plpgsql;
