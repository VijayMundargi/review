'use server';

/**
 * @fileOverview AI flow to analyze restaurant reviews and suggest improvements to the restaurant's description.
 *
 * - analyzeReviewsAndSuggestDescription - Analyzes reviews and suggests a new description.
 * - AnalyzeReviewsAndSuggestDescriptionInput - The input type for analyzeReviewsAndSuggestDescription.
 * - AnalyzeReviewsAndSuggestDescriptionOutput - The output type for analyzeReviewsAndSuggestDescription.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeReviewsAndSuggestDescriptionInputSchema = z.object({
  restaurantName: z.string().describe('The name of the restaurant.'),
  currentDescription: z.string().describe('The current description of the restaurant.'),
  reviews: z.array(z.string()).describe('An array of customer reviews for the restaurant.'),
});
export type AnalyzeReviewsAndSuggestDescriptionInput = z.infer<typeof AnalyzeReviewsAndSuggestDescriptionInputSchema>;

const AnalyzeReviewsAndSuggestDescriptionOutputSchema = z.object({
  suggestedDescription: z.string().describe('The AI-suggested new description for the restaurant.'),
  reasoning: z.string().describe('The AI\u2019s reasoning for the suggested description.'),
});
export type AnalyzeReviewsAndSuggestDescriptionOutput = z.infer<typeof AnalyzeReviewsAndSuggestDescriptionOutputSchema>;

export async function analyzeReviewsAndSuggestDescription(
  input: AnalyzeReviewsAndSuggestDescriptionInput
): Promise<AnalyzeReviewsAndSuggestDescriptionOutput> {
  return analyzeReviewsAndSuggestDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeReviewsAndSuggestDescriptionPrompt',
  input: {schema: AnalyzeReviewsAndSuggestDescriptionInputSchema},
  output: {schema: AnalyzeReviewsAndSuggestDescriptionOutputSchema},
  prompt: `You are an expert restaurant marketing consultant.

You are helping \"{{restaurantName}}\" improve its restaurant description to attract more customers.

Here is the current description of the restaurant:
\"{{currentDescription}}\"

Here are some recent customer reviews:
{{#each reviews}}
- \"{{this}}\"
{{/each}}

Based on these reviews, please suggest a new description for the restaurant that accurately reflects the customer experience and highlights the restaurant's strengths. Also explain the reasoning for the new description.

Make sure the output is suitable for use directly on a restaurant website.
`,
});

const analyzeReviewsAndSuggestDescriptionFlow = ai.defineFlow(
  {
    name: 'analyzeReviewsAndSuggestDescriptionFlow',
    inputSchema: AnalyzeReviewsAndSuggestDescriptionInputSchema,
    outputSchema: AnalyzeReviewsAndSuggestDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
