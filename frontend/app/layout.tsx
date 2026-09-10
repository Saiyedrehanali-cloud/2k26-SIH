import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vigyan Veda — AI-Powered Ayush IP & Innovation Assistant",
  description:
    "Vigyan Veda: AI-driven regulatory compliance and patentability intelligence platform for Ayurveda researchers, startups, and practitioners navigating Indian Patents Act (§ 3p/3e), TKDL prior art, and Biological Diversity Act mandates.",
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
                  if (!window.crypto) {
                    try { window.crypto = {}; } catch (e) {
                      Object.defineProperty(window, 'crypto', { value: {}, writable: true, configurable: true });
                    }
                  }
                  if (!window.crypto.subtle) {
                    var polyfillSubtle = {
                      digest: function() { return Promise.resolve(new ArrayBuffer(32)); },
                      importKey: function() { return Promise.resolve({}); },
                      sign: function() { return Promise.resolve(new ArrayBuffer(32)); },
                      verify: function() { return Promise.resolve(true); }
                    };
                    try {
                      window.crypto.subtle = polyfillSubtle;
                    } catch (e) {
                      Object.defineProperty(window.crypto, 'subtle', {
                        value: polyfillSubtle,
                        configurable: true,
                        writable: true
                      });
                    }
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
