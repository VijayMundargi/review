
export interface User {
  id: string;
  username: string;
  // Password stored hashed in a real app, plain for localStorage demo
  password?: string; 
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  image: string;
  dataAiHint: string;
  aiSuggestedDescription?: string;
  aiReasoning?: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string; // Or store full username for display
  username?: string; 
  title: string;
  text: string;
  rating: number; // 1-5
  date: string; // ISO string
}
