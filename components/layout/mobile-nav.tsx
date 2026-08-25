"use client";

import * as React from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { Menu, X, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SearchBar } from "@/components/common/search-bar";

interface MobileNavProps {
  user: { id: string; email?: string } | null;
  totalCartItems: number;
}

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const searchOverlay = isSearchOpen && mounted ? (
    ReactDOM.createPortal(
      <div className="fixed top-16 left-0 right-0 p-4 bg-background border-b border-border shadow-2xl z-[100] animate-in slide-in-from-top duration-200">
        <SearchBar />
      </div>,
      document.body
    )
  ) : null;

  const menuOverlay = isOpen && mounted ? (
    ReactDOM.createPortal(
      <div className="fixed inset-0 top-16 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-6 space-y-6 animate-in slide-in-from-top duration-200 border-t border-border">
        <nav className="flex flex-col space-y-4 text-lg font-semibold">
          <Link
            href="/shop"
            onClick={() => setIsOpen(false)}
            className="py-2 border-b border-border/50 hover:text-primary transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/news"
            onClick={() => setIsOpen(false)}
            className="py-2 border-b border-border/50 hover:text-primary transition-colors"
          >
            News
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="py-2 border-b border-border/50 hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="py-2 border-b border-border/50 hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">Toggle Theme</span>
          </div>

          {user ? (
            <Button size="sm" asChild onClick={() => setIsOpen(false)}>
              <Link href="/account">
                <User className="h-4 w-4 mr-2" /> Account
              </Link>
            </Button>
          ) : (
            <Button size="sm" asChild onClick={() => setIsOpen(false)}>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <div className="flex md:hidden items-center space-x-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        aria-label="Toggle search"
      >
        <Search className="h-5 w-5 text-muted-foreground" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {searchOverlay}
      {menuOverlay}
    </div>
  );
}
