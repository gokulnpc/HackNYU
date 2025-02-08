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
} from "lucide-react";

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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-black text-white">
      <div className="h-full px-3 py-4">
        <Link href="/" className="flex items-center px-3 mb-14">
          <h1 className="text-2xl font-bold">Asset Sandbox</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return route.external ? ( // ✅ Handle external links
              <Button
                key={route.href}
                variant="ghost"
                className="w-full justify-start text-white/80 hover:bg-white/10"
                onClick={() => window.open(route.href, "_blank")}
              >
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </Button>
            ) : (
              <Button
                key={route.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start hover:bg-white/10",
                  isActive ? "bg-white/10 text-white" : "text-white/80"
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="h-5 w-5 mr-3" />
                  {route.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
