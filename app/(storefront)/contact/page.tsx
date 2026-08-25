import { ContactForm } from "@/components/common/contact-form";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Enat Market Support",
  description: "Get in touch with Enat Market's customer service team for product support, order tracking, and general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="space-y-12 py-6 max-w-6xl mx-auto">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="secondary" className="mb-1">Dedicated Customer Support</Badge>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Contact Enat Market</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Have a question about our products, an existing order, or special inquiries? Our team is happy to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-primary">
              <Mail className="h-5 w-5" />
              <h3 className="font-bold text-base text-foreground">Email Support</h3>
            </div>
            <p className="text-xs text-muted-foreground">Direct access to our customer care team.</p>
            <a href="mailto:shop@enatmarket.co.uk" className="font-semibold text-sm hover:text-primary transition-colors block">
              shop@enatmarket.co.uk
            </a>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-primary">
              <Phone className="h-5 w-5" />
              <h3 className="font-bold text-base text-foreground">Phone Hotline</h3>
            </div>
            <p className="text-xs text-muted-foreground">Direct client support line.</p>
            <div className="font-semibold text-sm space-y-1">
              <a href="tel:07830682710" className="hover:text-primary transition-colors block">07830 682710</a>
              <a href="tel:02035760507" className="hover:text-primary transition-colors block">0203 576 0507</a>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-primary">
              <MapPin className="h-5 w-5" />
              <h3 className="font-bold text-base text-foreground">Enat Market UK</h3>
            </div>
            <p className="text-xs text-muted-foreground">United Kingdom Storefront & Delivery Service</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-primary">
              <Clock className="h-5 w-5" />
              <h3 className="font-bold text-base text-foreground">Operating Hours</h3>
            </div>
            <p className="text-xs text-muted-foreground">Monday – Saturday: 9:00 AM – 7:00 PM GMT<br />Sunday: 10:00 AM – 5:00 PM GMT</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
