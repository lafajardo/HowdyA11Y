import type { Metadata } from "next";
import { SkipNav } from "@/components/layout/SkipNav";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProgressProvider } from "@/context/ProgressContext";
import { ChallengeContextProvider } from "@/context/ChallengeContext";
import { MentorChat } from "@/components/ai/MentorChat";
import "./globals.css";

export const metadata: Metadata = {
  title: "Howdy A11y — Wrangle Web Accessibility",
  description:
    "Learn WCAG standards by wrangling accessibility outlaws across the digital frontier. An interactive quest-based adventure for developers.",
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
          <ChallengeContextProvider>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <MentorChat />
          </ChallengeContextProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
