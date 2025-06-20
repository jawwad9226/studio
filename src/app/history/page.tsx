
'use client';

import { HistoryCalendar } from '@/components/HistoryCalendar';
import { useHabits } from '@/context/HabitContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function HistoryPage() {
  const { isLoading } = useHabits();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 rounded-lg" /> 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">Your Habit Journey</h1>
      <HistoryCalendar />
    </div>
  );
}
