import { requireAdmin } from "@/lib/auth";
import { getAllParents } from "@/lib/services/parents";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { deleteParentAction } from "@/lib/actions/admin-parents";
import Link from "next/link";
import { ParentMember } from "@/lib/types";
import { UserPlus, CheckCircle2, HeartHandshake, Phone, Mail, MapPin } from "lucide-react";

export default async function AdminParentsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const parentsList = await getAllParents();

  const columns: Column<ParentMember>[] = [
    {
      header: "Parent / Guardian",
      cell: (row) => (
        <div className="space-y-0.5">
          <span className="font-bold text-foreground block">{row.full_name}</span>
          <span className="text-xs text-muted-foreground block">Role: {row.relationship_to_child}</span>
        </div>
      ),
    },
    {
      header: "Contact Details",
      cell: (row) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-1.5 text-foreground">
            <Mail className="h-3 w-3 text-primary shrink-0" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-muted-foreground">
            <Phone className="h-3 w-3 text-primary shrink-0" />
            <span>{row.mobile_number}</span>
          </div>
          {row.emergency_phone && (
            <div className="text-[11px] text-amber-500 font-medium">
              Emergency: {row.emergency_phone}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Home Address",
      cell: (row) => (
        <div className="flex items-start space-x-1.5 text-xs text-muted-foreground max-w-xs">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <span className="line-clamp-2">{row.address}</span>
        </div>
      ),
    },
    {
      header: "Registered Date",
      cell: (row) => (
        <span className="text-xs text-muted-foreground font-mono">
          {new Date(row.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <form action={deleteParentAction.bind(null, row.id)}>
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
            <HeartHandshake className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-extrabold tracking-tight">Parents Directory</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Registered parents and primary guardians at Bubbly Day Nursery.
          </p>
        </div>

        <Button asChild className="w-full sm:w-auto font-bold shadow-md">
          <Link href="/admin/parents/new">
            <UserPlus className="h-4 w-4 mr-2" /> Register New Parent
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
        data={parentsList}
        emptyTitle="No parents registered"
        emptyDescription="Click 'Register New Parent' above to add your first parent record."
      />
    </div>
  );
}
