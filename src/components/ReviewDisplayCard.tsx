
"use client";

import type { Review } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/StarRating';
import { UserCircle, Building, CalendarDays, Edit3 } from 'lucide-react'; // Using UserCircle as a generic user icon

interface ReviewDisplayCardProps {
  review: Review;
  restaurantName: string;
}

export function ReviewDisplayCard({ review, restaurantName }: ReviewDisplayCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card">
      <CardHeader className="pb-3 pt-5 px-5 bg-muted/40">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-headline text-primary leading-tight break-words">
            {review.title}
          </CardTitle>
          <div className="ml-2 shrink-0">
            <StarRating value={review.rating} isEditable={false} size={18} />
          </div>
        </div>
         <CardDescription className="text-xs text-muted-foreground pt-1 flex items-center">
            <Building className="h-3 w-3 mr-1.5 shrink-0" /> For {restaurantName}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/90 text-sm">
          <p className="whitespace-pre-wrap leading-relaxed">{review.text}</p>
        </blockquote>
      </CardContent>
      <CardFooter className="p-4 bg-muted/40 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0">
        <div className="flex items-center">
          <UserCircle className="h-4 w-4 mr-1.5 shrink-0" />
          <span>By: {review.username || 'Anonymous'}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-1.5 shrink-0" />
          <span>{new Date(review.date).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
