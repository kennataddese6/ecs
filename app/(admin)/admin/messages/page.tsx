import { requireAdmin } from "@/lib/auth";
import { getContactMessages, ContactMessage } from "@/lib/services/contact";
import { deleteContactMessageAction } from "@/lib/actions/admin-contact";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormError, FormSuccess } from "@/components/ui/form-message";
import { MessageSquare, Trash2, Calendar, Phone, Mail, User } from "lucide-react";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const messages = await getContactMessages();

  const columns: Column<ContactMessage>[] = [
    {
      header: "Customer Contact",
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <User className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold text-sm text-foreground">{row.full_name}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span>{row.email}</span>
          </div>
          {row.phone && (
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 text-emerald-500" />
              <span>{row.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Topic",
      cell: (row) => (
        <Badge variant="secondary" className="font-bold text-[10px] bg-primary/10 text-primary border border-primary/20">
          {row.topic}
        </Badge>
      ),
    },
    {
      header: "Message Inquiry",
      cell: (row) => (
        <div className="max-w-md space-y-1">
          <p className="text-xs text-foreground font-medium whitespace-pre-wrap leading-relaxed">
            {row.message}
          </p>
        </div>
      ),
    },
    {
      header: "Date Received",
      cell: (row) => (
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1" />
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
        <form action={deleteContactMessageAction.bind(null, row.id)}>
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 text-xs font-semibold">
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
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
            <MessageSquare className="h-4 w-4" />
            <span>Customer Service Inbox</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Contact Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customer inquiries and messages submitted via the public Enat Market contact page.
          </p>
        </div>

        <Badge variant="secondary" className="px-3.5 py-1.5 text-xs font-bold bg-primary/10 text-primary border border-primary/20 self-start sm:self-auto">
          {messages.length} Total Messages
        </Badge>
      </div>

      <FormError message={params.error} />
      <FormSuccess message={params.success} />

      <DataTable
        columns={columns}
        data={messages}
        emptyTitle="No customer contact messages received yet"
      />
    </div>
  );
}
