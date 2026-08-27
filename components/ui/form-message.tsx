import * as React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormMessageProps {
  message?: string | null;
  className?: string;
}

export function FormError({ message, className }: FormMessageProps) {
  if (!message) return null;
  return (
    <div
      className={cn(
        "p-4 rounded-2xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-start space-x-3 shadow-xs animate-in fade-in duration-200",
        className
      )}
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <span className="flex-1 leading-normal">{decodeURIComponent(message)}</span>
    </div>
  );
}

export function FormSuccess({ message, className }: FormMessageProps) {
  if (!message) return null;
  return (
    <div
      className={cn(
        "p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-500/20 flex items-start space-x-3 shadow-xs animate-in fade-in duration-200",
        className
      )}
    >
      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <span className="flex-1 leading-normal">{decodeURIComponent(message)}</span>
    </div>
  );
}
