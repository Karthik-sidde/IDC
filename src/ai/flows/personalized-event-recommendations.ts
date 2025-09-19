'use server';

/**
 * @fileOverview A personalized event recommendation AI agent.
 *
 * - getPersonalizedEventRecommendations - A function that returns personalized event recommendations.
 * - PersonalizedEventRecommendationsInput - The input type for the getPersonalizedEventRecommendations function.
 * - PersonalizedEventRecommendationsOutput - The return type for the getPersonalizedEventRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEventRecommendationsInputSchema = z.object({
  userPastEvents: z
    .string()
    .describe(
      'A list of the users past event Ids, as a stringified JSON array.'
    ),
  userPreferences: z.string().describe('The preferences of the user.'),
  allEvents: z.string().describe('All of the events on the platform, as a stringified JSON array.'),
});
export type PersonalizedEventRecommendationsInput = z.infer<typeof PersonalizedEventRecommendationsInputSchema>;

const PersonalizedEventRecommendationsOutputSchema = z.object({
  recommendedEvents: z.string().describe('A list of recommended event IDs, as a stringified JSON array.'),
});
export type PersonalizedEventRecommendationsOutput = z.infer<typeof PersonalizedEventRecommendationsOutputSchema>;

export async function getPersonalizedEventRecommendations(input: PersonalizedEventRecommendationsInput): Promise<PersonalizedEventRecommendationsOutput> {
  return personalizedEventRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEventRecommendationsPrompt',
  input: {schema: PersonalizedEventRecommendationsInputSchema},
  output: {schema: PersonalizedEventRecommendationsOutputSchema},
  prompt: `You are an AI agent that recommends events to users.

You will receive a list of events that the user has attended in the past, the user's preferences, and a list of all available events on the platform.

Based on this information, return a list of event IDs that you would recommend to the user. The response must be a stringified JSON array.

User Past Events: {{{userPastEvents}}}
User Preferences: {{{userPreferences}}}
All Events: {{{allEvents}}}`,
});

const personalizedEventRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedEventRecommendationsFlow',
    inputSchema: PersonalizedEventRecommendationsInputSchema,
    outputSchema: PersonalizedEventRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
