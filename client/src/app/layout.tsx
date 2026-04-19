import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ByReiXwift",
  description:
    "Online payments on Sidrachain, built around transparent fees, transfers, escrow-backed protection, and Shariah-guided product principles.",
  icons: {
    icon: [{ url: "/logo_transparent.png", type: "image/png" }],
    shortcut: ["/logo_transparent.png"],
    apple: ["/logo_transparent.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.variable} antialiased`}>
        <Web3Provider>{children}</Web3Provider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            },
          }}
        />
      </body>
    </html>
  );
}
