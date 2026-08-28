export interface BankAccount {
  id: string;
  bank_name: string;
  account_name: string;
  sort_code: string;
  account_number: string;
  iban?: string | null;
  swift_bic?: string | null;
  instructions?: string | null;
  is_active: boolean;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}
