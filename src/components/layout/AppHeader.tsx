'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden md:block">
          <Logo size="md" />
        </div>
      </div>
      <div className="md:hidden"> {/* Logo for mobile centered when sidebar trigger is on left */}
        <Logo size="sm" />
      </div>
      <Button asChild>
        <Link href="/journal/new">
          <PlusCircle className="mr-2 h-4 w-4" /> New Entry
        </Link>
      </Button>
    </header>
  );
}
