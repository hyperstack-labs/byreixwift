import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";

export const metadata: Metadata = {
  title: "ByReiXwift App",
  description:
    "Access the ByReiXwift product experience for wallet, send, swap, trends, escrow, and profile workflows.",
};

export default function ProductAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
