
"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Restaurant, Review } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { MessageSquare, Brain, Utensils } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface RestaurantCardProps {
  restaurant: Restaurant;
  reviews: Review[];
}

export function RestaurantCard({ restaurant, reviews }: RestaurantCardProps) {
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const recentReviews = reviews.slice(0, 2); // Show up to 2 recent reviews

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full animate-slide-in-up">
      <CardHeader className="p-0 relative">
        <Image
          src={restaurant.image}
          alt={`Image of ${restaurant.name}`}
          width={600}
          height={300}
          className="w-full h-48 object-cover"
          data-ai-hint={restaurant.dataAiHint}
        />
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent w-full p-4">
          <CardTitle className="text-2xl font-headline text-white">{restaurant.name}</CardTitle>
          <Badge variant="secondary" className="mt-1 bg-accent text-accent-foreground">{restaurant.cuisine}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardDescription className="text-foreground mb-2">{restaurant.description}</CardDescription>
        
        {restaurant.aiSuggestedDescription && (
          <Accordion type="single" collapsible className="w-full mt-3 mb-3">
            <AccordionItem value="ai-suggestion" className="border-accent/50">
              <AccordionTrigger className="text-sm text-accent hover:no-underline">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Description Suggestion
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-accent-foreground/80 p-2 bg-accent/10 rounded-md">
                <p className="font-semibold">{restaurant.aiSuggestedDescription}</p>
                {restaurant.aiReasoning && <p className="mt-1 italic text-xs">Reasoning: {restaurant.aiReasoning}</p>}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <div className="flex items-center space-x-2 mb-4">
          <StarRating value={averageRating} isEditable={false} size={20} />
          <span className="text-sm text-muted-foreground">
            ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
          </span>
        </div>

        <Separator className="my-4" />
        
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
          <MessageSquare className="h-4 w-4 mr-2 text-primary" />
          Recent Reviews
        </h4>
        {recentReviews.length > 0 ? (
          <ul className="space-y-3">
            {recentReviews.map(review => (
              <li key={review.id} className="text-xs border-l-2 border-primary pl-3 py-1 bg-muted/30 rounded-r-md">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-semibold text-primary">{review.title}</span>
                  <StarRating value={review.rating} isEditable={false} size={14} />
                </div>
                <p className="text-muted-foreground truncate">{review.text}</p>
                <p className="text-muted-foreground/70 text-right text-xs mt-0.5">- {review.username || 'Anonymous'}, {new Date(review.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">No reviews yet. Be the first!</p>
        )}
      </CardContent>
      <CardFooter className="p-6 bg-muted/50">
        <Link href={`/restaurants/${restaurant.id}/review`} passHref legacyBehavior>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-150 hover:scale-105">
            <Utensils className="mr-2 h-4 w-4" /> Write a Review
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
