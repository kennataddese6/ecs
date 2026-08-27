import Link from "next/link";
import { getAllParents } from "@/lib/services/parents";
import { getAllStaff } from "@/lib/services/staff";
import { countStaffAssignedStudents } from "@/lib/services/students";
import { createStudentAction } from "@/lib/actions/admin-students";
import { SubmitButton } from "@/components/common/submit-button";
import { FormError } from "@/components/ui/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Baby, HeartHandshake, UserCheck, AlertTriangle } from "lucide-react";

export default async function NewStudentRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const [parents, staffList] = await Promise.all([getAllParents(), getAllStaff()]);

  // Compute staff student capacity
  const staffWithCapacity = await Promise.all(
    staffList.map(async (st) => {
      const count = await countStaffAssignedStudents(st.id);
      return {
        ...st,
        currentCount: count,
        isFull: count >= 3,
      };
    })
  );

  return (
    <div className="max-w-2xl space-y-6 pb-12">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/students">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Students Directory
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Register New Student / Child</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enroll a child into Bubbly Day Nursery, link to a Parent, and assign a Staff key worker (max 3 students per staff).
        </p>
      </div>

      <FormError message={params.error} />

      {parents.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>No registered Parents found. You must register a Parent before adding a student.</span>
          </div>
          <Button size="sm" variant="outline" asChild className="ml-4 whitespace-nowrap">
            <Link href="/admin/parents/new">Add Parent First</Link>
          </Button>
        </div>
      )}

      {staffList.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>No Staff members found. Please register Staff prior to assigning students.</span>
          </div>
          <Button size="sm" variant="outline" asChild className="ml-4 whitespace-nowrap">
            <Link href="/admin/staff/new">Add Staff First</Link>
          </Button>
        </div>
      )}

      <form action={createStudentAction} className="space-y-6">
        {/* CHILD DETAILS */}
        <Card>
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Baby className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Child Information</CardTitle>
                <CardDescription>Full legal name, date of birth, and assigned nursery room.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Child Full Name <span className="text-destructive">*</span>
              </label>
              <Input name="fullName" placeholder="e.g. Oliver Thompson" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Date of Birth <span className="text-destructive">*</span>
                </label>
                <Input name="dateOfBirth" type="date" required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Gender <span className="text-destructive">*</span>
                </label>
                <select
                  name="gender"
                  defaultValue="Male"
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm font-medium"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Room / Department <span className="text-destructive">*</span>
              </label>
              <select
                name="roomDepartment"
                defaultValue="Toddler Room (2-3 Yrs)"
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm font-medium"
                required
              >
                <option value="Baby Room (0-2 Yrs)">Baby Room (0-2 Yrs)</option>
                <option value="Toddler Room (2-3 Yrs)">Toddler Room (2-3 Yrs)</option>
                <option value="Pre-School Room (3-5 Yrs)">Pre-School Room (3-5 Yrs)</option>
                <option value="After School Care">After School Care</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* LINKING TO PARENT & ASSIGNING TO STAFF */}
        <Card>
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Parent & Staff Linking</CardTitle>
                <CardDescription>Link student to Parent and assign Key Worker Staff (Max 3 students per staff).</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Link to Parent / Guardian <span className="text-destructive">*</span>
              </label>
              <select
                name="parentId"
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm font-medium"
                required
              >
                <option value="">Select Parent...</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.relationship_to_child}) — {p.mobile_number}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Assign Key Worker Staff <span className="text-destructive">*</span>
              </label>
              <select
                name="staffId"
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm font-medium"
                required
              >
                <option value="">Select Staff Member...</option>
                {staffWithCapacity.map((st) => (
                  <option key={st.id} value={st.id} disabled={st.isFull}>
                    {st.full_name} ({st.job_title} - {st.room_department}) — {st.isFull ? "⚠️ FULL (3/3 Students Assigned)" : `${st.currentCount}/3 Students Assigned`}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground">
                Rules: Maximum 3 students can be assigned to one staff member. Staff members with 3 assigned students are disabled.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* MEDICAL & ALLERGIES */}
        <Card>
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Medical Notes & Dietary Requirements</CardTitle>
                <CardDescription>Optional dietary, allergy, or medical considerations.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Known Allergies
              </label>
              <Input name="allergies" placeholder="e.g. Peanuts, Dairy, Egg" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Medical Notes / Special Instructions
              </label>
              <textarea
                name="medicalNotes"
                className="flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm min-h-[80px]"
                placeholder="e.g. Requires inhaler, carries EpiPen, dietary restrictions..."
              />
            </div>
          </CardContent>
        </Card>

        <SubmitButton size="lg" className="w-full font-bold h-12 shadow-lg" loadingText="Registering Student...">
          Complete Student Registration & Link Staff
        </SubmitButton>
      </form>
    </div>
  );
}
