import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eduhub",
  description: "EDUHUB School Management System",
};

export default function Dashboard_Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>dashboard{children}</div>
}
