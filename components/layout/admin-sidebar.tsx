"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Newspaper,
  Settings,
  ArrowLeft,
  Menu,
  X,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Staff", href: "/admin/staff", icon: Users },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOP HEADER BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-40 w-full">
        <Link href="/admin" className="flex items-center space-x-2 font-bold text-base">
          <div className="relative h-7 w-7 overflow-hidden rounded-lg bg-card border border-border/80 p-0.5 shadow-xs">
            <Image
              src="/logo.png"
              alt="Enat Market Logo"
              width={28}
              height={28}
              className="object-contain h-full w-full"
            />
          </div>
          <span>Admin Portal</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-border bg-muted/50 text-foreground hover:bg-muted focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE-OVER DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-lg p-6 space-y-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <Link href="/admin" className="flex items-center space-x-2 font-bold text-lg">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-card border border-border/80 p-0.5 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Enat Market Logo"
                  width={32}
                  height={32}
                  className="object-contain h-full w-full"
                />
              </div>
              <span>Admin Navigation</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg border border-border bg-muted/50 text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors p-3 rounded-xl border border-border bg-card"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card/60 flex-col min-h-screen shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2 font-bold text-lg">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-card border border-border/80 p-0.5 shadow-sm">
              <Image
                src="/logo.png"
                alt="Enat Market Logo"
                width={32}
                height={32}
                className="object-contain h-full w-full"
              />
            </div>
            <span>Admin Portal</span>
          </Link>
          <ThemeToggle />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors p-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
