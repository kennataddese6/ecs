import { SearchBar } from "@/components/common/search-bar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/services/cart";
import { LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function Navbar() {
  const user = await getCurrentUser();
  const { items } = await getCart();
  const totalCartItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const isAdmin = user && user.user_metadata?.role === "admin";
  const dashboardHref = isAdmin ? "/admin" : "/account";
  const dashboardLabel = isAdmin ? "Admin Dashboard" : "Dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3 font-extrabold text-xl tracking-tight group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-card border border-border/80 shadow-sm flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="Enat Market Logo"
                width={36}
                height={36}
                className="object-contain h-full w-full"
                priority
              />
            </div>
            <span className="gradient-text font-black tracking-wider text-xl">ENAT MARKET</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold tracking-wide">
            <Link href="/shop" className="transition-colors hover:text-primary">
              Shop
            </Link>
            <Link href="/news" className="transition-colors hover:text-primary">
              News
            </Link>
            <Link href="/about" className="transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="w-48 lg:w-64">
            <SearchBar placeholder="Search catalog..." />
          </div>

          <CartDrawer items={items} />

          <ThemeToggle />

          {user ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={dashboardHref}>
                  <LayoutDashboard className="h-4 w-4 mr-1.5" /> {dashboardLabel}
                </Link>
              </Button>
              <form action={logoutAction}>
                <Button variant="ghost" size="icon" title="Sign out" aria-label="Sign out">
                  <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                </Button>
              </form>
            </div>
          ) : (
            <Button size="sm" className="font-semibold shadow-sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Controls & Drawer */}
        <div className="flex md:hidden items-center space-x-2">
          <CartDrawer items={items} />
          <MobileNav
            user={user ? { id: user.id, email: user.email, isAdmin: !!isAdmin } : null}
            totalCartItems={totalCartItems}
          />
        </div>
      </div>
    </header>
  );
}
