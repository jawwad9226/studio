'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useHabits } from '@/context/HabitContext';
import { getMotivationalMessageAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const MotivationalMessageCard: React.FC = () => {
  const { tasks, isLoading: habitsLoading, getHistoricalDataForAI, getTodayCompletionStatusForAI, currentStreak } = useHabits();
  const [message, setMessage] = useState<string>('');
  const [isFetchingMessage, setIsFetchingMessage] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchMessage = useCallback(async () => {
    if (habitsLoading || tasks.length === 0) {
      setMessage("Set up your habits to get personalized motivation!");
      return;
    }

    setIsFetchingMessage(true);
    try {
      const completionStatus = getTodayCompletionStatusForAI();
      const historicalData = getHistoricalDataForAI(7); // Get last 7 days of history

      const aiInput = { completionStatus, historicalData };
      const result = await getMotivationalMessageAction(aiInput);
      setMessage(result.message);
    } catch (error) {
      console.error("Failed to fetch motivational message:", error);
      setMessage("Remember why you started. You've got this!"); // Fallback message
      toast({
        title: "Motivation Error",
        description: "Could not fetch a personalized message. Using a default one.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingMessage(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitsLoading, tasks, getHistoricalDataForAI, getTodayCompletionStatusForAI, toast, currentStreak]); // currentStreak dependency to refresh message on streak change


  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);
  
  // Debounce or throttle this if it fires too often due to rapid task toggling.
  // For now, it re-fetches when completion status or history effectively changes via currentStreak.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMessage();
    }, 1000); // Refetch message if streak changes, with a small delay
    return () => clearTimeout(timeoutId);
  }, [currentStreak, fetchMessage]);


  return (
    <Card className="shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Lightbulb className="w-6 h-6 mr-2 text-primary" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {isFetchingMessage || habitsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <Skeleton className="h-4 w-4/6 mx-auto" />
          </div>
        ) : (
          <p className="text-lg italic text-foreground/90 leading-relaxed">&quot;{message}&quot;</p>
        )}
      </CardContent>
    </Card>
  );
};
