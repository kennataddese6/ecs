import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lumen-store.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "LUMEN | Modern Premium E-Commerce",
    template: "%s | LUMEN Store",
  },
  description: "Curated collection of luxury lifestyle goods, precision electronics, and timeless essentials.",
  keywords: ["ecommerce", "luxury goods", "modern design", "curated storefront", "premium acoustics"],
  authors: [{ name: "LUMEN Design Studio" }],
  creator: "LUMEN",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "LUMEN Store",
    title: "LUMEN | Modern Premium E-Commerce",
    description: "Curated collection of luxury lifestyle goods, precision electronics, and timeless essentials.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMEN | Modern Premium E-Commerce",
    description: "Curated collection of luxury lifestyle goods, precision electronics, and timeless essentials.",
    creator: "@lumenstore",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
