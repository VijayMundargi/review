
"use client";

import React, { useState, useEffect } from 'react';
import type { Restaurant as RestaurantType, Review } from '@/types';
import { getRestaurants, getReviewsForRestaurant } from '@/lib/localStorage';
import { RestaurantCard } from '@/components/RestaurantCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ListFilter, Loader2 } from 'lucide-react';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [allReviews, setAllReviews] = useState<Record<string, Review[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = () => {
      const storedRestaurants = getRestaurants();
      setRestaurants(storedRestaurants);
      
      const reviewsMap: Record<string, Review[]> = {};
      storedRestaurants.forEach(restaurant => {
        reviewsMap[restaurant.id] = getReviewsForRestaurant(restaurant.id);
      });
      setAllReviews(reviewsMap);
      setLoading(false);
    };
    
    fetchRestaurantData();
    
    // Optional: Add event listener for localStorage changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gadagGrubGuide_restaurants' || event.key === 'gadagGrubGuide_reviews') {
        fetchRestaurantData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const nameMatch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const cuisineMatch = cuisineFilter === 'all' || restaurant.cuisine.toLowerCase().includes(cuisineFilter.toLowerCase());
    return nameMatch && cuisineMatch;
  });

  const uniqueCuisines = ['all', ...new Set(restaurants.map(r => r.cuisine))];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-foreground">Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center animate-fade-in">
        <h1 className="text-4xl font-bold font-headline text-primary">Explore Gadag's Finest</h1>
        <p className="text-lg text-muted-foreground mt-2">Discover and review the best dining experiences in town.</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-card shadow rounded-lg sticky top-16 z-40 animate-fade-in" style={{animationDelay: '0.2s'}}>
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Search restaurants"
          />
        </div>
        <div className="relative">
           <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
            <SelectTrigger className="w-full sm:w-[200px] pl-10" aria-label="Filter by cuisine">
              <SelectValue placeholder="Filter by cuisine" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCuisines.map(cuisine => (
                <SelectItem key={cuisine} value={cuisine} className="capitalize">
                  {cuisine === 'all' ? 'All Cuisines' : cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant, index) => (
            <div key={restaurant.id} style={{ animationDelay: `${0.3 + index * 0.1}s` }} className="animate-slide-in-up">
              <RestaurantCard restaurant={restaurant} reviews={allReviews[restaurant.id] || []} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-12">
          No restaurants match your search criteria. Try a different search or filter.
        </p>
      )}
    </div>
  );
}
