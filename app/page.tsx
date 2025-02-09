"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  Zap,
  Lock,
  Coins,
  Wallet,
  BarChart3,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {/* <header className="fixed w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
        <div className="container flex h-14 items-center justify-between">
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-32 md:py-40 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Manage Digital Assets with
              <span className="text-primary"> Confidence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A powerful platform for creating, managing, and tracking your
              digital assets on the Solana blockchain.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 bg-white dark:bg-gray-800/50">
          <div className="container mx-auto">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Assets
                  </CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Treasury Balance
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24,563</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    24h Volume
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12.5%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">573</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Asset Sandbox?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Lightning Fast</CardTitle>
                  <CardDescription>
                    Create and deploy assets in seconds with our streamlined
                    interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Experience instant transactions and real-time updates on the
                  Solana blockchain.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Enterprise Security</CardTitle>
                  <CardDescription>
                    Bank-grade security for your digital assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Advanced encryption and multi-signature protection for your
                  assets and transactions.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Lock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Full Control</CardTitle>
                  <CardDescription>
                    Comprehensive asset management tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Manage permissions, track transactions, and monitor asset
                  performance in real-time.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Asset Sandbox</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Asset Sandbox. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
