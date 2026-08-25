import Link from "next/link";
import { Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/60 mt-auto">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 font-black text-xl tracking-wider">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black shadow-md">
                L
              </div>
              <span className="gradient-text font-black tracking-widest text-lg">LUMEN</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              A modern luxury e-commerce experience showcasing curated electronics, artisan goods, and timeless fashion.
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 tracking-wider uppercase">Collection</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li><Link href="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link href="/shop/audio" className="hover:text-foreground transition-colors">Premium Audio</Link></li>
              <li><Link href="/shop/apparel" className="hover:text-foreground transition-colors">Luxury Apparel</Link></li>
              <li><Link href="/shop/accessories" className="hover:text-foreground transition-colors">Artisan Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 tracking-wider uppercase">Editorial & Company</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li><Link href="/news" className="hover:text-foreground transition-colors">Latest News & Journal</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">Our Heritage & Story</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 tracking-wider uppercase">Customer Account</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li><Link href="/account" className="hover:text-foreground transition-colors">My Profile</Link></li>
              <li><Link href="/account/orders" className="hover:text-foreground transition-colors">Order History & Receipts</Link></li>
              <li><Link href="/cart" className="hover:text-foreground transition-colors">Shopping Cart</Link></li>
              <li><Link href="/checkout" className="hover:text-foreground transition-colors">Secure Checkout</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LUMEN Luxury Commerce Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
