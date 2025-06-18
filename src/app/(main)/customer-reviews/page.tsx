
"use client";

import React, { useState, useEffect } from 'react';
import type { Restaurant as RestaurantType, Review as ReviewType } from '@/types';
import { getRestaurants, getReviews } from '@/lib/localStorage';
import { ReviewDisplayCard } from '@/components/ReviewDisplayCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ListFilter, MessageSquareOff } from 'lucide-react';

export default function CustomerReviewsPage() {
  const [allReviews, setAllReviews] = useState<ReviewType[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewType[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      const storedRestaurants = getRestaurants();
      const storedReviews = getReviews().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by most recent
      
      setRestaurants(storedRestaurants);
      setAllReviews(storedReviews);
      setFilteredReviews(storedReviews); // Initially show all reviews
      setLoading(false);
    };
    fetchData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gadagGrubGuide_restaurants' || event.key === 'gadagGrubGuide_reviews') {
        fetchData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (selectedRestaurantId === 'all') {
      setFilteredReviews(allReviews);
    } else {
      setFilteredReviews(allReviews.filter(review => review.restaurantId === selectedRestaurantId));
    }
  }, [selectedRestaurantId, allReviews]);

  const getRestaurantNameById = (id: string): string => {
    const restaurant = restaurants.find(r => r.id === id);
    return restaurant ? restaurant.name : 'Unknown Restaurant';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-foreground">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">Customer Reviews</h1>
        <p className="text-lg text-muted-foreground mt-2">Read what others are saying about Gadag's eateries.</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-card shadow rounded-lg sticky top-16 z-40">
        <div className="relative flex-grow sm:flex-grow-0 sm:w-auto">
          <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
          <Select value={selectedRestaurantId} onValueChange={setSelectedRestaurantId}>
            <SelectTrigger className="w-full sm:w-[280px] pl-10" aria-label="Filter by restaurant">
              <SelectValue placeholder="Filter by restaurant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Restaurants</SelectItem>
              {restaurants.map(restaurant => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review, index) => (
            <div key={review.id} style={{ animationDelay: `${0.1 + index * 0.05}s` }} className="animate-slide-in-up">
              <ReviewDisplayCard review={review} restaurantName={getRestaurantNameById(review.restaurantId)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground text-lg py-12 flex flex-col items-center">
          <MessageSquareOff className="h-16 w-16 text-primary mb-4" />
          <p className="font-semibold text-xl text-foreground">No Reviews Found</p>
          <p>
            {selectedRestaurantId === 'all' 
              ? "There are no reviews yet. Be the first to share your experience!"
              : `There are no reviews for ${getRestaurantNameById(selectedRestaurantId)} yet.`}
          </p>
        </div>
      )}
    </div>
  );
}
