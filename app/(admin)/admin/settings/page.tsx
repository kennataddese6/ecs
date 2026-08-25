import { requireAdmin } from "@/lib/auth";
import { updatePasswordAction } from "@/lib/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, KeyRound } from "lucide-react";

export default async function AdminSettingsPage() {
  const { user } = await requireAdmin();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account credentials and system configuration.
        </p>
      </div>

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
              <label className="text-sm font-semibold">New Password</label>
              <Input name="password" type="password" placeholder="••••••••" required minLength={6} />
            </div>

            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
