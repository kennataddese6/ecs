import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/common/submit-button";
import { FormError, FormSuccess } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string; success?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (user) {
    if (user.id === "admin-demo-id" || user.email === "admin@lumen.com") {
      redirect("/admin");
    }
    const dest = params.redirectTo && params.redirectTo !== "/account" ? params.redirectTo : "/account";
    redirect(dest);
  }

  return (
    <Card className="w-full shadow-lg border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormError message={params.error} />
        <FormSuccess message={params.success} />

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="redirectTo" value={params.redirectTo || "/account"} />

          <div className="space-y-2">
            <label className="text-sm font-semibold">Email Address</label>
            <Input name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input name="password" type="password" placeholder="••••••••" required />
          </div>

          <SubmitButton className="w-full font-semibold" loadingText="Signing In...">
            Sign In
          </SubmitButton>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
