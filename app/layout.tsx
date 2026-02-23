import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lighthouse Christian Assembly",
  description: "Welcome to Lighthouse Christian Assembly - A place of faith, community, and spiritual growth.",
  icons: {
    icon: "/LCA Logo - no bg.png",
  },
  openGraph: {
    title: "Lighthouse Christian Assembly",
    description: "Welcome to Lighthouse Christian Assembly - A place of faith, community, and spiritual growth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream text-gray-900">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
