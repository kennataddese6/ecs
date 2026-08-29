import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingContactWidget } from "@/components/common/floating-contact-widget";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground">
      {/* Background Ambient Warm Glowing Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-amber-500/12 via-primary/6 to-transparent rounded-full blur-3xl opacity-80 dark:opacity-40" />
        <div className="absolute top-[35%] -left-[15%] w-[700px] h-[700px] bg-emerald-600/6 rounded-full blur-3xl opacity-70 dark:opacity-20" />
        <div className="absolute top-[65%] -right-[15%] w-[800px] h-[800px] bg-amber-600/8 rounded-full blur-3xl opacity-70 dark:opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <Navbar />
      <main className="flex-1 w-full min-w-0">
        {children}
      </main>
      <Footer />
      <FloatingContactWidget />
    </div>
  );
}
