-- supabase/migrations/20260828000000_create_newsletter_subscribers.sql

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public insertion for newsletter signup
CREATE POLICY "Allow public insert to newsletter_subscribers" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read newsletter subscribers
CREATE POLICY "Allow authenticated read newsletter_subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');
