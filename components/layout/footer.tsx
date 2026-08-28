import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/60 mt-auto">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 font-black text-xl tracking-wider">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-card border border-border/80 shadow-sm flex items-center justify-center p-1">
                <Image
                  src="/logo.png"
                  alt="Enat Market Logo"
                  width={36}
                  height={36}
                  className="object-contain h-full w-full"
                />
              </div>
              <span className="gradient-text font-black tracking-wider text-xl">ENAT MARKET</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Your trusted authentic Habesha marketplace for Ethiopian specialty items, coffee beans, traditional textiles, spices, and daily household goods.
            </p>
            <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <a href="mailto:shop@enatmarket.co.uk" className="hover:text-primary transition-colors">
                  shop@enatmarket.co.uk
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <a href="tel:+447356226884" className="hover:text-primary transition-colors font-medium">
                  +44 7356 226884
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground pt-2">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 tracking-wider uppercase">Collections</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li><Link href="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link href="/shop/apparel" className="hover:text-foreground transition-colors">Traditional Habesha Apparel</Link></li>
              <li><Link href="/shop/coffee" className="hover:text-foreground transition-colors">Ethiopian Coffee & Buna</Link></li>
              <li><Link href="/shop/spices" className="hover:text-foreground transition-colors">Gourmet Spices & Niter Kibe</Link></li>
              <li><Link href="/shop/crafts" className="hover:text-foreground transition-colors">Artisan Mesob & Crafts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 tracking-wider uppercase">Editorial & Company</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li><Link href="/news" className="hover:text-foreground transition-colors">Cultural Journal & Stories</Link></li>
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
          <p>&copy; {new Date().getFullYear()} Enat Market. All rights reserved.</p>
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
