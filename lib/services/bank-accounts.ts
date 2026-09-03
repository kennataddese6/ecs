import { createClient } from "@/lib/supabase/server";
import { BankAccount } from "@/lib/types/bank-account";

export async function getActiveBankAccounts(): Promise<BankAccount[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("is_active", true)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (!error && data) {
      return data as BankAccount[];
    }
  } catch (e) {
    console.error("Error fetching bank accounts from Supabase:", e);
  }

  return [];
}

export async function getAllAdminBankAccounts(): Promise<BankAccount[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (!error && data) {
      return data as BankAccount[];
    }
  } catch (e) {
    console.error("Error fetching admin bank accounts from Supabase:", e);
  }

  return [];
}
