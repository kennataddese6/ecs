-- Create Bank Accounts Table for BACS / Direct Bank Transfer Settings
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  account_name text NOT NULL,
  sort_code text NOT NULL,
  account_number text NOT NULL,
  iban text,
  swift_bic text,
  instructions text,
  is_active boolean NOT NULL DEFAULT true,
  is_primary boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS Policies for Bank Accounts Table
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- Anyone can read active bank details for checkout
CREATE POLICY "Allow public read access to active bank accounts"
  ON public.bank_accounts FOR SELECT
  USING (true);

-- Admins can do everything
CREATE POLICY "Allow admins full access to bank accounts"
  ON public.bank_accounts FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Seed initial Barclays Bank UK account details
INSERT INTO public.bank_accounts (id, bank_name, account_name, sort_code, account_number, is_active, is_primary)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'Barclays Bank UK',
  'Enat Market Ltd',
  '20-00-00',
  '87654321',
  true,
  true
)
ON CONFLICT (id) DO NOTHING;
