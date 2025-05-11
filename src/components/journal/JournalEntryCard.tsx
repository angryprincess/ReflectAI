import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { JournalEntry } from '@/lib/types';
import { CalendarDays, Tag, FolderArchive } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export default function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const excerpt = entry.content.length > 150 ? entry.content.substring(0, 150) + '...' : entry.content;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl">{entry.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {format(parseISO(entry.date), 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:items-center pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderArchive className="h-4 w-4" /> {entry.category}
        </div>
        <div className="flex flex-wrap gap-1">
          {entry.tags.slice(0,3).map((tag) => ( // Show max 3 tags
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" /> {tag}
            </Badge>
          ))}
          {entry.tags.length > 3 && <Badge variant="outline">+{entry.tags.length - 3} more</Badge>}
        </div>
        {/* For now, no link to individual entry page, but can be added here */}
        {/* <Link href={`/journal/${entry.id}`} className="text-primary hover:underline text-sm">Read More</Link> */}
      </CardFooter>
    </Card>
  );
}
