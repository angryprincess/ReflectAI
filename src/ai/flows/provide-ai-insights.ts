'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI insights on journal entries.
 *
 * - provideAiInsights - A function that processes journal entries and returns insights.
 * - AiInsightsInput - The input type for the provideAiInsights function.
 * - AiInsightsOutput - The return type for the provideAiInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiInsightsInputSchema = z.object({
  journalEntries: z.array(
    z.object({
      date: z.string().describe('The date of the journal entry.'),
      text: z.string().describe('The content of the journal entry.'),
    })
  ).describe('An array of journal entries to analyze.'),
});
export type AiInsightsInput = z.infer<typeof AiInsightsInputSchema>;

const AiInsightsOutputSchema = z.object({
  reflectionScore: z.number().describe('A score reflecting the depth and introspection of the journal entries.'),
  recurringThemes: z.array(z.string()).describe('A list of recurring themes identified in the journal entries.'),
  sentimentAnalysis: z.string().describe('Sentiment analysis of journal entries.'),
});
export type AiInsightsOutput = z.infer<typeof AiInsightsOutputSchema>;

export async function provideAiInsights(input: AiInsightsInput): Promise<AiInsightsOutput> {
  return provideAiInsightsFlow(input);
}

const provideAiInsightsPrompt = ai.definePrompt({
  name: 'provideAiInsightsPrompt',
  input: {schema: AiInsightsInputSchema},
  output: {schema: AiInsightsOutputSchema},
  prompt: `You are an AI journaling assistant that provides insights into a user's journal entries.

  Analyze the following journal entries to provide a reflection score (out of 100) based on the depth and introspection of the entries, identify recurring themes, and conduct sentiment analysis.

  Journal Entries:
  {{#each journalEntries}}
  Date: {{this.date}}
  Entry: {{this.text}}
  {{/each}}

  Provide the reflection score, recurring themes, and sentiment analysis in the output format.
  `,
});

const provideAiInsightsFlow = ai.defineFlow(
  {
    name: 'provideAiInsightsFlow',
    inputSchema: AiInsightsInputSchema,
    outputSchema: AiInsightsOutputSchema,
  },
  async input => {
    const {output} = await provideAiInsightsPrompt(input);
    return output!;
  }
);
