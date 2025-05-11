// This is an AI-powered function that suggests personalized prompts based on past journal entries.
// It analyzes the user's journaling history and provides tailored prompts focusing on topics like stress or self-care.
// - suggestPersonalizedPrompts - A function that suggests personalized prompts for journaling.
// - SuggestPersonalizedPromptsInput - The input type for the suggestPersonalizedPrompts function.
// - SuggestPersonalizedPromptsOutput - The return type for the suggestPersonalizedPrompts function.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPersonalizedPromptsInputSchema = z.object({
  journalEntries: z.array(z.string()).describe('A list of the user\u2019s past journal entries.'),
});
export type SuggestPersonalizedPromptsInput = z.infer<typeof SuggestPersonalizedPromptsInputSchema>;

const SuggestPersonalizedPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('A list of personalized journaling prompts.'),
});
export type SuggestPersonalizedPromptsOutput = z.infer<typeof SuggestPersonalizedPromptsOutputSchema>;

export async function suggestPersonalizedPrompts(input: SuggestPersonalizedPromptsInput): Promise<SuggestPersonalizedPromptsOutput> {
  return suggestPersonalizedPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPersonalizedPromptsPrompt',
  input: {schema: SuggestPersonalizedPromptsInputSchema},
  output: {schema: SuggestPersonalizedPromptsOutputSchema},
  prompt: `You are an AI journaling assistant. Given a user's past journal entries, suggest personalized prompts that encourage further reflection.

  The prompts should focus on recurring themes, emotions, or topics identified in the entries.
  Prioritize prompts related to stress, self-care, personal growth, and goal setting, where applicable.
  The prompts should be open-ended and encourage deep introspection.

  Here are the user's past journal entries:
  {{#each journalEntries}}
  - {{{this}}}
  {{/each}}

  Based on these entries, suggest 3 personalized journaling prompts:
  `, // Ensure output adheres to the specified schema
});

const suggestPersonalizedPromptsFlow = ai.defineFlow(
  {
    name: 'suggestPersonalizedPromptsFlow',
    inputSchema: SuggestPersonalizedPromptsInputSchema,
    outputSchema: SuggestPersonalizedPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
