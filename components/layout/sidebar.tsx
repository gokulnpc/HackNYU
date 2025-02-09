"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Coins,
  Hammer,
  Wallet,
  BarChart3,
  Search,
  UserCircle,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Assets",
    icon: Coins,
    href: "/assets",
  },
  {
    label: "Forge",
    icon: Hammer,
    href: "/forge",
  },
  {
    label: "Treasury",
    icon: Wallet,
    href: "/treasury",
  },
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    label: "Explorer",
    icon: Search,
    href: "https://solscan.io/?cluster=devnet",
    external: true, // ✅ Mark as external link
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/profile",
  },
  {
    label: "Admin",
    icon: Settings,
    href: "/admin",
  },
];

// export function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <div className="w-64 bg-black text-white">
//       <div className="h-full px-3 py-4">
//         <Link href="/" className="flex items-center px-3 mb-14">
//           <Shield className="h-6 w-6" />
//           <h1 className="text-2xl font-bold">Asset Sandbox</h1>
//         </Link>
//         <div className="space-y-1">
//           {routes.map((route) => {
//             const isActive = pathname === route.href;
//             return route.external ? ( // ✅ Handle external links
//               <Button
//                 key={route.href}
//                 variant="ghost"
//                 className="w-full justify-start text-white/80 hover:bg-white/10"
//                 onClick={() => window.open(route.href, "_blank")}
//               >
//                 <route.icon className="h-5 w-5 mr-3" />
//                 {route.label}
//               </Button>
//             ) : (
//               <Button
//                 key={route.href}
//                 variant={isActive ? "secondary" : "ghost"}
//                 className={cn(
//                   "w-full justify-start hover:bg-white/10",
//                   isActive ? "bg-white/10 text-white" : "text-white/80"
//                 )}
//                 asChild
//               >
//                 <Link href={route.href}>
//                   <route.icon className="h-5 w-5 mr-3" />
//                   {route.label}
//                 </Link>
//               </Button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative bg-white dark:bg-gray-900 border-r border-border sidebar-transition",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-6 h-8 w-8 rounded-full border shadow-md bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="h-full px-3 py-4">
        <Link
          href="/"
          className={cn(
            "flex items-center px-3 mb-14 hover-lift",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Shield className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <h1 className="text-1xl font-bold text-primary ml-2 sidebar-content-transition">
              Asset Sandbox
            </h1>
          )}
        </Link>

        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return route.external ? (
              <Button
                key={route.href}
                variant="ghost"
                className={cn(
                  "w-full transition-all duration-200",
                  isCollapsed ? "justify-center px-2" : "justify-start"
                )}
                onClick={() => window.open(route.href, "_blank")}
              >
                <route.icon className="h-5 w-5" />
                {!isCollapsed && (
                  <span className="ml-3 sidebar-content-transition">
                    {route.label}
                  </span>
                )}
              </Button>
            ) : (
              <Button
                key={route.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full transition-all duration-200",
                  isCollapsed ? "justify-center px-2" : "justify-start",
                  isActive &&
                    "bg-secondary/10 text-secondary hover:bg-secondary/20"
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon
                    className={cn("h-5 w-5", isActive && "text-secondary")}
                  />
                  {!isCollapsed && (
                    <span className="ml-3 sidebar-content-transition">
                      {route.label}
                    </span>
                  )}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
