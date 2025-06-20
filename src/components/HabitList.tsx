
'use client';

import React from 'react';
import { useHabits } from '@/context/HabitContext';
import { HabitItem } from './HabitItem';
import { getTodayDateString, getFormattedDate } from '@/lib/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const HabitList: React.FC = () => {
  const { tasks, isLoading } = useHabits();
  const today = getTodayDateString();

  if (isLoading) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl sm:text-2xl">
             <Skeleton className="h-8 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="w-6 h-6 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl sm:text-2xl">Today&apos;s Habits - {getFormattedDate(today)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No habits configured yet. Click &quot;Manage Habits&quot; to add some!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-headline text-xl sm:text-2xl">Today&apos;s Habits - <span className="text-primary">{getFormattedDate(today)}</span></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <HabitItem key={task.id} task={task} date={today} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
