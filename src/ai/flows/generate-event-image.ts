
'use server';
/**
 * @fileOverview An AI flow for generating event cover images.
 *
 * - generateEventImage - Generates an image based on a text prompt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export async function generateEventImage(promptText: string): Promise<string> {
    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Generate a visually appealing and professional event cover image. The image should be dynamic, high-quality, and suitable for a tech conference. Focus on the theme: ${promptText}. Avoid text overlays.`,
    });
    return media.url!;
}

const GenerateEventImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});

const GenerateEventImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});

ai.defineFlow(
  {
    name: 'generateEventImageFlow',
    inputSchema: GenerateEventImageInputSchema,
    outputSchema: GenerateEventImageOutputSchema,
  },
  async ({ prompt }) => {
    const imageUrl = await generateEventImage(prompt);
    return { imageUrl };
  }
);
