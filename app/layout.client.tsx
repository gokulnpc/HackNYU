"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { WalletContextProvider } from "../components/providers/wallet-provider";

export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
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
    );
}