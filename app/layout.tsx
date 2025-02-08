import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { WalletContextProvider } from "../components/providers/wallet-provider"; // Import Wallet Context

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Asset Sandbox",
  description: "Asset issuance and management platform on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Wrap the entire app with Wallet Provider */}
        <WalletContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto bg-background">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
