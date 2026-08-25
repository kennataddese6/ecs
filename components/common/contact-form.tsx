"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [isPending, setIsPending] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    await new Promise((r) => setTimeout(r, 800));

    setIsPending(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-4">
        <div className="h-12 w-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Message Sent Successfully!</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Thank you for reaching out to LUMEN Concierge. A member of our dedicated team will respond within 24 hours.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
      {error && (
        <div className="flex items-center space-x-2 text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Full Name</label>
          <Input name="fullName" placeholder="Jane Doe" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
          <Input name="email" type="email" placeholder="jane@example.com" required />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number (Optional)</label>
          <Input name="phone" placeholder="+1 (555) 000-0000" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic / Concern</label>
          <select
            name="topic"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm font-medium"
          >
            <option value="order">Order & Shipment Tracking</option>
            <option value="product">Product Consultation</option>
            <option value="warranty">Warranty & Repairs</option>
            <option value="general">General Inquiries</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
        <textarea
          name="message"
          rows={5}
          placeholder="How can our concierge team assist you today?"
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          required
        />
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="w-full font-bold shadow-lg shadow-primary/20">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending Message...
          </>
        ) : (
          <>
            Submit Message <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
