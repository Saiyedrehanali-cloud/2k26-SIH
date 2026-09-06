import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IP-SAKTI Sahayak — Legal AI Assistant | Ministry of Ayush",
  description:
    "RAG-based AI assistant for Ayurveda researchers, startups, and practitioners navigating IP, patent, geographical indication, and biodiversity compliance with zero hallucinated legal claims.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-background text-charcoal flex flex-col font-sans selection:bg-teal-light selection:text-teal">
        {children}
      </body>
    </html>
  );
}
