
import type { Restaurant, Review, User } from '@/types';

const USERS_KEY = 'gadagGrubGuide_users';
const RESTAURANTS_KEY = 'gadagGrubGuide_restaurants';
const REVIEWS_KEY = 'gadagGrubGuide_reviews';
const CURRENT_USER_KEY = 'gadagGrubGuide_currentUser';


export const initialRestaurantsData: Restaurant[] = [
  { id: '1', name: 'Shivaratna Grand Eatery', cuisine: 'South Indian', description: 'Authentic South Indian delicacies, known for its crispy dosas and flavorful idlis. A local favorite for breakfast and lunch.', image: 'https://placehold.co/600x400.png', dataAiHint: 'crispy dosa', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '2', name: 'Nisarga Garden Family Restaurant', cuisine: 'Multi-cuisine', description: 'A perfect place for family dining with a variety of dishes, set in a pleasant garden atmosphere. Offers North Indian, South Indian, and Chinese options.', image: 'https://placehold.co/600x400.png', dataAiHint: 'garden dining', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '3', name: 'Shree Guru Residency', cuisine: 'North & South Indian', description: 'Serving a blend of North and South Indian flavors, popular for its thalis and biryanis. Clean and comfortable dining.', image: 'https://placehold.co/600x400.png', dataAiHint: 'biryani plate', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '4', name: 'Kamat Hotel', cuisine: 'Vegetarian', description: 'Pure vegetarian restaurant with traditional recipes from Karnataka. Famous for its authentic Udupi-style food.', image: 'https://placehold.co/600x400.png', dataAiHint: 'udupi meal', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '5', name: 'Swathi Family Restaurant', cuisine: 'Indo-Chinese', description: 'Delicious Indo-Chinese fusion cuisine, offering a mix of spicy Schezwan dishes and popular Chinese favorites adapted to Indian tastes.', image: 'https://placehold.co/600x400.png', dataAiHint: 'schezwan noodles', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '6', name: 'Annapoorna Udupi Bhojana', cuisine: 'Udupi South Indian', description: 'Classic Udupi-style vegetarian meals, known for its authentic flavors and quick service. A go-to for traditional Kannada thalis.', image: 'https://placehold.co/600x400.png', dataAiHint: 'kannada thali', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '7', name: 'Spice Garden Restaurant', cuisine: 'North Indian & Chinese', description: 'A family-friendly restaurant offering a diverse menu of popular North Indian curries, tandoori items, and flavorful Chinese dishes.', image: 'https://placehold.co/600x400.png', dataAiHint: 'tandoori platter', aiSuggestedDescription: '', aiReasoning: '' },
  { id: '8', name: 'City Light Cafe', cuisine: 'Cafe & Snacks', description: 'A cozy spot for quick bites, tea, coffee, and local snacks. Perfect for a casual hangout or an evening snack.', image: 'https://placehold.co/600x400.png', dataAiHint: 'chai snacks', aiSuggestedDescription: '', aiReasoning: '' }
];

