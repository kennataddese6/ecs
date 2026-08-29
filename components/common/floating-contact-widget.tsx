"use client";

import * as React from "react";
import { Phone, X, MessageSquare, Sparkles, ChevronUp, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasPrompted, setHasPrompted] = React.useState(false);

  // Auto-show a quick subtle prompt badge on initial load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl =
    "https://wa.me/447356226884?text=Hello%20Enat%20Market!%20I%20have%20a%20question%20about%20your%20Habesha%20products,%20sizing,%20stock,%20or%20delivery.";

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Expanded Quick Action Popover Card */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-[310px] sm:w-[340px] rounded-3xl bg-card border-2 border-emerald-500/30 p-4 shadow-2xl space-y-3 animate-in slide-in-from-bottom-4 zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold">
                  <MessageSquare className="h-4.5 w-4.5" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-foreground">Enat Market Support</h4>
                <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Online • Usually replies in minutes</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Have a question about Habesha clothing sizes, spice ingredients, coffee roast, or UK delivery?
          </p>

          <div className="space-y-2 pt-1">
            {/* WhatsApp Chat Option */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between p-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <div className="flex items-center space-x-3">
                {/* Official WhatsApp SVG Icon */}
                <svg
                  className="h-6 w-6 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.733 1.474h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.175-1.238-6.161-3.48-8.404z" />
                </svg>
                <div className="text-left">
                  <span className="block font-extrabold text-sm leading-tight">Chat on WhatsApp</span>
                  <span className="block text-[10px] opacity-90 font-medium">Instant messaging & photos</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            {/* Direct Phone Call Option */}
            <a
              href="tel:+447356226884"
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between p-3 rounded-2xl bg-muted/80 hover:bg-muted text-foreground border border-border shadow-xs hover:shadow transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm leading-tight">+44 7356 226884</span>
                  <span className="block text-[10px] text-muted-foreground font-medium">Direct Phone Call</span>
                </div>
              </div>
              <span className="text-[11px] font-extrabold text-primary group-hover:underline">Call Now</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="pointer-events-auto flex items-center space-x-2">
        {/* Subtle helper text tooltip badge for desktop */}
        {hasPrompted && !isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 bg-card/95 backdrop-blur-md border border-emerald-500/30 px-3.5 py-2 rounded-2xl shadow-xl text-xs font-bold text-foreground cursor-pointer hover:bg-card transition-all animate-in fade-in slide-in-from-right-3 duration-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Questions? Chat or Call Us</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative h-13 w-13 sm:h-14 sm:w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
            isOpen
              ? "bg-foreground text-background border-2 border-border"
              : "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-2 border-white/30 shadow-emerald-500/25"
          }`}
          aria-label="Contact Customer Support via WhatsApp or Call"
          title="Contact Customer Support"
        >
          {/* Online green indicator pulse dot */}
          {!isOpen && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-emerald-400 border-2 border-white ring-2 ring-emerald-500/40 animate-pulse" />
          )}

          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="flex items-center justify-center">
              {/* WhatsApp Icon */}
              <svg
                className="h-7 w-7 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.733 1.474h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.175-1.238-6.161-3.48-8.404z" />
              </svg>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
