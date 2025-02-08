"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <WalletMultiButton />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
