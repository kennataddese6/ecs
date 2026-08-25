import { requireAdmin } from "@/lib/auth";
import { updatePasswordAction } from "@/lib/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, KeyRound } from "lucide-react";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { user } = await requireAdmin();
  const params = await searchParams;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account credentials and system configuration.
        </p>
      </div>

      {params.error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
          {params.error}
        </div>
      )}

      {params.success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 text-sm font-medium border border-emerald-500/20">
          {params.success}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center space-x-3 pb-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Admin Account Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs">Email Address</span>
            <span className="font-semibold">{user.email}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Role</span>
            <span className="font-semibold text-primary capitalize">Administrator</span>
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
            <div className="space-y-2">
              <label className="text-sm font-semibold">Current Password</label>
              <Input name="currentPassword" type="password" placeholder="••••••••" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">New Password</label>
              <Input name="newPassword" type="password" placeholder="••••••••" required minLength={6} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Confirm New Password</label>
              <Input name="confirmPassword" type="password" placeholder="••••••••" required minLength={6} />
            </div>

            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
