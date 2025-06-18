
'use server';
/**
 * @fileOverview A chatbot flow for Gadag Grub Guide.
 *
 * - chatWithBot - Handles a user's message and returns the bot's response.
 * - ChatbotInput - The input type for the chatWithBot function.
 * - ChatbotOutput - The return type for the chatWithBot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initialRestaurantsData, initialReviewsData } from '@/lib/localStorage'; 
import type { Restaurant, Review } from '@/types';

// Tool to get restaurant information
const RestaurantInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  cuisine: z.string(),
  description: z.string(),
});
export type RestaurantInfo = z.infer<typeof RestaurantInfoSchema>;

const ListAvailableRestaurantsInputSchema = z.object({
  cuisine: z.string().optional().describe('Optional: Filter restaurants by this cuisine type.'),
  restaurantName: z.string().optional().describe('Optional: Get details for a specific restaurant by name.')
});

const ListAvailableRestaurantsOutputSchema = z.array(RestaurantInfoSchema)
  .describe('A list of available restaurants, potentially filtered by cuisine or name. Includes id, name, cuisine, and description.');

const listAvailableRestaurantsTool = ai.defineTool(
  {
    name: 'listAvailableRestaurantsTool',
    description: "Fetches a list of available restaurants including their ID, name, cuisine, and description. Can be filtered by cuisine type or a specific restaurant name. Use this to answer general questions about what restaurants are available, to find restaurants of a specific cuisine, or to get details (like ID) for specific restaurants if their names are mentioned. If a user asks for a specific restaurant and you don't see it in the list from a general query (no cuisine filter), you can assume it's not in your known list.",
    inputSchema: ListAvailableRestaurantsInputSchema,
    outputSchema: ListAvailableRestaurantsOutputSchema,
  },
  async (input) => {
    let restaurantsToReturn: Restaurant[] = initialRestaurantsData;
    if (input.cuisine) {
      restaurantsToReturn = restaurantsToReturn.filter(r => r.cuisine.toLowerCase().includes(input.cuisine!.toLowerCase()));
    }
    if (input.restaurantName) {
      restaurantsToReturn = restaurantsToReturn.filter(r => r.name.toLowerCase().includes(input.restaurantName!.toLowerCase()));
    }
    return restaurantsToReturn.map(r => ({ id: r.id, name: r.name, cuisine: r.cuisine, description: r.description }));
  }
);

// Tool to get restaurant reviews
const ReviewInfoSchema = z.object({
    username: z.string().optional(),
    text: z.string(),
    rating: z.number(),
});

const GetRestaurantReviewsInputSchema = z.object({
  restaurantName: z.string().describe("The name of the restaurant to fetch reviews for."),
});

const GetRestaurantReviewsOutputSchema = z.object({
  reviews: z.array(ReviewInfoSchema).optional().describe("An array of review objects, each containing username, text, and rating."),
  message: z.string().optional().describe("A message, e.g., if the restaurant or reviews are not found."),
  restaurantName: z.string().optional().describe("The name of the restaurant for which reviews were fetched/attempted.")
});


const getRestaurantReviewsTool = ai.defineTool(
  {
    name: 'getRestaurantReviewsTool',
    description: "Fetches recent reviews for a specific restaurant. Use this when a user asks to see reviews for a named restaurant. Returns up to 3 most recent reviews.",
    inputSchema: GetRestaurantReviewsInputSchema,
    outputSchema: GetRestaurantReviewsOutputSchema,
  },
  async (input) => {
    const foundRestaurant = initialRestaurantsData.find(
      (r) => r.name.toLowerCase().includes(input.restaurantName.toLowerCase())
    );

    if (!foundRestaurant) {
      return { restaurantName: input.restaurantName, message: `Sorry, I couldn't find a restaurant named "${input.restaurantName}".` };
    }

    const reviewsForRestaurant = initialReviewsData
      .filter((review) => review.restaurantId === foundRestaurant.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, most recent first
      .slice(0, 3) // Get top 3
      .map((r) => ({ username: r.username, text: r.text, rating: r.rating }));

    if (reviewsForRestaurant.length === 0) {
      return { restaurantName: foundRestaurant.name, message: `No reviews found for ${foundRestaurant.name} yet.` };
    }
    return { restaurantName: foundRestaurant.name, reviews: reviewsForRestaurant };
  }
);


// Chatbot flow schemas
const ChatbotMessagePartSchema = z.object({ text: z.string() });
const ChatbotMessageSchema = z.object({ 
    role: z.enum(['user', 'model']),
    parts: z.array(ChatbotMessagePartSchema)
});

const ChatbotInputSchema = z.object({
  userMessage: z.string().describe('The message from the user to the chatbot.'),
  chatHistory: z.array(ChatbotMessageSchema).optional().describe('The history of the conversation, if any, with user and model (bot) roles.')
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  botResponse: z.string().describe("The chatbot's response to the user's message."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;


// The main function that will be called by the client
export async function chatWithBot(input: ChatbotInput): Promise<ChatbotOutput> {
  return restaurantChatbotFlow(input);
}

const restaurantChatbotPrompt = ai.definePrompt({
  name: 'restaurantChatbotPrompt',
  system: `You are a friendly and helpful chatbot for 'Gadag Grub Guide', a website focused on restaurants in Gadag, Karnataka. Your name is GrubBot.
Your main goal is to help users explore restaurants, read reviews, and guide them on how to submit their own reviews.
Base your answers SOLELY on the information provided by your tools. Do not use any external knowledge or invent information.
When formatting ratings as stars, use ⭐ for each star (e.g., 4 stars is ⭐⭐⭐⭐).

Capabilities:
1.  **List Restaurants**:
    *   If a user asks to see restaurants (e.g., "Show me restaurants", "What options are there?"), use the \`listAvailableRestaurantsTool\` without any filters.
    *   Present the results as a list: "Restaurant Name – Cuisine Type". Example: "Hotel Shivaratna – South Indian". List up to 5.

2.  **Show Reviews**:
    *   If a user asks to "Show reviews for [Restaurant Name]" or similar, use the \`getRestaurantReviewsTool\` with the provided restaurant name.
    *   If the tool returns reviews, present up to 3 of them clearly. For each review, show: "Rating: [Star Emojis]/5 - \"[Review Text]\" (by [Username if available, otherwise 'Anonymous'])".
    *   If the tool returns a message (e.g., restaurant not found, no reviews), convey that message politely to the user.

3.  **Guide to Submit Review**:
    *   If a user says "I want to give a review", "submit a review", or similar:
        1.  Ask: "Great! Which restaurant would you like to review?"
        2.  When the user provides a restaurant name, use the \`listAvailableRestaurantsTool\` with the \`restaurantName\` parameter to find that specific restaurant and get its ID.
        3.  If the restaurant is found (the tool returns an array with at least one item), take the first item and respond: "Okay! To leave a review for [Restaurant Name], please go to our dedicated review page: /restaurants/[ID]/review. What else can I help you with?" (Replace [Restaurant Name] and [ID] with the actual name and ID from the tool's output).
        4.  If the restaurant is not found by the tool (tool returns an empty array or an error), respond: "Sorry, I couldn't find '[User's Restaurant Name]' in my list. You can browse all available restaurants to find it if you like."

4.  **Error Handling / Fallback**:
    *   If you don't understand a user's request or it's unrelated to the above capabilities, respond with: "Sorry, I didn’t quite get that. You can ask me to show restaurants, read reviews for a specific restaurant, or I can guide you on how to submit a review."

General Instructions:
- Keep your answers concise and helpful.
- Do not mention the names of the tools you are using to the user. Just provide the information as if you know it.
- If the user asks a follow-up question that can be answered from previously fetched tool data in the current conversation, try to use that before calling the tool again, unless new specific filtering is requested.`,
  tools: [listAvailableRestaurantsTool, getRestaurantReviewsTool],
});


const restaurantChatbotFlow = ai.defineFlow(
  {
    name: 'restaurantChatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const genkitMessages: Array<{ role: 'user' | 'model'; content: Array<{text: string}> }> = [];
    
    if (input.chatHistory) {
        input.chatHistory.forEach(msg => {
            // Ensure msg.parts is an array and each part has a text string.
            // Default to an empty string for text if it's not a string (Zod should prevent this).
            const CMFlowMessageParts = (msg.parts || []).map(part => ({ 
              text: typeof part.text === 'string' ? part.text : '' 
            }));
            
            genkitMessages.push({
                role: msg.role,
                // Ensure content is not an empty array; provide a default part if CMFlowMessageParts is empty.
                content: CMFlowMessageParts.length > 0 ? CMFlowMessageParts : [{ text: '' }]
            });
        });
    }
    
    // Ensure input.userMessage is a string. Default to empty string if not (Zod should prevent this).
    const currentUserMessageText = typeof input.userMessage === 'string' ? input.userMessage : '';
    genkitMessages.push({ role: 'user', content: [{text: currentUserMessageText}] });

    const result = await ai.generate({
        prompt: restaurantChatbotPrompt, 
        messages: genkitMessages,        
    });
    
    const responseText = result.text; 
    return { botResponse: responseText };
  }
);

