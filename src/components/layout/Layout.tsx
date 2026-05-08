import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyBookButton } from "./StickyBookButton";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { BookingDisabledBanner } from "@/components/BookingDisabledBanner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <BookingDisabledBanner />
      <PaymentTestModeBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyBookButton />
    </div>
  );
}
