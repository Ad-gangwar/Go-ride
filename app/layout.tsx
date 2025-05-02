import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import Navbar from "@/components/nav-bar";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoRide - Taxi & Rideshare Platform",
  description:
    "A reliable and convenient rideshare app offering seamless taxi booking and ride-sharing services for fast and safe travel anywhere, anytime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <html lang="en" className="light">
          <body className={`${outfit.className} dark:bg-gray-900 dark:text-white transition-colors`}>
            <Toaster position="top-center" />
            <Navbar />
            {children}
          </body>
        </html>
      </ThemeProvider>
    </AuthProvider>
  );
}
