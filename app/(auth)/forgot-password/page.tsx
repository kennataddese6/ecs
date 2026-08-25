import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <Card className="w-full shadow-lg border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {params.error && (
          <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
            {params.error}
          </div>
        )}

        {params.success && (
          <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
            {params.success}
          </div>
        )}

        <form action={forgotPasswordAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Email Address</label>
            <Input name="email" type="email" placeholder="you@example.com" required />
          </div>

          <Button type="submit" className="w-full font-semibold">
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/login" className="inline-flex items-center text-primary font-semibold hover:underline">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
