'use server';
/**
 * @fileOverview Summarizes listing details using Groq AI.
 *
 * - summarizeListing - A function that handles the listing summarization process.
 * - SummarizeListingInput - The input type for the summarizeListing function.
 * - SummarizeListingOutput - The return type for the summarizeListing function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeListingInputSchema = z.object({
  title: z.string().describe('The title of the listing.'),
  description: z.string().describe('The description of the listing.'),
});
export type SummarizeListingInput = z.infer<typeof SummarizeListingInputSchema>;

const SummarizeListingOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the listing details.'),
});
export type SummarizeListingOutput = z.infer<typeof SummarizeListingOutputSchema>;

export async function summarizeListing(input: SummarizeListingInput): Promise<SummarizeListingOutput> {
  return summarizeListingFlow(input);
}

const summarizeListingPrompt = ai.definePrompt({
  name: 'summarizeListingPrompt',
  input: {
    schema: z.object({
      title: z.string().describe('The title of the listing.'),
      description: z.string().describe('The description of the listing.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the listing details.'),
    }),
  },
  prompt: `Summarize the key features and benefits of the following listing in a concise manner.\n\nTitle: {{{title}}}\nDescription: {{{description}}}`,
});

const summarizeListingFlow = ai.defineFlow<
  typeof SummarizeListingInputSchema,
  typeof SummarizeListingOutputSchema
>({
  name: 'summarizeListingFlow',
  inputSchema: SummarizeListingInputSchema,
  outputSchema: SummarizeListingOutputSchema,
}, async input => {
  const {output} = await summarizeListingPrompt(input);
  return output!;
});
