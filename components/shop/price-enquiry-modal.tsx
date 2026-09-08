"use client";

import * as React from "react";
import { submitContactFormAction } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquareText,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

interface PriceEnquiryModalProps {
  product: {
    id: string;
    name: string;
    sku?: string | null;
    slug: string;
  };
  className?: string;
}

export function PriceEnquiryModal({ product, className }: PriceEnquiryModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Close modal on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const rawFormData = new FormData(e.currentTarget);
    const fullName = (rawFormData.get("fullName") as string)?.trim();
    const email = (rawFormData.get("email") as string)?.trim();
    const phone = (rawFormData.get("phone") as string)?.trim();
    const quantity = (rawFormData.get("quantity") as string) || "1";
    const notes = (rawFormData.get("notes") as string)?.trim() || "";

    const combinedMessage = [
      `PRICE QUOTE REQUEST for product: "${product.name}"`,
      product.sku ? `SKU: ${product.sku}` : null,
      `Requested Quantity: ${quantity}`,
      phone ? `Customer Contact Phone: ${phone}` : null,
      notes ? `Customer Notes / Questions: ${notes}` : null,
      `Action Needed: Please provide pricing and send secure payment link once agreed.`,
    ]
      .filter(Boolean)
      .join("\n");

    const submissionData = new FormData();
    submissionData.append("fullName", fullName);
    submissionData.append("email", email);
    if (phone) submissionData.append("phone", phone);
    submissionData.append("topic", "Price Quote Request");
    submissionData.append("message", combinedMessage);

    const res = await submitContactFormAction(submissionData);
    setIsPending(false);

    if (res.success) {
      setSuccessMessage(
        `Your price quote inquiry for "${product.name}" has been received! Our sales team will contact you shortly with the quotation and a secure payment link.`
      );
    } else {
      setError(res.message);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Enat Market! I am inquiring about the price for "${product.name}"${
      product.sku ? ` (SKU: ${product.sku})` : ""
    }. Could you please provide a quotation and payment link?`
  );

  return (
    <>
      <Button
        type="button"
        size="lg"
        onClick={() => {
          setIsOpen(true);
          setError(null);
        }}
        className={`w-full h-13 text-base font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 cursor-pointer ${className || ""}`}
      >
        <MessageSquareText className="h-5 w-5 mr-2" />
        Request Price &bull; Enquire Now
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full mb-2">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Price on Request</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">{product.name}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                This item has negotiable or custom pricing. Submit your inquiry below and we will
                send you a verified payment link once terms are agreed.
              </p>
            </div>

            {successMessage ? (
              <div className="space-y-4 py-4 text-center">
                <div className="h-14 w-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Inquiry Sent Successfully</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {successMessage}
                </p>
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setSuccessMessage(null);
                    }}
                    className="font-bold"
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Your Full Name *</label>
                    <Input name="fullName" placeholder="e.g. Almaz Kebede" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Email Address *</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="almaz@example.co.uk"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">
                      Phone / WhatsApp Number
                    </label>
                    <Input name="phone" placeholder="+44 7..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Quantity Needed</label>
                    <Input name="quantity" type="number" min="1" defaultValue="1" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">
                    Delivery Postcode or Special Requests (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="e.g. Can you courier to London? What is your bulk discount for 5 units?"
                    className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isPending ? "Submitting Inquiry..." : "Submit Price Request"}
                </Button>

                {/* Instant Contact Divider */}
                <div className="pt-2 border-t border-border space-y-2 text-center">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Or Contact Us Directly for Instant Quotation:
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`https://wa.me/447356226884?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold transition-colors text-emerald-600 dark:text-emerald-400"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp Us</span>
                    </a>

                    <a
                      href="tel:+447356226884"
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold transition-colors text-foreground"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call Hotline</span>
                    </a>
                  </div>
                </div>
              </form>
            )}

            <div className="flex items-center justify-center space-x-2 text-[11px] text-muted-foreground pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Official Enat Market UK Verified Quotation &bull; Zero Spam</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
