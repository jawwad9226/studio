'use client';

import React, { useEffect, useState } from 'react';
import { useHabits } from '@/context/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

const MAX_DISPLAY_DAYS = 21;

export const StreakDisplay: React.FC = () => {
  const { currentStreak, isLoading } = useHabits();
  const [displayStreak, setDisplayStreak] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Only animate if the streak has actually changed
    if (currentStreak !== displayStreak) {
      setDisplayStreak(currentStreak);
      setAnimated(true);
      const timer = setTimeout(() => setAnimated(false), 500); // Duration of pulse animation
      return () => clearTimeout(timer);
    }
  }, [currentStreak, displayStreak]);

  if (isLoading) {
    return (
       <Card className="shadow-lg backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <Skeleton className="h-7 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
          <div className="mt-2 text-center">
            <Skeleton className="h-6 w-24 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const streakPercentage = (Math.min(currentStreak, MAX_DISPLAY_DAYS) / MAX_DISPLAY_DAYS) * 100;
  const daysRemaining = MAX_DISPLAY_DAYS - (currentStreak % MAX_DISPLAY_DAYS === 0 && currentStreak > 0 ? MAX_DISPLAY_DAYS : currentStreak % MAX_DISPLAY_DAYS) ;
  const completedCycles = Math.floor(currentStreak / MAX_DISPLAY_DAYS);


  return (
    <Card className={cn("shadow-lg backdrop-blur-sm bg-card/80", animated && "animate-pulse-once")}>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Flame className="w-6 h-6 mr-2 text-primary" />
          Current Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-2 mb-3">
          {Array.from({ length: MAX_DISPLAY_DAYS }).map((_, index) => {
            const dayInCycle = currentStreak % MAX_DISPLAY_DAYS === 0 && currentStreak > 0 ? MAX_DISPLAY_DAYS : currentStreak % MAX_DISPLAY_DAYS;
            const isActive = index < dayInCycle;
            return (
              <div
                key={index}
                className={cn(
                  "h-3 sm:h-4 w-3 sm:w-4 rounded-full transition-all duration-300",
                  isActive ? 'bg-accent' : 'bg-muted',
                  animated && isActive && index === dayInCycle -1 && "animate-ping opacity-75"
                )}
                style={{ animationDelay: animated && isActive ? `${index * 20}ms` : undefined }}
                title={`Day ${index + 1}`}
              />
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-4xl font-bold text-primary font-headline">
            {currentStreak} Day{currentStreak === 1 ? '' : 's'}
          </p>
          {currentStreak > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {currentStreak >= MAX_DISPLAY_DAYS 
                ? `${daysRemaining === MAX_DISPLAY_DAYS ? `Starting new ${MAX_DISPLAY_DAYS}-day cycle!` : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} to next ${MAX_DISPLAY_DAYS}-day cycle!`}`
                : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} to complete ${MAX_DISPLAY_DAYS}-day cycle!`}
            </p>
          )}
           {completedCycles > 0 && (
            <p className="text-sm text-accent font-semibold mt-1 flex items-center justify-center">
              <Zap className="w-4 h-4 mr-1" />
              {completedCycles} cycle{completedCycles === 1 ? '' : 's'} completed!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
