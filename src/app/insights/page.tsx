'use client';

import AiInsightsDisplay from '@/components/insights/AiInsightsDisplay';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import type { JournalEntry as AppJournalEntry } from '@/lib/types';
import { provideAiInsights, AiInsightsInput, AiInsightsOutput } from '@/ai/flows/provide-ai-insights';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';


export default function InsightsPage() {
  const { 
    journalEntries, 
    aiInsights, 
    setAiInsights, 
    isLoadingAi,
    setIsLoadingAi 
  } = useAppStore();
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    if (journalEntries.length === 0) {
      toast({ title: 'Not enough data', description: 'Please write some journal entries first to generate insights.', variant: 'destructive' });
      return;
    }
    setIsLoadingAi(true);
    setAiInsights(null); 

    try {
      const insightInput: AiInsightsInput = {
        journalEntries: journalEntries.map(entry => ({ date: entry.date, text: entry.content })),
      };
      const insightsResult: AiInsightsOutput = await provideAiInsights(insightInput);
      setAiInsights(insightsResult);
      toast({ title: 'Insights Generated', description: 'Your AI insights have been updated.' });
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setAiInsights(null); 
      toast({ title: 'Error', description: 'Could not generate AI insights at this time. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoadingAi(false);
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className='space-y-1'>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Lightbulb className="mr-3 h-8 w-8 text-primary" />
            AI-Powered Insights
            </h1>
            <p className="text-muted-foreground">
            Uncover patterns, themes, and reflections from your journal entries.
            </p>
        </div>
        <Button onClick={handleGenerateInsights} disabled={isLoadingAi || journalEntries.length === 0}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingAi ? 'animate-spin' : ''}`} />
          {isLoadingAi ? 'Generating...' : 'Generate Insights'}
        </Button>
      </div>
      
      <AiInsightsDisplay 
        insights={aiInsights} 
        isLoading={isLoadingAi} 
        error={
            !aiInsights && !isLoadingAi && journalEntries.length > 0 ? "Click 'Generate Insights' to see your analysis." :
            !aiInsights && !isLoadingAi && journalEntries.length === 0 ? "Write some entries to generate insights." : null
        }
      />

      {journalEntries.length === 0 && !isLoadingAi && (
        <p className="text-center text-muted-foreground py-8">
          You need to write some journal entries before AI can provide insights.
          <Button variant="link" asChild className="p-0 ml-1 h-auto">
            <Link href="/journal/new">Create an entry now.</Link>
          </Button>
        </p>
      )}
    </div>
  );
}
