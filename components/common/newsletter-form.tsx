"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { subscribeNewsletterAction } from "@/lib/actions/newsletter";

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await subscribeNewsletterAction(email);
      if (res.success) {
        setSuccessMessage(res.message);
        setEmail("");
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 p-4 rounded-xl border border-emerald-500/30 max-w-lg mx-auto shadow-sm">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-bold text-center">{successMessage}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-md mx-auto w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address..."
          className="h-12 bg-background/90 border-border text-foreground rounded-xl shadow-xs"
          disabled={submitting}
          required
        />
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="h-12 px-6 w-full sm:w-auto font-bold shadow-md rounded-xl whitespace-nowrap cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing...
            </>
          ) : (
            <>
              Subscribe <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {errorMessage && (
        <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
