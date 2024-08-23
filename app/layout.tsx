import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./index.css";
import { UserContextProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cancelled!",
  description: "Play with your friends and get cancelled",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserContextProvider>
        <body className={`${inter.className} bg-black text-white select-none`}>{children}</body>
      </UserContextProvider>
    </html>
  );
}
