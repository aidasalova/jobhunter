import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "One More CV",
  description: "Your job hunting assistant and coach",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        
        {/* Your new responsive Navigation goes here */}
        <Sidebar />

        {/* The Main Content Wrapper */}
        <main className="
          /* --- MOBILE: Space for the bottom bar --- */
          pb-20 pt-4 px-4 
          /* --- DESKTOP: Space for the left sidebar --- */
          lg:pb-8 lg:pt-8 lg:px-8 lg:pl-72"
        >
          {children}
        </main>

      </body>
    </html>
  );
}