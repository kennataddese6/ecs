import { requireAdmin } from "@/lib/auth";
import { getAllStudents } from "@/lib/services/students";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteStudentAction } from "@/lib/actions/admin-students";
import Link from "next/link";
import { StudentMember } from "@/lib/types";
import { UserPlus, CheckCircle2, GraduationCap, UserCheck, HeartHandshake, AlertCircle } from "lucide-react";

export default async function AdminStudentsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const studentsList = await getAllStudents();

  const columns: Column<StudentMember>[] = [
    {
      header: "Child / Student",
      cell: (row) => (
        <div className="space-y-0.5">
          <span className="font-bold text-foreground block">{row.full_name}</span>
          <span className="text-xs text-muted-foreground block">
            Gender: {row.gender} • DOB: {new Date(row.date_of_birth).toLocaleDateString("en-GB")}
          </span>
        </div>
      ),
    },
    {
      header: "Room / Department",
      cell: (row) => (
        <Badge variant="secondary" className="font-medium text-xs">
          {row.room_department}
        </Badge>
      ),
    },
    {
      header: "Linked Parent / Guardian",
      cell: (row) => (
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-foreground">
          <HeartHandshake className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>{row.parent_name || "Linked Parent"}</span>
        </div>
      ),
    },
    {
      header: "Assigned Staff Member",
      cell: (row) => (
        <div className="flex items-center space-x-1.5 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 w-fit">
          <UserCheck className="h-3.5 w-3.5 shrink-0" />
          <span>{row.staff_name || "Assigned Staff"}</span>
        </div>
      ),
    },
    {
      header: "Allergies & Medical Notes",
      cell: (row) => (
        <div className="space-y-1 text-xs">
          {row.allergies ? (
            <div className="flex items-center space-x-1 text-destructive font-semibold">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Allergies: {row.allergies}</span>
            </div>
          ) : (
            <span className="text-muted-foreground block">No recorded allergies</span>
          )}
          {row.medical_notes && (
            <span className="text-[11px] text-muted-foreground block italic">
              Note: {row.medical_notes}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <form action={deleteStudentAction.bind(null, row.id)}>
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 text-xs font-semibold">
            Remove
          </Button>
        </form>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-extrabold tracking-tight">Students Directory</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Registered children/students at Bubbly Day Nursery, linked to Parents and assigned Staff members (max 3 students per staff).
          </p>
        </div>

        <Button asChild className="w-full sm:w-auto font-bold shadow-md">
          <Link href="/admin/students/new">
            <UserPlus className="h-4 w-4 mr-2" /> Register New Student
          </Link>
        </Button>
      </div>

      {params.error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
          {params.error}
        </div>
      )}

      {params.success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 text-sm font-medium border border-emerald-500/20 flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>{params.success}</span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={studentsList}
        emptyTitle="No students registered"
        emptyDescription="Click 'Register New Student' above to enroll a child and link to Parent and Staff."
      />
    </div>
  );
}
