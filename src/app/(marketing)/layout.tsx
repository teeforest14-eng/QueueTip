import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-qt-display",
  display: "swap",
});

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${display.variable} marketing-root flex min-h-full flex-col bg-qt-mist text-qt-text antialiased`}
    >
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
