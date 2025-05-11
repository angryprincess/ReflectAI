'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, PlusCircle, BookOpenText } from 'lucide-react';
import Link from 'next/link';
import JournalEntryCard from '@/components/journal/JournalEntryCard';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { suggestPersonalizedPrompts, SuggestPersonalizedPromptsOutput } from '@/ai/flows/suggest-personalized-prompts';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { journalEntries, isLoadingAi, setIsLoadingAi } = useAppStore();
  const [prompts, setPrompts] = useState<string[]>([]);
  const [promptsError, setPromptsError] = useState<string | null>(null);

  const recentEntries = [...journalEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  useEffect(() => {
    const fetchPrompts = async () => {
      if (journalEntries.length > 0) {
        setIsLoadingAi(true);
        setPromptsError(null);
        try {
          const entryContents = journalEntries.slice(0, 5).map(entry => entry.content); // Use recent 5 entries for prompts
          const result: SuggestPersonalizedPromptsOutput = await suggestPersonalizedPrompts({ journalEntries: entryContents });
          setPrompts(result.prompts);
        } catch (error) {
          console.error("Failed to fetch prompts:", error);
          setPromptsError("Could not load personalized prompts at this time.");
        } finally {
          setIsLoadingAi(false);
        }
      } else {
        setPrompts([]); // Clear prompts if no entries
      }
    };
    fetchPrompts();
  }, [journalEntries, setIsLoadingAi]);


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to ReflectAI</CardTitle>
          <CardDescription>Your personal space for AI-powered reactive journaling. Start a new entry or explore your insights.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/journal/new">
              <PlusCircle className="mr-2 h-5 w-5" /> New Journal Entry
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/insights">
              <Lightbulb className="mr-2 h-5 w-5" /> View AI Insights
            </Link>
          </Button>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Personalized Prompts</h2>
        {isLoadingAi && prompts.length === 0 && ( // Show skeleton only when loading and no prompts yet
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        )}
        {!isLoadingAi && promptsError && <p className="text-destructive">{promptsError}</p>}
        {!isLoadingAi && !promptsError && prompts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.map((prompt, index) => (
              <Card key={index} className="bg-accent/30 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <p className="text-sm text-accent-foreground">{prompt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!isLoadingAi && !promptsError && prompts.length === 0 && journalEntries.length > 0 && (
           <p className="text-muted-foreground">No new prompts available based on recent entries. Keep journaling for more suggestions!</p>
        )}
         {!isLoadingAi && !promptsError && prompts.length === 0 && journalEntries.length === 0 && (
           <p className="text-muted-foreground">Write some journal entries to get personalized prompts!</p>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Entries</h2>
          {journalEntries.length > 0 && (
            <Button variant="ghost" asChild>
              <Link href="/journal">View All <BookOpenText className="ml-2 h-4 w-4" /></Link>
            </Button>
          )}
        </div>
        {recentEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEntries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven't written any entries yet. <Link href="/journal/new" className="text-primary hover:underline">Create one now!</Link></p>
        )}
      </section>
    </div>
  );
}
