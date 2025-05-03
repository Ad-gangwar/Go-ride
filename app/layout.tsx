import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { DirectionsDataProvider } from "@/context/directions-data-context";
import { SelectedCarAmountProvider } from "@/context/selected-car-amount-context";
import { GoogleMapsProvider } from "@/context/google-maps-context";
import Navbar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./error-boundary";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${outfit.className} bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300`}>
        <ErrorBoundary>
          <GoogleMapsProvider>
            <AuthProvider>
              <ThemeProvider>
                <DirectionsDataProvider>
                  <SelectedCarAmountProvider>
                    <Toaster position="top-center" />
                    <Navbar />
                    <main className="min-h-[calc(100vh-4rem)]">
                      {children}
                    </main>
                    <Footer />
                  </SelectedCarAmountProvider>
                </DirectionsDataProvider>
              </ThemeProvider>
            </AuthProvider>
          </GoogleMapsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
