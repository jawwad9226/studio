
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useHabits } from '@/context/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { motivationalMessages } from '@/lib/motivationalMessages';

export const MotivationalMessageCard: React.FC = () => {
  const { tasks, isLoading: habitsLoading, currentStreak } = useHabits();
  const [displayMessage, setDisplayMessage] = useState<string>("Loading motivation...");

  useEffect(() => {
    if (habitsLoading) {
      // Skeleton will be shown, but we can set a placeholder
      setDisplayMessage("Analyzing your awesome progress...");
      return;
    }

    if (tasks.length === 0) {
      setDisplayMessage("Set up your habits to get personalized motivation!");
    } else {
      // This part runs client-side due to Math.random()
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      setDisplayMessage(motivationalMessages[randomIndex]);
    }
  }, [habitsLoading, tasks.length, currentStreak]); // Re-pick message if habits load, tasks change, or streak changes


  return (
    <Card className="shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Lightbulb className="w-6 h-6 mr-2 text-primary" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {habitsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <Skeleton className="h-4 w-4/6 mx-auto" />
          </div>
        ) : (
          <p className="text-lg italic text-foreground/90 leading-relaxed">&quot;{displayMessage}&quot;</p>
        )}
      </CardContent>
    </Card>
  );
};
