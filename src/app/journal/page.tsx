import JournalEntryList from '@/components/journal/JournalEntryList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'My Journal - ReflectAI',
};

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My Journal</h1>
        <Button asChild>
          <Link href="/journal/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Link>
        </Button>
      </div>
      <JournalEntryList />
    </div>
  );
}
