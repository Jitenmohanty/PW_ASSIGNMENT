import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ZenIdea | AI-Powered Personal Knowledge Base",
  description: "Minimalist idea capture enhanced by artificial intelligence.",
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-foreground selection:bg-primary/30`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
