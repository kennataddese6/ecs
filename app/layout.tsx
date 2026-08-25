import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Enat Market | Quality Products & Daily Essentials",
    template: "%s | Enat Market",
  },
  description: "Your trusted marketplace for premium curated lifestyle products, food items, and daily essentials.",
  keywords: ["ecommerce", "enat market", "online shopping", "quality essentials", "curated marketplace"],
  authors: [{ name: "Enat Market Team" }],
  creator: "Enat Market",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Enat Market",
    title: "Enat Market | Quality Products & Daily Essentials",
    description: "Your trusted marketplace for premium curated lifestyle products, food items, and daily essentials.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enat Market | Quality Products & Daily Essentials",
    description: "Your trusted marketplace for premium curated lifestyle products, food items, and daily essentials.",
    creator: "@enatmarket",
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
