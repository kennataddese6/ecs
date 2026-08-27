import { requireAdmin } from "@/lib/auth";
import { getAllStaff } from "@/lib/services/staff";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteStaffAction } from "@/lib/actions/admin-staff";
import Link from "next/link";
import { StaffMember } from "@/lib/types";
import { UserPlus, CheckCircle2, ShieldCheck, Phone, Building2, UserCheck } from "lucide-react";

export default async function AdminStaffDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const staffList = await getAllStaff();

  const columns: Column<StaffMember>[] = [
    {
      header: "Staff Member",
      cell: (row) => (
        <div className="space-y-0.5">
          <span className="font-bold text-foreground block">{row.full_name}</span>
          {row.preferred_name && (
            <span className="text-xs text-muted-foreground block">Known as: &quot;{row.preferred_name}&quot;</span>
          )}
          <span className="text-[11px] text-primary font-mono block">@{row.username}</span>
        </div>
      ),
    },
    {
      header: "Work & Department",
      cell: (row) => (
        <div className="space-y-1">
          <span className="font-semibold text-xs block">{row.job_title}</span>
          <span className="text-xs text-muted-foreground block">
            📍 {row.room_department}
          </span>
          <div className="flex items-center space-x-1 text-[11px] text-muted-foreground">
            <Building2 className="h-3 w-3 text-primary shrink-0" />
            <span className="line-clamp-1">{row.nursery_branch}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Employment",
      cell: (row) => (
        <Badge variant="secondary" className="capitalize text-xs font-semibold">
          {row.employment_type}
        </Badge>
      ),
    },
    {
      header: "DBS & NI Number",
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-500">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="font-mono text-[11px]">DBS: {row.dbs_certificate_number}</span>
          </div>
          <span className="text-[11px] text-muted-foreground block font-mono">NI: {row.ni_number}</span>
        </div>
      ),
    },
    {
      header: "Contact Details",
      cell: (row) => (
        <div className="space-y-1 text-xs">
          <span className="block text-foreground">{row.email}</span>
          <span className="text-muted-foreground block">📱 {row.mobile_number}</span>
          <div className="text-[11px] text-muted-foreground border-t border-border/50 pt-1 mt-1">
            <span className="font-semibold block text-foreground">Emergency: {row.emergency_contact_name} ({row.emergency_contact_relationship})</span>
            <span><Phone className="h-2.5 w-2.5 inline mr-1" />{row.emergency_contact_number}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Students Assigned",
      cell: (row) => {
        const count = row.assigned_students_count ?? 0;
        const maxLimit = 3;
        return (
          <div className="space-y-1">
            <Badge
              variant={count >= maxLimit ? "destructive" : "outline"}
              className="text-xs font-bold"
            >
              {count} / {maxLimit} Students
            </Badge>
            <p className="text-[10px] text-muted-foreground">
              {count >= maxLimit ? "Full Capacity" : `${maxLimit - count} slots available`}
            </p>
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <form action={deleteStaffAction.bind(null, row.id)}>
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
            <UserCheck className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-extrabold tracking-tight">Staff Management</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Bubbly Day Nursery staff directory, DBS compliance records, and student capacity (max 3 students per staff).
          </p>
        </div>

        <Button asChild className="w-full sm:w-auto font-bold shadow-md">
          <Link href="/admin/staff/new">
            <UserPlus className="h-4 w-4 mr-2" /> Register New Staff
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
        data={staffList}
        emptyTitle="No staff members registered"
        emptyDescription="Click 'Register New Staff' above to add your first staff member."
      />
    </div>
  );
}
