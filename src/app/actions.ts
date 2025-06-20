'use server';

import { generateMotivationalMessage } from '@/ai/flows/generate-motivational-message.ts';
import type { MotivationalMessageInput, MotivationalMessageOutput } from '@/ai/flows/generate-motivational-message.ts';

export async function getMotivationalMessageAction(input: MotivationalMessageInput): Promise<MotivationalMessageOutput> {
  try {
    const result = await generateMotivationalMessage(input);
    return result;
  } catch (error) {
    console.error("Error generating motivational message:", error);
    // Fallback message or rethrow, depending on how you want to handle errors client-side
    return { message: "Keep pushing, you're doing great! Every step counts towards your goal." };
  }
}
