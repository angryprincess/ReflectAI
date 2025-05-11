// src/ai/flows/analyze-mood-trends.ts
'use server';
/**
 * @fileOverview Analyzes the mood trends in a user's journal entries over time.
 *
 * - analyzeMoodTrends - A function that analyzes mood trends.
 * - AnalyzeMoodTrendsInput - The input type for the analyzeMoodTrends function.
 * - AnalyzeMoodTrendsOutput - The return type for the analyzeMoodTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMoodTrendsInputSchema = z.object({
  journalEntries: z.array(
    z.object({
      text: z.string().describe('The text content of the journal entry.'),
      date: z.string().describe('The date of the journal entry in ISO format (YYYY-MM-DD).'),
    })
  ).describe('An array of journal entries with their text and dates.'),
});
export type AnalyzeMoodTrendsInput = z.infer<typeof AnalyzeMoodTrendsInputSchema>;

const MoodClusterSchema = z.enum(['positive', 'neutral', 'negative']);

const AnalyzeMoodTrendsOutputSchema = z.object({
  moodClusters: z.array(
    z.object({
      date: z.string().describe('The date of the journal entry in ISO format (YYYY-MM-DD).'),
      mood: MoodClusterSchema.describe('The mood cluster for the journal entry: positive, neutral, or negative.'),
      score: z.number().min(-1).max(1).describe('Sentiment score of the journal entry, between -1 (very negative) and 1 (very positive).'),
    })
  ).describe('An array of mood clusters with dates, moods, and sentiment scores for each journal entry.'),
  overallSentiment: z.string().describe('A single word or short phrase describing the overall sentiment of all journal entries (e.g., Positive, Mixed, Mostly Negative).'),
  trendSummary: z.string().describe('A brief textual summary (1-2 sentences) of the mood trend over time, highlighting any notable changes, patterns, or consistency. For example, "Moods have been consistently positive," or "There seems to be an upward trend in mood towards the end of the period."')
});
export type AnalyzeMoodTrendsOutput = z.infer<typeof AnalyzeMoodTrendsOutputSchema>;

export async function analyzeMoodTrends(input: AnalyzeMoodTrendsInput): Promise<AnalyzeMoodTrendsOutput> {
  return analyzeMoodTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMoodTrendsPrompt',
  input: {schema: AnalyzeMoodTrendsInputSchema},
  output: {schema: AnalyzeMoodTrendsOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing mood trends from a user's journal entries.
Analyze the provided journal entries to determine the mood cluster (positive, neutral, or negative) and sentiment score (from -1.0 for very negative to 1.0 for very positive) for each entry.
Also, determine the overall sentiment of all journal entries (e.g., Positive, Mixed, Predominantly Negative).
Finally, provide a brief textual summary (1-2 sentences) of the mood trend over time, highlighting any notable changes, patterns, or consistency. For example, "Moods have been consistently positive," or "There seems to be an upward trend in mood towards the end of the period."

Journal Entries:
{{#each journalEntries}}
Date: {{this.date}}
Text: {{this.text}}
---
{{/each}}

Output the mood clusters (with dates, moods, and sentiment scores), the overall sentiment, and the trend summary.
Output format: JSON`,
});

const analyzeMoodTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeMoodTrendsFlow',
    inputSchema: AnalyzeMoodTrendsInputSchema,
    outputSchema: AnalyzeMoodTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

