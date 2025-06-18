import type { Restaurant, Review, User } from '@/types';

const USERS_KEY = 'gadagGrubGuide_users';
const RESTAURANTS_KEY = 'gadagGrubGuide_restaurants';
const REVIEWS_KEY = 'gadagGrubGuide_reviews';
const CURRENT_USER_KEY = 'gadagGrubGuide_currentUser';


export const initialRestaurantsData: Restaurant[] = [
  { id: '1', name: 'Shivaratna Grand Eatery', cuisine: 'South Indian', description: 'Authentic South Indian delicacies, known for its crispy dosas and flavorful idlis. A local favorite for breakfast and lunch.', image: 'https://placehold.co/600x400.png', dataAiHint: 'indian dosa', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '2', name: 'Nisarga Garden Family Restaurant', cuisine: 'Multi-cuisine', description: 'A perfect place for family dining with a variety of dishes, set in a pleasant garden atmosphere. Offers North Indian, South Indian, and Chinese options.', image: 'https://placehold.co/600x400.png', dataAiHint: 'restaurant garden', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '3', name: 'Shree Guru Residency', cuisine: 'North & South Indian', description: 'Serving a blend of North and South Indian flavors, popular for its thalis and biryanis. Clean and comfortable dining.', image: 'https://placehold.co/600x400.png', dataAiHint: 'indian thali', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '4', name: 'Kamat Hotel', cuisine: 'Vegetarian', description: 'Pure vegetarian restaurant with traditional recipes from Karnataka. Famous for its authentic Udupi-style food.', image: 'https://placehold.co/600x400.png', dataAiHint: 'vegetarian thali', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '5', name: 'Swathi Family Restaurant', cuisine: 'Indo-Chinese', description: 'Delicious Indo-Chinese fusion cuisine, offering a mix of spicy Schezwan dishes and popular Chinese favorites adapted to Indian tastes.', image: 'https://placehold.co/600x400.png', dataAiHint: 'chinese noodles', aiSuggestedDescription: '', aiReasoning: '' }
];

export const initialReviewsData: Review[] = [
  { id: 'r1', restaurantId: '1', userId: 'user123', username: 'FoodieGal', title: 'Amazing Dosa!', text: 'Loved the masala dosa at Shivaratna Grand Eatery! Crispy and flavorful.', rating: 4, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r1a', restaurantId: '1', userId: 'user456', username: 'CriticBob', title: 'Good, not great', text: 'Masala dosa was decent, service was quick. Could be spicier.', rating: 3, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r2', restaurantId: '1', userId: 'user456', username: 'BiryaniKing', title: 'Decent South Indian', text: 'The idlis were soft, but the sambar could be better.', rating: 3, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r3', restaurantId: '2', userId: 'user789', username: 'FamilyDiner', title: 'Great for Families', text: 'Great ambiance and paneer tikka at Nisarga! Kids loved the garden.', rating: 5, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r4', restaurantId: '2', userId: 'user101', username: 'QuickBite', title: 'Good food, slow service', text: 'The North Indian dishes were tasty, but service was a bit slow during peak hours.', rating: 3, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r4a', restaurantId: '2', userId: 'user102', username: 'AnnoyedEater', title: 'Too Slow', text: 'Waited ages for our food. Not coming back on a weekend.', rating: 2, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r5', restaurantId: '4', userId: 'user202', username: 'VegLover', title: 'Authentic Thali', text: 'Best vegetarian thali in town! So many varieties and authentic taste.', rating: 5, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r6', restaurantId: '4', userId: 'user303', username: 'LocalExplorer', title: 'Bit Crowded', text: 'Decent Udupi food, but the place gets a bit crowded during lunch.', rating: 3, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r7', restaurantId: '3', userId: 'user303', username: 'SpiceQueen', title: 'Delicious Biryani', text: 'The biryani here is a must-try! Perfectly spiced.', rating: 5, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r8', restaurantId: '5', userId: 'user303', username: 'NoodleFan', title: 'Yummy Noodles', text: 'Schezwan noodles were fantastic. Good portion size too.', rating: 4, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
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
    setItems<Restaurant>(RESTAURANTS_KEY, initialRestaurantsData);
    return initialRestaurantsData;
  }
  // If localStorage has data, but it's the old version, update it.
  // This is a simple way to ensure updates to initialRestaurantsData propagate
  // if the user already has an older version in their localStorage.
  // A more robust solution might involve versioning the data.
  const firstRestaurant = restaurants.find(r => r.id === '1');
  if (firstRestaurant && firstRestaurant.name === 'Hotel Shivaratna') {
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
export const getReviews = (): Review[] => {
    const reviews = getItems<Review>(REVIEWS_KEY, []);
    if (reviews.length === 0 && typeof window !== 'undefined') {
        setItems<Review>(REVIEWS_KEY, initialReviewsData);
        return initialReviewsData;
    }
    // Check if reviews need updating based on the restaurant name change
    const firstReviewForRestaurant1 = reviews.find(r => r.restaurantId === '1' && r.text.includes('Hotel Shivaratna'));
    if (firstReviewForRestaurant1) {
      setItems<Review>(REVIEWS_KEY, initialReviewsData);
      return initialReviewsData;
    }
    return reviews;
};
export const setReviews = (reviews: Review[]): void => setItems<Review>(REVIEWS_KEY, reviews);
export const getReviewsForRestaurant = (restaurantId: string): Review[] => getReviews().filter(review => review.restaurantId === restaurantId);
export const addReview = (review: Review): void => {
  const reviews = getReviews();
  setReviews([review, ...reviews]); 
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

// Initialize data if not already present
if (typeof window !== 'undefined') {
    if (!localStorage.getItem(RESTAURANTS_KEY)) {
        localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(initialRestaurantsData));
    } else {
        // Check if existing data needs update (simple check for the first restaurant name)
        const storedRestaurants = JSON.parse(localStorage.getItem(RESTAURANTS_KEY) || '[]') as Restaurant[];
        if (storedRestaurants.length > 0 && storedRestaurants[0].id === '1' && storedRestaurants[0].name === 'Hotel Shivaratna') {
            localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(initialRestaurantsData));
        }
    }
    if (!localStorage.getItem(REVIEWS_KEY)) {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(initialReviewsData));
    } else {
        // Check if existing reviews need update
        const storedReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]') as Review[];
        const firstReviewForRestaurant1 = storedReviews.find(r => r.restaurantId === '1' && r.text.includes('Hotel Shivaratna'));
         if (firstReviewForRestaurant1) {
            localStorage.setItem(REVIEWS_KEY, JSON.stringify(initialReviewsData));
        }
    }
}

