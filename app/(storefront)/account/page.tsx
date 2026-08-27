import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SubmitButton } from "@/components/common/submit-button";
import { FormError, FormSuccess } from "@/components/ui/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Package, KeyRound, LogOut, ShieldCheck } from "lucide-react";
import { logoutAction, updateCustomerPasswordAction, updateCustomerProfileAction } from "@/lib/actions/auth";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const isAdmin = user.id === "admin-demo-id" || user.email === "admin@lumen.com" || user.user_metadata?.role === "admin";

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Customer Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings, personal details, and view your orders.
          </p>
        </div>
        <form action={logoutAction}>
          <Button variant="destructive" size="sm">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </form>
      </div>

      {isAdmin && (
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Administrator Account</h3>
              <p className="text-xs text-muted-foreground">You have full access to products, orders, news, and system settings.</p>
            </div>
          </div>
          <Button size="sm" className="font-bold shadow" asChild>
            <Link href="/admin">
              Go to Admin Dashboard &rarr;
            </Link>
          </Button>
        </div>
      )}

      <FormError message={params.error} />
      <FormSuccess message={params.success} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center space-x-3 pb-2">
            <User className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Personal Profile</CardTitle>
              <CardDescription>Update your contact and billing information</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <form action={updateCustomerProfileAction} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <Input value={user.email || ""} disabled className="bg-muted text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground">Email address cannot be changed directly.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider">Full Name</label>
                <Input name="fullName" defaultValue={user.user_metadata?.full_name || ""} required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider">Phone Number</label>
                <Input name="phone" placeholder="07830 682710" defaultValue={user.user_metadata?.phone || ""} />
              </div>

              <SubmitButton size="sm" loadingText="Saving Profile...">
                Save Profile Changes
              </SubmitButton>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-3 pb-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Order History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <p className="text-xs text-muted-foreground">
                View your past purchases, shipment tracking, and receipts.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/account/orders">View All Orders &rarr;</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-3 pb-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Security & Password</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <form action={updateCustomerPasswordAction} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Current Password</label>
                  <Input name="currentPassword" type="password" placeholder="••••••••" required />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">New Password</label>
                  <Input name="newPassword" type="password" placeholder="••••••••" required minLength={6} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Confirm New Password</label>
                  <Input name="confirmPassword" type="password" placeholder="••••••••" required minLength={6} />
                </div>

                <SubmitButton size="sm" variant="secondary" className="w-full" loadingText="Updating Password...">
                  Update Password
                </SubmitButton>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
