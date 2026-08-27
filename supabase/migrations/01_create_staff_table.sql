-- Create staff table for Bubbly Day Nursery
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    preferred_name TEXT,
    email TEXT NOT NULL UNIQUE,
    mobile_number TEXT NOT NULL,
    ni_number TEXT NOT NULL,
    job_title TEXT NOT NULL,
    nursery_branch TEXT NOT NULL,
    room_department TEXT NOT NULL,
    employment_type TEXT NOT NULL,
    dbs_certificate_number TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_relationship TEXT NOT NULL,
    emergency_contact_number TEXT NOT NULL,
    confirm_correct BOOLEAN NOT NULL DEFAULT true,
    agree_policies BOOLEAN NOT NULL DEFAULT true,
    agree_terms BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Allow admin full access to staff table
CREATE POLICY "Admins have full access to staff" ON public.staff
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
