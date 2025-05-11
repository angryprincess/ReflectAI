'use client';

import MoodChart from '@/components/insights/MoodChart';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import type { JournalEntry as AppJournalEntry } from '@/lib/types';
import { analyzeMoodTrends, AnalyzeMoodTrendsInput, AnalyzeMoodTrendsOutput } from '@/ai/flows/analyze-mood-trends';
import { Smile, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useState, useEffect } from 'react'; 

export default function MoodTrackingPage() {
  const { 
    journalEntries, 
    moodTrends, 
    setMoodTrends,
  } = useAppStore();
  const { toast } = useToast();
  const [overallSentiment, setOverallSentiment] = useState<string | undefined>(undefined);
  const [isMoodAnalysisLoading, setIsMoodAnalysisLoading] = useState(false); 


  const handleAnalyzeMood = async () => {
    if (journalEntries.length === 0) {
      toast({ title: 'Not enough data', description: 'Please write some journal entries first to analyze mood.', variant: 'destructive' });
      return;
    }
    setIsMoodAnalysisLoading(true);
    setMoodTrends([]); 
    setOverallSentiment(undefined);

    try {
      const moodInput: AnalyzeMoodTrendsInput = {
        journalEntries: journalEntries.map(entry => ({ date: entry.date, text: entry.content })),
      };
      const moodResult: AnalyzeMoodTrendsOutput = await analyzeMoodTrends(moodInput);
      setMoodTrends(moodResult.moodClusters);
      setOverallSentiment(moodResult.overallSentiment);
      toast({ title: 'Mood Analysis Complete', description: 'Your mood trends have been updated.' });
    } catch (error) {
      console.error('Error analyzing mood trends:', error);
      setMoodTrends([]); 
      setOverallSentiment(undefined);
      toast({ title: 'Error', description: 'Could not analyze mood trends at this time. Please try again.', variant: 'destructive' });
    } finally {
      setIsMoodAnalysisLoading(false);
    }
  };

  // Automatically analyze mood if entries exist and trends are not yet loaded
  useEffect(() => {
    if (journalEntries.length > 0 && moodTrends.length === 0 && !isMoodAnalysisLoading) {
      // Check if localStorage has trends to prevent re-fetching on every mount, if desired.
      // For now, this simple logic will re-fetch if moodTrends is empty in store.
      // To persist, moodTrends and overallSentiment would need to be in AppStore and localStorage.
      // handleAnalyzeMood(); // Or make it user-initiated only
    }
  }, [journalEntries, moodTrends, isMoodAnalysisLoading]);


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className='space-y-1'>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Smile className="mr-3 h-8 w-8 text-primary" />
            Mood Tracking
            </h1>
            <p className="text-muted-foreground">
            Visualize your emotional journey and understand your mood patterns over time.
            </p>
        </div>
        <Button onClick={handleAnalyzeMood} disabled={isMoodAnalysisLoading || journalEntries.length === 0}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isMoodAnalysisLoading ? 'animate-spin' : ''}`} />
          {isMoodAnalysisLoading ? 'Analyzing...' : 'Analyze Moods'}
        </Button>
      </div>
      
      <MoodChart 
        moodTrends={moodTrends} 
        overallSentiment={overallSentiment} 
        isLoading={isMoodAnalysisLoading}
        error={
            moodTrends.length === 0 && !isMoodAnalysisLoading && journalEntries.length > 0 ? "Click 'Analyze Moods' to see your trends." :
            moodTrends.length === 0 && !isMoodAnalysisLoading && journalEntries.length === 0 ? "Write some entries to analyze moods." : null
        }
      />

      {journalEntries.length === 0 && !isMoodAnalysisLoading && (
        <p className="text-center text-muted-foreground py-8">
          You need to write some journal entries before your mood can be analyzed.
           <Button variant="link" asChild className="p-0 ml-1 h-auto">
            <Link href="/journal/new">Create an entry now.</Link>
          </Button>
        </p>
      )}
    </div>
  );
}
