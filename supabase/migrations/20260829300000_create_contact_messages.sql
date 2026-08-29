-- Create contact_messages table for storing customer inquiries
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  topic TEXT DEFAULT 'general',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'UNREAD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public insert policy for contact forms
DROP POLICY IF EXISTS "Allow public contact message submission" ON public.contact_messages;
CREATE POLICY "Allow public contact message submission"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Admin read/write/delete policies
DROP POLICY IF EXISTS "Allow admin full access to contact messages" ON public.contact_messages;
CREATE POLICY "Allow admin full access to contact messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin(auth.uid()));
