-- Add new columns for enhanced click tracking
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS last_clicked_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS clicked_urls jsonb[] DEFAULT array[]::jsonb[],
ADD COLUMN IF NOT EXISTS unique_clicks integer DEFAULT 0;

-- Create function to update click tracking
CREATE OR REPLACE FUNCTION update_click_tracking()
RETURNS trigger AS $$
BEGIN
  -- Update last_clicked_at
  NEW.last_clicked_at := CURRENT_TIMESTAMP;
  
  -- Ensure clicked_urls is initialized
  IF NEW.clicked_urls IS NULL THEN
    NEW.clicked_urls := array[]::jsonb[];
  END IF;

  -- Calculate unique clicks based on unique URLs
  NEW.unique_clicks := (
    SELECT COUNT(DISTINCT (url_data->>'url')::text)
    FROM unnest(NEW.clicked_urls) as url_data
    WHERE url_data->>'url' IS NOT NULL
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for click tracking updates
DROP TRIGGER IF EXISTS update_click_tracking_trigger ON notifications;
CREATE TRIGGER update_click_tracking_trigger
  BEFORE UPDATE OF clicked_urls
  ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_click_tracking();

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS click_rate_limits (
  campaign_id bigint REFERENCES notifications(id),
  ip_address text,
  last_click timestamp with time zone,
  click_count integer DEFAULT 1,
  PRIMARY KEY (campaign_id, ip_address)
);

-- Create function to check rate limits
CREATE OR REPLACE FUNCTION check_click_rate_limit(
  p_campaign_id bigint,
  p_ip_address text,
  p_max_clicks integer DEFAULT 10,
  p_window_minutes integer DEFAULT 5
) RETURNS boolean AS $$
DECLARE
  v_current_count integer;
BEGIN
  -- Clean up old entries
  DELETE FROM click_rate_limits
  WHERE last_click < NOW() - (p_window_minutes || ' minutes')::interval;

  -- Get or create rate limit record
  INSERT INTO click_rate_limits (campaign_id, ip_address, last_click, click_count)
  VALUES (p_campaign_id, p_ip_address, NOW(), 1)
  ON CONFLICT (campaign_id, ip_address) DO UPDATE
  SET click_count = click_rate_limits.click_count + 1,
      last_click = NOW()
  RETURNING click_count INTO v_current_count;

  -- Check if rate limit exceeded
  RETURN v_current_count <= p_max_clicks;
END;
$$ LANGUAGE plpgsql;
