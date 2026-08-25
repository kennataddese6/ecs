"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center space-x-2 text-emerald-500 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 max-w-md mx-auto">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-semibold">Thank you! You have successfully subscribed to LUMEN journal.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto w-full">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address..."
        className="h-12 bg-background/80 border-border text-foreground"
        required
      />
      <Button type="submit" size="lg" className="h-12 px-6 w-full sm:w-auto font-semibold shadow-md whitespace-nowrap">
        Subscribe <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
