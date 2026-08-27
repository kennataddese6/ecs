import Link from "next/link";
import { createParentAction } from "@/lib/actions/admin-parents";
import { SubmitButton } from "@/components/common/submit-button";
import { FormError } from "@/components/ui/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";

export default async function NewParentRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-2xl space-y-6 pb-12">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/parents">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Parents Directory
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Register New Parent / Guardian</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add parent contact details prior to linking children/students.
        </p>
      </div>

      <FormError message={params.error} />

      <form action={createParentAction} className="space-y-6">
        <Card>
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Parent Profile</CardTitle>
                <CardDescription>Primary guardian details and contact info.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input name="fullName" placeholder="e.g. Emily Thompson" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input name="email" type="email" placeholder="emily.t@example.com" required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Mobile Number <span className="text-destructive">*</span>
                </label>
                <Input name="mobileNumber" type="tel" placeholder="07890 123456" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Relationship to Child <span className="text-destructive">*</span>
                </label>
                <select
                  name="relationshipToChild"
                  defaultValue="Mother"
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm font-medium"
                  required
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Parents (Joint)">Parents (Joint)</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Other Relative">Other Relative</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Emergency Phone
                </label>
                <Input name="emergencyPhone" type="tel" placeholder="07890 999888" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Home Address <span className="text-destructive">*</span>
              </label>
              <textarea
                name="address"
                className="flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm min-h-[80px]"
                placeholder="14 Primrose Lane, London, NW3 2AB"
                required
              />
            </div>
          </CardContent>
        </Card>

        <SubmitButton size="lg" className="w-full font-bold h-12 shadow-lg" loadingText="Registering Parent...">
          Save Parent Record
        </SubmitButton>
      </form>
    </div>
  );
}
