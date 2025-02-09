// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ArrowRight,
//   Shield,
//   Zap,
//   Lock,
//   Coins,
//   Wallet,
//   BarChart3,
// } from "lucide-react";

// export default function LandingPage() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Main Content */}
//       <main className="flex-1">
//         {/* Hero Section */}
//         <section className="px-4 py-32 md:py-40 bg-gradient-to-b ">
//           <div className="container mx-auto text-center">
//             <h1 className="text-4xl text-black md:text-6xl font-bold tracking-tighter mb-6">
//               Manage Digital Assets with
//               <span className="text-primary"> Confidence</span>
//             </h1>
//             <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
//               A powerful platform for creating, managing, and tracking your
//               digital assets on the Solana blockchain.
//             </p>
//             <div className="flex justify-center gap-4">
//               <Button size="lg" asChild>
//                 <Link href="/signup">
//                   Get Started
//                   <ArrowRight className="ml-2 h-4 w-4" />
//                 </Link>
//               </Button>
//               <Button size="lg" variant="outline" asChild>
//                 <Link href="/dashboard">View Demo</Link>
//               </Button>
//             </div>
//           </div>
//         </section>

//         {/* Stats Section */}
//         <section className="py-12 px-4 ">
//           <div className="container mx-auto">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               <Card className="bg-gradient-green-soft">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium text-green-800">
//                     Total Assets
//                   </CardTitle>
//                   <Coins className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-green-900 ">12</div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Treasury Balance
//                   </CardTitle>
//                   <Wallet className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">$24,563</div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     24h Volume
//                   </CardTitle>
//                   <BarChart3 className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">+12.5%</div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Active Users
//                   </CardTitle>
//                   <Shield className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">573</div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>

//         {/* Features Section */}
//         <section className="py-20 px-4">
//           <div className="container mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12">
//               Why Choose SOLfolio?
//             </h2>
//             <div className="grid md:grid-cols-3 gap-8">
//               <Card>
//                 <CardHeader>
//                   <Zap className="h-10 w-10 text-primary mb-2" />
//                   <CardTitle>Lightning Fast</CardTitle>
//                   <CardDescription>
//                     Create and deploy assets in seconds with our streamlined
//                     interface
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   Experience instant transactions and real-time updates on the
//                   Solana blockchain.
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <Shield className="h-10 w-10 text-primary mb-2" />
//                   <CardTitle>Enterprise Security</CardTitle>
//                   <CardDescription>
//                     Bank-grade security for your digital assets
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   Advanced encryption and multi-signature protection for your
//                   assets and transactions.
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <Lock className="h-10 w-10 text-primary mb-2" />
//                   <CardTitle>Full Control</CardTitle>
//                   <CardDescription>
//                     Comprehensive asset management tools
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   Manage permissions, track transactions, and monitor asset
//                   performance in real-time.
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="border-t py-8">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-2">
//               <Shield className="h-5 w-5" />
//               <span className="font-semibold">SOLfolio</span>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               © 2024 SOLfolio. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

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
    <div className="flex flex-col min-h-screen text-gray-900 relative overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-40 md:py-48 text-center relative">
          <div className="container mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-green-700">
              Manage Digital Assets <br /> with{" "}
              <span className="text-green-500">Confidence</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto mt-6">
              A next-gen platform for seamless asset creation, management, and
              tracking on the Solana blockchain.
            </p>
            <div className="flex justify-center gap-6 mt-10">
              <Button
                size="lg"
                className="bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg"
                asChild
              >
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-500 text-green-600 hover:border-green-600 hover:text-green-700 transition-all"
                asChild
              >
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Total Assets",
                  value: "12",
                  icon: <Coins className="h-6 w-6 text-green-600" />,
                },
                {
                  title: "Treasury Balance",
                  value: "$24,563",
                  icon: <Wallet className="h-6 w-6 text-green-600" />,
                },
                {
                  title: "24h Volume",
                  value: "+12.5%",
                  icon: <BarChart3 className="h-6 w-6 text-green-600" />,
                },
                {
                  title: "Active Users",
                  value: "573",
                  icon: <Shield className="h-6 w-6 text-green-600" />,
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold text-green-700">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-800">
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto">
            <h2 className="text-4xl font-extrabold text-center text-green-700 mb-16">
              Why Choose SOLfolio?
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "Lightning Fast",
                  description:
                    "Create and deploy assets in seconds with our streamlined interface.",
                  icon: <Zap className="h-12 w-12 text-green-500" />,
                },
                {
                  title: "Enterprise Security",
                  description:
                    "Bank-grade security and multi-layer encryption for your assets.",
                  icon: <Shield className="h-12 w-12 text-green-500" />,
                },
                {
                  title: "Full Control",
                  description:
                    "Manage permissions, track transactions, and monitor assets in real-time.",
                  icon: <Lock className="h-12 w-12 text-green-500" />,
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="text-center">
                    {feature.icon}
                    <CardTitle className="mt-4 text-xl font-bold text-green-700">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-gray-600 text-center">
                    Explore cutting-edge blockchain innovations tailored for
                    your needs.
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-gray-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-700" />
            <span className="font-semibold text-green-700 text-lg">
              SOLfolio
            </span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 SOLfolio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
