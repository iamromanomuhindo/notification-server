-- Enable RLS for notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated or anonymous user to read notifications
CREATE POLICY "Allow public read access"
ON public.notifications
FOR SELECT
USING (true);

-- Allow any authenticated or anonymous user to insert notifications
CREATE POLICY "Allow public insert access"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Allow any authenticated or anonymous user to update their notifications
CREATE POLICY "Allow public update access"
ON public.notifications
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow any authenticated or anonymous user to delete their notifications
CREATE POLICY "Allow public delete access"
ON public.notifications
FOR DELETE
USING (true);
