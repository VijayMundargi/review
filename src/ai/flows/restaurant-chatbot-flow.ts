
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
import { initialRestaurantsData } from '@/lib/localStorage'; // Import the data

// Tool to get restaurant information
const RestaurantInfoSchema = z.object({
  name: z.string(),
  cuisine: z.string(),
  description: z.string(),
});
export type RestaurantInfo = z.infer<typeof RestaurantInfoSchema>;

const ListAvailableRestaurantsInputSchema = z.object({
  cuisine: z.string().optional().describe('Optional: Filter restaurants by this cuisine type.'),
});

const ListAvailableRestaurantsOutputSchema = z.array(RestaurantInfoSchema)
  .describe('A list of available restaurants, potentially filtered by cuisine. Includes name, cuisine, and description.');

const listAvailableRestaurantsTool = ai.defineTool(
  {
    name: 'listAvailableRestaurantsTool',
    description: "Fetches a list of available restaurants. Can be filtered by cuisine type. Use this to answer general questions about what restaurants are available, to find restaurants of a specific cuisine, or to get details about specific restaurants if their names are mentioned. If a user asks for a specific restaurant and you don't see it in the list from a general query (no cuisine filter), you can assume it's not in your known list.",
    inputSchema: ListAvailableRestaurantsInputSchema,
    outputSchema: ListAvailableRestaurantsOutputSchema,
  },
  async (input) => {
    let restaurantsToReturn = initialRestaurantsData;
    if (input.cuisine) {
      restaurantsToReturn = restaurantsToReturn.filter(r => r.cuisine.toLowerCase().includes(input.cuisine!.toLowerCase()));
    }
    return restaurantsToReturn.map(r => ({ name: r.name, cuisine: r.cuisine, description: r.description }));
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
  system: `You are a friendly and knowledgeable chatbot assistant for "Gadag Grub Guide", a website for finding and reviewing restaurants in Gadag.
Your primary goal is to assist users with their inquiries about these restaurants.
- When a user asks for restaurant recommendations, information about specific cuisines, or a list of restaurants, use the "listAvailableRestaurantsTool".
- If a user asks about a specific restaurant by name, use the "listAvailableRestaurantsTool" (you can call it without a cuisine filter if unsure or if the name is not found initially) and then extract the relevant information from its output to answer.
- If the tool returns no results for a specific query (e.g., a cuisine type with no matching restaurants, or a specific restaurant name not found), inform the user politely that you couldn't find information for that specific request based on your current data.
- Keep your answers concise, helpful, and directly related to the restaurants and their details (name, cuisine, description).
- Do not invent restaurants or details not provided by the tool. Your knowledge is strictly limited to what the tool provides.
- If the user's query is unrelated to restaurants in Gadag or the Gadag Grub Guide, politely state that you can only help with restaurant-related inquiries.
- Base your answers SOLELY on the information provided by the 'listAvailableRestaurantsTool'. Do not use any external knowledge.
- When presenting restaurant information, format it clearly. For example, if listing multiple restaurants, use bullet points.
- If you use the tool, do not just repeat the tool's output verbatim. Summarize or present the information in a conversational and user-friendly way.
- Do not mention the name of the tool you are using to the user. Just provide the information as if you know it.
- If the user asks a follow-up question that can be answered from previously fetched tool data in the current conversation, try to use that before calling the tool again, unless new specific filtering is requested.`,
  tools: [listAvailableRestaurantsTool],
  // Input and output schemas for the prompt itself are less critical here as we use generate({messages: ...})
  // but defining them for clarity of the flow's contract.
  input: { schema: ChatbotInputSchema }, 
  output: { schema: ChatbotOutputSchema }, 
});


const restaurantChatbotFlow = ai.defineFlow(
  {
    name: 'restaurantChatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const conversationMessages: Array<{ role: 'user' | 'model'; parts: Array<{text: string}> }> = [];
    
    if (input.chatHistory) {
        // Ensure chatHistory roles are correctly 'user' or 'model'
        input.chatHistory.forEach(msg => {
            conversationMessages.push({
                role: msg.role,
                parts: msg.parts.map(part => ({ text: part.text }))
            });
        });
    }
    // Add the current user message to the end of the history
    conversationMessages.push({ role: 'user', parts: [{text: input.userMessage}] });

    const result = await restaurantChatbotPrompt.generate({
        messages: conversationMessages,
    });
    
    const responseText = result.text();
    return { botResponse: responseText };
  }
);

