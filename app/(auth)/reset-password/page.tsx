import { resetPasswordAction } from "@/lib/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <Card className="w-full shadow-lg border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
        <CardDescription>Enter your new password below to complete the reset process.</CardDescription>
      </CardHeader>
      <CardContent>
        {params.error && (
          <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
            {params.error}
          </div>
        )}

        <form action={resetPasswordAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">New Password</label>
            <Input name="password" type="password" placeholder="••••••••" required minLength={6} />
          </div>

          <Button type="submit" className="w-full font-semibold">
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
