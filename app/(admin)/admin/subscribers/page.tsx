import { requireAdmin } from "@/lib/auth";
import { getNewsletterSubscribers, NewsletterSubscriber } from "@/lib/services/newsletter";
import { deleteSubscriberAction } from "@/lib/actions/newsletter";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormError, FormSuccess } from "@/components/ui/form-message";
import { ExportSubscribersButton } from "@/components/admin/export-subscribers-button";
import { Mail, Trash2, Calendar, UserCheck, Megaphone } from "lucide-react";

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const subscribers = await getNewsletterSubscribers();

  const columns: Column<NewsletterSubscriber>[] = [
    {
      header: "Subscriber Email",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Mail className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="font-bold text-sm text-foreground block">{row.email}</span>
            <span className="text-[10px] text-muted-foreground block font-mono">ID: {row.id.substring(0, 8)}...</span>
          </div>
        </div>
      ),
    },
    {
      header: "Subscription Status",
      cell: (row) => (
        <Badge
          variant={row.status === "ACTIVE" ? "secondary" : "outline"}
          className={`capitalize font-bold text-[10px] ${
            row.status === "ACTIVE"
              ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
              : ""
          }`}
        >
          <UserCheck className="h-3 w-3 mr-1" /> {row.status}
        </Badge>
      ),
    },
    {
      header: "Subscribed Date",
      cell: (row) => (
        <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
          <span>
            {new Date(row.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <form action={deleteSubscriberAction.bind(null, row.id)}>
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 text-xs font-semibold">
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
          </Button>
        </form>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Megaphone className="h-4 w-4" />
            <span>Marketing & Customer Outreach</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Newsletter Subscribers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View all customer emails subscribed to Enat Market promotions, cultural stories, and product adverts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="px-3.5 py-1.5 text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            {subscribers.length} Total Subscribers
          </Badge>

          <ExportSubscribersButton subscribers={subscribers} />
        </div>
      </div>

      <FormError message={params.error} />
      <FormSuccess message={params.success} />

      <DataTable
        columns={columns}
        data={subscribers}
        emptyTitle="No newsletter subscribers registered yet"
      />
    </div>
  );
}
