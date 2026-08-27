import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { registerAction } from "@/lib/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/common/submit-button";
import { FormError } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (user) {
    redirect("/account");
  }

  return (
    <Card className="w-full shadow-lg border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>Join our platform to track orders and save cart items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormError message={params.error} />

        <form action={registerAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Full Name</label>
            <Input name="fullName" placeholder="Jane Doe" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Email Address</label>
            <Input name="email" type="email" placeholder="jane@example.com" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Password</label>
            <Input name="password" type="password" placeholder="••••••••" required minLength={6} />
          </div>

          <SubmitButton className="w-full font-semibold" loadingText="Creating Account...">
            Create Account
          </SubmitButton>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
