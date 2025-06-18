
"use server";

import { z } from 'zod';
import { analyzeReviewsAndSuggestDescription } from '@/ai/flows/restaurant-description-assistant';
import type { Review, Restaurant } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const ReviewSchema = z.object({
  restaurantId: z.string(),
  restaurantName: z.string(), // Needed for AI
  currentDescription: z.string(), // Needed for AI
  userId: z.string(),
  username: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  text: z.string().min(10, "Review text must be at least 10 characters"),
  rating: z.coerce.number().min(1).max(5),
  existingReviewsJSON: z.string(), // JSON string of existing reviews for the restaurant
});

export async function submitReviewAction(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const validationResult = ReviewSchema.safeParse(rawFormData);

  if (!validationResult.success) {
    return { success: false, errors: validationResult.error.flatten().fieldErrors };
  }

  const { 
    restaurantId, 
    restaurantName,
    currentDescription,
    userId, 
    username, 
    title, 
    text, 
    rating,
    existingReviewsJSON 
  } = validationResult.data;

  const newReview: Review = {
    id: uuidv4(),
    restaurantId,
    userId,
    username,
    title,
    text,
    rating,
    date: new Date().toISOString(),
  };

  try {
    const existingReviews: Review[] = JSON.parse(existingReviewsJSON);
    const allReviewsTexts = [...existingReviews.map(r => r.text), newReview.text];

    const aiInput = {
      restaurantName: restaurantName,
      currentDescription: currentDescription,
      reviews: allReviewsTexts,
    };
    
    const aiSuggestion = await analyzeReviewsAndSuggestDescription(aiInput);

    return { 
      success: true, 
      newReview, 
      aiSuggestion: {
        suggestedDescription: aiSuggestion.suggestedDescription,
        reasoning: aiSuggestion.reasoning,
      }
    };

  } catch (error) {
    console.error("Error in submitReviewAction (AI or parsing):", error);
    // Still return the review if AI fails, but without AI suggestion
    return { 
      success: true, 
      newReview, 
      aiSuggestion: null, 
      error: "Review submitted, but AI analysis failed." 
    };
  }
}
