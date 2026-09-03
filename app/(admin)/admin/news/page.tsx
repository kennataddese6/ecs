import Link from "next/link";
import { getAllAdminNews } from "@/lib/services/admin";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deleteNewsAction } from "@/lib/actions/admin-news";

export const dynamic = "force-dynamic";

type NewsRow = Awaited<ReturnType<typeof getAllAdminNews>>[number];

export default async function AdminNewsPage() {
  const news = await getAllAdminNews();

  const columns: Column<NewsRow>[] = [
    {
      header: "Title",
      cell: (row) => (
        <div>
          <span className="font-semibold block line-clamp-1">{row.title}</span>
          <span className="text-xs text-muted-foreground">/{row.slug}</span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant={row.published ? "secondary" : "outline"}>
          {row.published ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      header: "Published At",
      cell: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.published_at ? new Date(row.published_at).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/news/${row.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <form action={deleteNewsAction.bind(null, row.id)}>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">News & Content</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage store news, announcements, and editorial articles.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/news/new">
            <Plus className="h-4 w-4 mr-2" /> Add News Article
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={news} emptyTitle="No news articles created yet" />
    </div>
  );
}
