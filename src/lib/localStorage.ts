import type { Restaurant, Review, User } from '@/types';

const USERS_KEY = 'gadagGrubGuide_users';
const RESTAURANTS_KEY = 'gadagGrubGuide_restaurants';
const REVIEWS_KEY = 'gadagGrubGuide_reviews';
const CURRENT_USER_KEY = 'gadagGrubGuide_currentUser';


const initialRestaurantsData: Restaurant[] = [
  { id: '1', name: 'Hotel Shivaratna', cuisine: 'South Indian', description: 'Authentic South Indian delicacies, known for its crispy dosas and flavorful idlis. A local favorite for breakfast and lunch.', image: 'https://placehold.co/600x400.png', dataAiHint: 'indian food', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '2', name: 'Nisarga Garden Family Restaurant', cuisine: 'Multi-cuisine', description: 'A perfect place for family dining with a variety of dishes, set in a pleasant garden atmosphere. Offers North Indian, South Indian, and Chinese options.', image: 'https://placehold.co/600x400.png', dataAiHint: 'restaurant garden', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '3', name: 'Shree Guru Residency', cuisine: 'North & South Indian', description: 'Serving a blend of North and South Indian flavors, popular for its thalis and biryanis. Clean and comfortable dining.', image: 'https://placehold.co/600x400.png', dataAiHint: 'indian cuisine', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '4', name: 'Kamat Hotel', cuisine: 'Vegetarian', description: 'Pure vegetarian restaurant with traditional recipes from Karnataka. Famous for its authentic Udupi-style food.', image: 'https://placehold.co/600x400.png', dataAiHint: 'vegetarian meal', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '5', name: 'Swathi Family Restaurant', cuisine: 'Indo-Chinese', description: 'Delicious Indo-Chinese fusion cuisine, offering a mix of spicy Schezwan dishes and popular Chinese favorites adapted to Indian tastes.', image: 'https://placehold.co/600x400.png', dataAiHint: 'chinese food', aiSuggestedDescription: '', aiReasoning: '' }
];

// Generic getter
function getItems<T>(key: string, defaultValue: T[] = []): T[] {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const items = localStorage.getItem(key);
    return items ? JSON.parse(items) : defaultValue;
  } catch (error) {
    console.error(`Error getting items from localStorage for key ${key}:`, error);
    return defaultValue;
  }
}

// Generic setter
function setItems<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting items to localStorage for key ${key}:`, error);
  }
}

// Users
export const getUsers = (): User[] => getItems<User>(USERS_KEY);
export const setUsers = (users: User[]): void => setItems<User>(USERS_KEY, users);

// Restaurants
export const getRestaurants = (): Restaurant[] => {
  const restaurants = getItems<Restaurant>(RESTAURANTS_KEY, []);
  if (restaurants.length === 0 && typeof window !== 'undefined') {
    // Initialize with default data if localStorage is empty
    setItems<Restaurant>(RESTAURANTS_KEY, initialRestaurantsData);
    return initialRestaurantsData;
  }
  return restaurants;
}
export const setRestaurants = (restaurants: Restaurant[]): void => setItems<Restaurant>(RESTAURANTS_KEY, restaurants);
export const getRestaurantById = (id: string): Restaurant | undefined => getRestaurants().find(r => r.id === id);
export const updateRestaurant = (updatedRestaurant: Restaurant): void => {
  const restaurants = getRestaurants();
  const index = restaurants.findIndex(r => r.id === updatedRestaurant.id);
  if (index !== -1) {
    restaurants[index] = updatedRestaurant;
    setRestaurants(restaurants);
  }
};


// Reviews
export const getReviews = (): Review[] => getItems<Review>(REVIEWS_KEY);
export const setReviews = (reviews: Review[]): void => setItems<Review>(REVIEWS_KEY, reviews);
export const getReviewsForRestaurant = (restaurantId: string): Review[] => getReviews().filter(review => review.restaurantId === restaurantId);
export const addReview = (review: Review): void => {
  const reviews = getReviews();
  setReviews([review, ...reviews]); // Add new review to the beginning
};

// Current User (Session)
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user from localStorage:', error);
    return null;
  }
}
export const setCurrentUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Error setting current user in localStorage:', error);
  }
}

// Initialize restaurants if not already present
if (typeof window !== 'undefined' && !localStorage.getItem(RESTAURANTS_KEY)) {
  localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(initialRestaurantsData));
}
