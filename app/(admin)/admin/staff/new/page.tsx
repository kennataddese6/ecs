import Link from "next/link";
import { createStaffAction } from "@/lib/actions/admin-staff";
import { SubmitButton } from "@/components/common/submit-button";
import { FormError } from "@/components/ui/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Briefcase,
  ShieldCheck,
  KeyRound,
  PhoneCall,
  CheckSquare,
} from "lucide-react";

export default async function NewStaffRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-3xl space-y-8 pb-12">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/staff">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Staff Directory
        </Link>
      </Button>

      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <span>Bubbly Day Nursery</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Staff Registration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Register new staff members, configure employment branches, record DBS credentials, and assign emergency contacts.
        </p>
      </div>

      <FormError message={params.error} />

      <form action={createStaffAction} className="space-y-8">
        {/* 1. PERSONAL DETAILS */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Personal Details</CardTitle>
                <CardDescription>Legal name, contact information, and National Insurance details.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input name="fullName" placeholder="e.g. Sarah Jenkins" required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Preferred Name
                </label>
                <Input name="preferredName" placeholder="e.g. Sarah" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input name="email" type="email" placeholder="sarah.j@bubblynursery.co.uk" required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Mobile Number <span className="text-destructive">*</span>
                </label>
                <Input name="mobileNumber" type="tel" placeholder="07700 900123" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                National Insurance Number <span className="text-destructive">*</span>
              </label>
              <Input name="niNumber" placeholder="e.g. QQ 12 34 56 A" required className="font-mono" />
            </div>
          </CardContent>
        </Card>

        {/* 2. WORK DETAILS */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Work Details</CardTitle>
                <CardDescription>Role, nursery location, assigned room, and employment contract.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Job Title / Role <span className="text-destructive">*</span>
                </label>
                <Input name="jobTitle" placeholder="e.g. Senior Nursery Practitioner" required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Nursery Location / Branch <span className="text-destructive">*</span>
                </label>
                <Input name="nurseryBranch" placeholder="e.g. Bubbly Day Nursery - Main Branch" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Room / Department <span className="text-destructive">*</span>
                </label>
                <Input name="roomDepartment" placeholder="e.g. Toddler Room (2-3 Yrs)" required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Employment Type <span className="text-destructive">*</span>
                </label>
                <select
                  name="employmentType"
                  defaultValue="Full-time"
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                  <option value="Bank">Bank</option>
                  <option value="Agency">Agency</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. DBS DETAILS */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">DBS Details</CardTitle>
                <CardDescription>Disclosure and Barring Service compliance record.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                DBS Certificate Number <span className="text-destructive">*</span>
              </label>
              <Input
                name="dbsCertificateNumber"
                placeholder="e.g. 001594830129"
                required
                className="font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Verify that the enhanced DBS certificate has been checked prior to staff assignment.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 4. ACCOUNT DETAILS */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Account Details</CardTitle>
                <CardDescription>Login credentials for nursery system access.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Username <span className="text-destructive">*</span>
              </label>
              <Input name="username" placeholder="e.g. sjenkins" required className="font-mono" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Password <span className="text-destructive">*</span>
                </label>
                <Input name="password" type="password" placeholder="••••••••" required minLength={6} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Confirm Password <span className="text-destructive">*</span>
                </label>
                <Input name="confirmPassword" type="password" placeholder="••••••••" required minLength={6} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. EMERGENCY CONTACT */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Emergency Contact</CardTitle>
                <CardDescription>Designated contact person in case of emergencies.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Emergency Contact Name <span className="text-destructive">*</span>
                </label>
                <Input name="emergencyContactName" placeholder="e.g. David Jenkins" required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Relationship <span className="text-destructive">*</span>
                </label>
                <Input name="emergencyContactRelationship" placeholder="e.g. Spouse / Parent" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Emergency Contact Number <span className="text-destructive">*</span>
              </label>
              <Input name="emergencyContactNumber" type="tel" placeholder="07700 900456" required />
            </div>
          </CardContent>
        </Card>

        {/* 6. CONFIRMATION */}
        <Card className="shadow-sm border-primary/30 bg-primary/5">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Confirmation & Agreements</CardTitle>
                <CardDescription>Verify accuracy and policy acceptances prior to submission.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="confirmCorrect"
                value="true"
                required
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium leading-tight">
                I confirm the information provided is correct.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreePolicies"
                value="true"
                required
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium leading-tight">
                I agree to follow Bubbly Day Nursery’s staff policies and confidentiality requirements.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                value="true"
                required
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium leading-tight">
                I agree to the Privacy Policy and Terms of Use.
              </span>
            </label>
          </CardContent>
        </Card>

        <div className="pt-2">
          <SubmitButton size="lg" className="w-full text-base font-bold h-12 shadow-lg" loadingText="Registering Staff Member...">
            Complete Staff Registration
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
