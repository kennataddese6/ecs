"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function revalidateBankPaths() {
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
  revalidatePath("/checkout/success");
  revalidatePath("/");
}

export async function createBankAccountAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const bankName = (formData.get("bankName") as string)?.trim();
  const accountName = (formData.get("accountName") as string)?.trim();
  const sortCode = (formData.get("sortCode") as string)?.trim();
  const accountNumber = (formData.get("accountNumber") as string)?.trim();
  const iban = (formData.get("iban") as string)?.trim() || null;
  const swiftBic = (formData.get("swiftBic") as string)?.trim() || null;
  const instructions = (formData.get("instructions") as string)?.trim() || null;
  const isActive = formData.get("isActive") === "true";
  const isPrimary = formData.get("isPrimary") === "true";

  if (!bankName || !accountName || !sortCode || !accountNumber) {
    redirect(`/admin/settings?error=${encodeURIComponent("Bank name, account name, sort code, and account number are required.")}`);
  }

  // If marked as primary, unset previous primary
  if (isPrimary) {
    await supabase.from("bank_accounts").update({ is_primary: false }).neq("id", "00000000-0000-0000-0000-000000000000");
  }

  const { error } = await supabase.from("bank_accounts").insert({
    bank_name: bankName,
    account_name: accountName,
    sort_code: sortCode,
    account_number: accountNumber,
    iban,
    swift_bic: swiftBic,
    instructions,
    is_active: isActive,
    is_primary: isPrimary,
  });

  if (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidateBankPaths();
  redirect("/admin/settings?success=Bank+account+details+added+successfully");
}

export async function updateBankAccountAction(accountId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const bankName = (formData.get("bankName") as string)?.trim();
  const accountName = (formData.get("accountName") as string)?.trim();
  const sortCode = (formData.get("sortCode") as string)?.trim();
  const accountNumber = (formData.get("accountNumber") as string)?.trim();
  const iban = (formData.get("iban") as string)?.trim() || null;
  const swiftBic = (formData.get("swiftBic") as string)?.trim() || null;
  const instructions = (formData.get("instructions") as string)?.trim() || null;
  const isActive = formData.get("isActive") === "true";
  const isPrimary = formData.get("isPrimary") === "true";

  if (!bankName || !accountName || !sortCode || !accountNumber) {
    redirect(`/admin/settings?error=${encodeURIComponent("Bank name, account name, sort code, and account number are required.")}`);
  }

  if (isPrimary) {
    await supabase.from("bank_accounts").update({ is_primary: false }).neq("id", accountId);
  }

  const { data: updatedRows, error } = await supabase
    .from("bank_accounts")
    .update({
      bank_name: bankName,
      account_name: accountName,
      sort_code: sortCode,
      account_number: accountNumber,
      iban,
      swift_bic: swiftBic,
      instructions,
      is_active: isActive,
      is_primary: isPrimary,
    })
    .eq("id", accountId)
    .select("id");

  // Fallback for demo ID
  if (!error && (!updatedRows || updatedRows.length === 0)) {
    await supabase.from("bank_accounts").insert({
      bank_name: bankName,
      account_name: accountName,
      sort_code: sortCode,
      account_number: accountNumber,
      iban,
      swift_bic: swiftBic,
      instructions,
      is_active: isActive,
      is_primary: isPrimary,
    });
  } else if (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidateBankPaths();
  redirect("/admin/settings?success=Bank+account+details+updated+successfully");
}

export async function deleteBankAccountAction(accountId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("bank_accounts").delete().eq("id", accountId);

  if (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidateBankPaths();
  redirect("/admin/settings?success=Bank+account+deleted+successfully");
}
