import { createClient } from "@/lib/supabase/server";
import { BankAccount } from "@/lib/types/bank-account";

export const DEFAULT_DEMO_BANK_ACCOUNT: BankAccount = {
  id: "b1000000-0000-0000-0000-000000000001",
  bank_name: "Barclays Bank UK",
  account_name: "Enat Market Ltd",
  sort_code: "20-00-00",
  account_number: "87654321",
  iban: null,
  swift_bic: null,
  instructions: "Please use your Order Number (e.g. ORD-XXXX) as payment reference.",
  is_active: true,
  is_primary: true,
};

export async function getActiveBankAccounts(): Promise<BankAccount[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("is_active", true)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as BankAccount[];
    }
  } catch (e) {
    console.error("Error fetching bank accounts from Supabase:", e);
  }

  return [DEFAULT_DEMO_BANK_ACCOUNT];
}

export async function getAllAdminBankAccounts(): Promise<BankAccount[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as BankAccount[];
    }
  } catch (e) {
    console.error("Error fetching admin bank accounts from Supabase:", e);
  }

  return [DEFAULT_DEMO_BANK_ACCOUNT];
}
