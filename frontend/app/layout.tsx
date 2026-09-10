import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vigyan Veda — AI-Powered Ayush IP & Innovation Assistant",
  description:
    "Vigyan Veda: Multilingual RAG-based AI assistant for Ayurveda researchers, startups, and practitioners navigating IP, patent exclusions (§ 3p/3e), TKDL prior art, and biodiversity compliance with zero hallucinated legal claims.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof window !== 'undefined') {
                  if (!window.crypto) { window.crypto = {}; }
                  if (!window.crypto.subtle) {
                    window.crypto.subtle = {
                      digest: function() { return Promise.resolve(new ArrayBuffer(32)); },
                      importKey: function() { return Promise.resolve({}); },
                      sign: function() { return Promise.resolve(new ArrayBuffer(32)); },
                      verify: function() { return Promise.resolve(true); }
                    };
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-charcoal flex flex-col font-sans selection:bg-[#EAF5EF] selection:text-[#1B5E3A]">
        {children}
      </body>
    </html>
  );
}
