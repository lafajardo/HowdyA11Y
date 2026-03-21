import type { Metadata } from "next";
import { SkipNav } from "@/components/layout/SkipNav";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProgressProvider } from "@/context/ProgressContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "a11y Roundup - Wrangle Web Accessibility",
  description:
    "Saddle up and learn WCAG standards by wrangling real accessibility outlaws. An interactive Wild West adventure for developers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rye&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <SkipNav />
        <ProgressProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ProgressProvider>
      </body>
    </html>
  );
}
