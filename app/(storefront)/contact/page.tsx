import { ContactForm } from "@/components/common/contact-form";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | LUMEN Concierge Service",
  description: "Get in touch with LUMEN's dedicated concierge team for product support, order tracking, and general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="space-y-12 py-6 max-w-6xl mx-auto">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="secondary" className="mb-1">24/7 Dedicated Support</Badge>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Contact Concierge</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Have a question about our products, an existing order, or bespoke inquiries? Our team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-primary">
              <Mail className="h-5 w-5" />
              <h3 className="font-bold text-base text-foreground">Email Support</h3>
            </div>
            <p className="text-xs text-muted-foreground">Direct access to our client advisors.</p>
            <p className="font-semibold text-sm">concierge@lumenstore.com</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-primary">
              <Phone className="h-5 w-5" />
              <h3 className="font-bold text-base text-foreground">Phone Concierge</h3>
            </div>
            <p className="text-xs text-muted-foreground">Toll-free client assistance hotline.</p>
            <p className="font-semibold text-sm">+1 (800) 586-3688</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-primary">
              <MapPin className="h-5 w-5" />
              <h3 className="font-bold text-base text-foreground">Flagship Showroom</h3>
            </div>
            <p className="text-xs text-muted-foreground">750 5th Avenue, Suite 1200<br />New York, NY 10019</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-primary">
              <Clock className="h-5 w-5" />
              <h3 className="font-bold text-base text-foreground">Operating Hours</h3>
            </div>
            <p className="text-xs text-muted-foreground">Monday – Friday: 9:00 AM – 8:00 PM EST<br />Saturday: 10:00 AM – 6:00 PM EST</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
