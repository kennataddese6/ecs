import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { registerAction } from "@/lib/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <CardContent>
        {params.error && (
          <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
            {params.error}
          </div>
        )}

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

          <Button type="submit" className="w-full font-semibold">
            Create Account
          </Button>
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
