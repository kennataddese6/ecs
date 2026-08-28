import { requireAdmin } from "@/lib/auth";
import { updatePasswordAction } from "@/lib/actions/auth";
import { getAllAdminBankAccounts } from "@/lib/services/bank-accounts";
import { BankAccountsManager } from "@/components/admin/bank-accounts-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/common/submit-button";
import { FormError, FormSuccess } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { ShieldCheck, KeyRound } from "lucide-react";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { user } = await requireAdmin();
  const params = await searchParams;
  const bankAccounts = await getAllAdminBankAccounts();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Admin & Storefront Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your official UK bank account transfer details, admin account credentials, and system configuration.
        </p>
      </div>

      <FormError message={params.error} />
      <FormSuccess message={params.success} />

      {/* Official UK Bank Accounts Management */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <BankAccountsManager accounts={bankAccounts} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-3 pb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Admin Account Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs font-semibold uppercase">Email Address</span>
              <span className="font-bold text-foreground">{user.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs font-semibold uppercase">Role</span>
              <span className="font-bold text-primary capitalize">System Administrator</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-3 pb-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Change Admin Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updatePasswordAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Current Password</label>
                <Input name="currentPassword" type="password" placeholder="••••••••" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">New Password</label>
                <Input name="newPassword" type="password" placeholder="••••••••" required minLength={6} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Confirm New Password</label>
                <Input name="confirmPassword" type="password" placeholder="••••••••" required minLength={6} />
              </div>

              <SubmitButton loadingText="Updating Password...">
                Update Password
              </SubmitButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
