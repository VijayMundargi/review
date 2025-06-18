
"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  count?: number;
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  color?: string;
  hoverColor?: string;
  inactiveColor?: string;
  isEditable?: boolean;
  className?: string;
}

export function StarRating({
  count = 5,
  value,
  onChange,
  size = 24,
  color = "hsl(var(--accent))", // Mustard Yellow
  hoverColor = "hsl(var(--primary))", // Earthy Red
  inactiveColor = "hsl(var(--muted-foreground))",
  isEditable = false,
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  const stars = Array(count).fill(0);

  const handleClick = (newValue: number) => {
    if (isEditable && onChange) {
      onChange(newValue);
    }
  };

  const handleMouseOver = (newHoverValue: number) => {
    if (isEditable) {
      setHoverValue(newHoverValue);
    }
  };

  const handleMouseLeave = () => {
    if (isEditable) {
      setHoverValue(undefined);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {stars.map((_, index) => {
        const starValue = index + 1;
        let starColor = inactiveColor;
        if (hoverValue !== undefined) {
          starColor = starValue <= hoverValue ? hoverColor : inactiveColor;
        } else {
          starColor = starValue <= value ? color : inactiveColor;
        }

        return (
          <Star
            key={index}
            size={size}
            color={starColor}
            fill={starColor}
            className={cn(
              isEditable ? 'cursor-pointer transition-transform duration-150 hover:scale-110' : '',
              'shrink-0'
            )}
            onClick={() => handleClick(starValue)}
            onMouseOver={() => handleMouseOver(starValue)}
            onMouseLeave={handleMouseLeave}
            aria-label={isEditable ? `Rate ${starValue} of ${count} stars` : `Rated ${value} of ${count} stars`}
          />
        );
      })}
    </div>
  );
}
