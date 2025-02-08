"use client";

import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { ThemeToggle } from './theme-toggle';
import { Wallet } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}