"use client";

import * as React from "react";
import { submitContactFormAction } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [isPending, setIsPending] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitContactFormAction(formData);

    setIsPending(false);

    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      setError(res.message);
    }
  };

  if (successMessage) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center space-y-4 shadow-sm">
        <div className="h-14 w-14 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="text-2xl font-black text-foreground tracking-tight">Message Sent Successfully!</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto font-medium leading-relaxed">
          {successMessage}
        </p>
        <Button variant="outline" size="sm" className="font-bold mt-2" onClick={() => setSuccessMessage(null)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-md">
      {error && (
        <div className="flex items-center space-x-2 text-xs font-semibold text-destructive bg-destructive/10 p-3.5 rounded-xl border border-destructive/20">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Full Name *</label>
          <Input name="fullName" placeholder="Abebe Bikila" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address *</label>
          <Input name="email" type="email" placeholder="abebe@example.com" required />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number (Optional)</label>
          <Input name="phone" placeholder="+44 7356 226884" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inquiry Topic</label>
          <select
            name="topic"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs font-medium"
          >
            <option value="General Inquiry">General Store Inquiry</option>
            <option value="Order & Delivery">Order & Delivery Tracking</option>
            <option value="Bulk Purchase">Bulk Purchase / Special Order</option>
            <option value="Product Consultation">Habesha Product & Sizing Question</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message *</label>
        <textarea
          name="message"
          rows={5}
          placeholder="How can our Enat Market customer care team assist you today?"
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
          required
        />
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="w-full font-extrabold shadow-lg rounded-2xl cursor-pointer">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting Message to Enat Care...
          </>
        ) : (
          <>
            Submit Inquiry to Enat Market <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
