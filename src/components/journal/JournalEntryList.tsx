'use client';

import type { JournalEntry } from '@/lib/types';
import JournalEntryCard from './JournalEntryCard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, SearchX } from 'lucide-react';

export default function JournalEntryList() {
  const { journalEntries } = useAppStore();

  if (journalEntries.length === 0) {
    return (
      <div className="text-center py-10">
        <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">No journal entries yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Start by creating your first entry.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/journal/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Entry
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Sort entries by date, newest first
  const sortedEntries = [...journalEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedEntries.map((entry) => (
        <JournalEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
