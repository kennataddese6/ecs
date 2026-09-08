import { ThemeToggle } from "@/components/theme/theme-toggle";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-3 font-extrabold text-2xl group">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-card border border-border/80 p-1 shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/enat-market-logo-amharic.png"
                alt="Enat Market Logo"
                width={40}
                height={40}
                className="object-contain h-full w-full"
                priority
              />
            </div>
            <span className="gradient-text font-black tracking-wider text-2xl">ENAT MARKET</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
