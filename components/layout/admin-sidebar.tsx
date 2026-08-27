"use client";

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
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/60 flex flex-col min-h-screen">
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

      <nav className="flex-1 p-4 space-y-1">
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
  );
}
