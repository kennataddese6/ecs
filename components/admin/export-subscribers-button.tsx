"use client";

import * as React from "react";
import { NewsletterSubscriber } from "@/lib/services/newsletter";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportSubscribersButton({
  subscribers,
}: {
  subscribers: NewsletterSubscriber[];
}) {
  const exportCSV = () => {
    if (!subscribers || subscribers.length === 0) return;

    const headers = ["ID", "Email", "Status", "Subscribed Date"];
    const rows = subscribers.map((sub) => [
      `"${sub.id}"`,
      `"${sub.email}"`,
      `"${sub.status}"`,
      `"${new Date(sub.created_at).toISOString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `enat_market_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportCSV}
      disabled={subscribers.length === 0}
      className="font-bold text-xs shadow-xs"
    >
      <Download className="h-4 w-4 mr-1.5" /> Export Email List (CSV)
    </Button>
  );
}
