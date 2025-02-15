-- Create the notifications bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('notifications', 'notifications', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to notifications bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'notifications');

-- Allow authenticated uploads to notifications bucket
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'notifications'
    AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
);

-- Allow owners to update their files
CREATE POLICY "Owner Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'notifications')
WITH CHECK (bucket_id = 'notifications');

-- Allow owners to delete their files
CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'notifications');