export const initialReviewsData: Review[] = [
  { id: 'r1', restaurantId: '1', userId: 'user123', username: 'FoodieGal', title: 'Amazing Dosa!', text: 'Loved the masala dosa at Shivaratna Grand Eatery! Crispy and flavorful.', rating: 4, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r1a', restaurantId: '1', userId: 'user456', username: 'CriticBob', title: 'Good, not great', text: 'Masala dosa at Shivaratna Grand Eatery was decent, service was quick. Could be spicier.', rating: 3, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r2', restaurantId: '1', userId: 'user456', username: 'BiryaniKing', title: 'Decent South Indian', text: 'The idlis at Shivaratna Grand Eatery were soft, but the sambar could be better.', rating: 3, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r3', restaurantId: '2', userId: 'user789', username: 'FamilyDiner', title: 'Great for Families', text: 'Great ambiance and paneer tikka at Nisarga! Kids loved the garden.', rating: 5, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r4', restaurantId: '2', userId: 'user101', username: 'QuickBite', title: 'Good food, slow service', text: 'The North Indian dishes at Nisarga Garden were tasty, but service was a bit slow during peak hours.', rating: 3, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r4a', restaurantId: '2', userId: 'user102', username: 'AnnoyedEater', title: 'Too Slow', text: 'Waited ages for our food at Nisarga. Not coming back on a weekend.', rating: 2, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r5', restaurantId: '4', userId: 'user202', username: 'VegLover', title: 'Authentic Thali', text: 'Best vegetarian thali in town at Kamat Hotel! So many varieties and authentic taste.', rating: 5, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r6', restaurantId: '4', userId: 'user303', username: 'LocalExplorer', title: 'Bit Crowded', text: 'Decent Udupi food at Kamat, but the place gets a bit crowded during lunch.', rating: 3, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r7', restaurantId: '3', userId: 'user303', username: 'SpiceQueen', title: 'Delicious Biryani', text: 'The biryani at Shree Guru Residency is a must-try! Perfectly spiced.', rating: 5, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r8', restaurantId: '5', userId: 'user303', username: 'NoodleFan', title: 'Yummy Noodles', text: 'Schezwan noodles at Swathi were fantastic. Good portion size too.', rating: 4, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r9', restaurantId: '6', userId: 'user404', username: 'ThaliLover', title: 'Authentic Udupi Meal', text: 'Annapoorna Udupi Bhojana serves a really good, unlimited thali. Very satisfying!', rating: 5, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r10', restaurantId: '7', userId: 'user505', username: 'CurryFan', title: 'Tasty Paneer Butter Masala', text: 'Enjoyed the Paneer Butter Masala at Spice Garden. The naans were soft too.', rating: 4, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r11', restaurantId: '8', userId: 'user606', username: 'ChaiAddict', title: 'Nice Tea Spot', text: 'City Light Cafe is great for evening tea and some light snacks. Very affordable.', rating: 4, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
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
  // Check against an old name that was updated. If the user has this, they have old data.
  if (firstRestaurant && firstRestaurant.name === 'Hotel Shivaratna') { 
     setItems<Restaurant>(RESTAURANTS_KEY, initialRestaurantsData);
     return initialRestaurantsData;
  }
  // Add a check for number of restaurants to trigger update if new ones were added to initialData
  // Also check if dataAiHint needs update
  let needsUpdate = restaurants.length < initialRestaurantsData.length;
  if (!needsUpdate) {
    for (const initialRestaurant of initialRestaurantsData) {
      const storedRestaurant = restaurants.find(r => r.id === initialRestaurant.id);
      if (storedRestaurant && storedRestaurant.dataAiHint !== initialRestaurant.dataAiHint) {
        needsUpdate = true;
        break;
      }
    }
  }

  if (needsUpdate && typeof window !== 'undefined') {
    const updatedRestaurants = [...initialRestaurantsData]; // Start with fresh data
    const initialIds = new Set(initialRestaurantsData.map(r => r.id));

    // Merge any user-specific changes (like AI suggestions) from old stored data
    // for restaurants that still exist in the new initial data.
    restaurants.forEach(storedRestaurant => {
      if (initialIds.has(storedRestaurant.id)) {
        const targetIndex = updatedRestaurants.findIndex(ur => ur.id === storedRestaurant.id);
        if (targetIndex !== -1) {
          // Preserve AI suggestions if they exist on stored restaurant
          updatedRestaurants[targetIndex] = {
            ...initialRestaurantsData.find(ir => ir.id === storedRestaurant.id)!, // Get latest static data
            aiSuggestedDescription: storedRestaurant.aiSuggestedDescription || updatedRestaurants[targetIndex].aiSuggestedDescription,
            aiReasoning: storedRestaurant.aiReasoning || updatedRestaurants[targetIndex].aiReasoning,
          };
        }
      }
    });
    setItems<Restaurant>(RESTAURANTS_KEY, updatedRestaurants);
    return updatedRestaurants;
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
    // Add a check for number of reviews to trigger update if new ones were added to initialData
    if (reviews.length < initialReviewsData.length && typeof window !== 'undefined') {
      const existingIds = new Set(reviews.map(r => r.id));
      const updatedReviews = [...reviews];
      initialReviewsData.forEach(initialReview => {
        if (!existingIds.has(initialReview.id)) {
          updatedReviews.push(initialReview);
        }
      });
      // Re-sort by date after adding new ones
      updatedReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setItems<Review>(REVIEWS_KEY, updatedReviews);
      return updatedReviews;
    }
    return reviews;
};
export const setReviews = (reviews: Review[]): void => setItems<Review>(REVIEWS_KEY, reviews);
export const getReviewsForRestaurant = (restaurantId: string): Review[] => getReviews().filter(review => review.restaurantId === restaurantId);
export const addReview = (review: Review): void => {
  const reviews = getReviews();
  // Add new review and then sort all reviews by date
  const updatedReviews = [review, ...reviews].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  setReviews(updatedReviews); 
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
        // Check if existing data needs update (simple check for the first restaurant name or count or hint change)
        const storedRestaurants = JSON.parse(localStorage.getItem(RESTAURANTS_KEY) || '[]') as Restaurant[];
        let needsRestaurantUpdate = storedRestaurants.length < initialRestaurantsData.length;
        if (!needsRestaurantUpdate) {
            const firstInitialRestaurant = initialRestaurantsData.find(r => r.id === '1');
            const firstStoredRestaurant = storedRestaurants.find(r => r.id === '1');
            if (firstStoredRestaurant && firstInitialRestaurant && 
                (firstStoredRestaurant.name === 'Hotel Shivaratna' || firstStoredRestaurant.dataAiHint !== firstInitialRestaurant.dataAiHint)) {
                needsRestaurantUpdate = true;
            }
            if (!needsRestaurantUpdate) { // Check all hints if names and count are okay
                 for (const initialRestaurant of initialRestaurantsData) {
                    const storedRestaurant = storedRestaurants.find(r => r.id === initialRestaurant.id);
                    if (storedRestaurant && storedRestaurant.dataAiHint !== initialRestaurant.dataAiHint) {
                        needsRestaurantUpdate = true;
                        break;
                    }
                }
            }
        }

        if (needsRestaurantUpdate) {
            const updatedRestaurants = [...initialRestaurantsData];
            const initialIds = new Set(initialRestaurantsData.map(r => r.id));
            storedRestaurants.forEach(storedRestaurant => {
              if (initialIds.has(storedRestaurant.id)) {
                const targetIndex = updatedRestaurants.findIndex(ur => ur.id === storedRestaurant.id);
                if (targetIndex !== -1) {
                  updatedRestaurants[targetIndex] = {
                    ...initialRestaurantsData.find(ir => ir.id === storedRestaurant.id)!,
                    aiSuggestedDescription: storedRestaurant.aiSuggestedDescription || updatedRestaurants[targetIndex].aiSuggestedDescription,
                    aiReasoning: storedRestaurant.aiReasoning || updatedRestaurants[targetIndex].aiReasoning,
                  };
                }
              }
            });
            localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(updatedRestaurants));
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
        } else if (storedReviews.length < initialReviewsData.length) {
            const existingIds = new Set(storedReviews.map(r => r.id));
            const updatedReviews = [...storedReviews];
            initialReviewsData.forEach(initialReview => {
              if (!existingIds.has(initialReview.id)) {
                updatedReviews.push(initialReview);
              }
            });
            updatedReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
        }
    }
}
