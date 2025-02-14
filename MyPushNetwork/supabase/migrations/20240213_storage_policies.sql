-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for the notifications bucket
CREATE POLICY "Allow public read access for notifications bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'notifications');

CREATE POLICY "Allow authenticated users to upload to notifications bucket"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'notifications'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update their own objects in notifications bucket"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'notifications'
    AND auth.uid() = owner
)
WITH CHECK (
    bucket_id = 'notifications'
    AND auth.uid() = owner
);

CREATE POLICY "Allow authenticated users to delete their own objects in notifications bucket"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'notifications'
    AND auth.uid() = owner
);
