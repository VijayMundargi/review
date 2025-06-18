
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/StarRating';
import { useAuth } from '@/contexts/AuthContext';
import { getRestaurantById, addReview as saveReviewToLocalStorage, getReviewsForRestaurant, updateRestaurant } from '@/lib/localStorage';
import type { Restaurant, Review as ReviewType } from '@/types';
import { submitReviewAction } from '@/actions/reviewActions';
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, ChevronLeft, Utensils } from 'lucide-react';
import Link from 'next/link';

const reviewFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  text: z.string().min(10, { message: "Review must be at least 10 characters." }),
  rating: z.number().min(1, { message: "Please provide a rating." }).max(5),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function SubmitReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReviews, setExistingReviews] = useState<ReviewType[]>([]);

  const restaurantId = typeof params.id === 'string' ? params.id : '';

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: "",
      text: "",
      rating: 0,
    },
  });

  useEffect(() => {
    if (restaurantId) {
      const foundRestaurant = getRestaurantById(restaurantId);
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        setExistingReviews(getReviewsForRestaurant(restaurantId));
      } else {
        toast({ variant: "destructive", title: "Error", description: "Restaurant not found." });
        router.push('/restaurants');
      }
    }
  }, [restaurantId, router, toast]);

  const onSubmit = async (values: ReviewFormValues) => {
    if (!currentUser || !restaurant) {
      toast({ variant: "destructive", title: "Error", description: "User or restaurant data missing." });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('restaurantId', restaurant.id);
    formData.append('restaurantName', restaurant.name);
    formData.append('currentDescription', restaurant.description);
    formData.append('userId', currentUser.id);
    formData.append('username', currentUser.username);
    formData.append('title', values.title);
    formData.append('text', values.text);
    formData.append('rating', String(values.rating));
    formData.append('existingReviewsJSON', JSON.stringify(existingReviews));

    try {
      const result = await submitReviewAction(formData);
      if (result.success && result.newReview) {
        saveReviewToLocalStorage(result.newReview);
        if (result.aiSuggestion) {
          const updatedRestaurantData = {
            ...restaurant,
            aiSuggestedDescription: result.aiSuggestion.suggestedDescription,
            aiReasoning: result.aiSuggestion.reasoning,
          };
          updateRestaurant(updatedRestaurantData);
        }
        toast({ title: "Review Submitted!", description: "Thank you for your feedback." });
        router.push('/restaurants');
      } else {
        const errorMsg = result.errors ? Object.values(result.errors).flat().join(', ') : "Failed to submit review.";
        toast({ variant: "destructive", title: "Submission Failed", description: errorMsg });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link href="/restaurants" className="inline-flex items-center text-sm text-primary hover:underline mb-6 group">
        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Restaurants
      </Link>
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-muted/30 p-6">
          <Utensils className="h-10 w-10 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">Write a Review for {restaurant.name}</CardTitle>
          <CardDescription className="text-muted-foreground">Share your experience with the community</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="rating" className="text-lg font-medium">Your Rating</Label>
              <Controller
                name="rating"
                control={form.control}
                render={({ field }) => (
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                    isEditable={true}
                    size={32}
                    className="justify-center sm:justify-start"
                  />
                )}
              />
              {form.formState.errors.rating && (
                <p className="text-sm text-destructive">{form.formState.errors.rating.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-medium">Review Title</Label>
              <Input
                id="title"
                placeholder="e.g., Amazing Dosa!"
                {...form.register('title')}
                className="text-base"
                aria-invalid={form.formState.errors.title ? "true" : "false"}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="text" className="text-lg font-medium">Detailed Review</Label>
              <Textarea
                id="text"
                placeholder="Share your thoughts on the food, service, and ambiance..."
                {...form.register('text')}
                rows={5}
                className="text-base"
                aria-invalid={form.formState.errors.text ? "true" : "false"}
              />
              {form.formState.errors.text && (
                <p className="text-sm text-destructive">{form.formState.errors.text.message}</p>
              )}
            </div>
            <CardFooter className="p-0 pt-6">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 transition-transform duration-150 hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                Submit Review
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

