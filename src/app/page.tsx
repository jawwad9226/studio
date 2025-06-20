
'use client';

import { HabitList } from '@/components/HabitList';
import { StreakDisplay } from '@/components/StreakDisplay';
import { MotivationalMessageCard } from '@/components/MotivationalMessageCard';
import { useHabits } from '@/context/HabitContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { isLoading } = useHabits();

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Skeleton for StreakDisplay and MotivationalMessageCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
         {/* Skeleton for "SJAM Creates" */}
        <Skeleton className="h-6 w-32 mx-auto rounded-lg" />
        {/* Skeleton for HabitList */}
        <Skeleton className="h-96 w-full rounded-lg" />
         {/* Skeleton for "SJAM Creates" */}
        <Skeleton className="h-6 w-32 mx-auto rounded-lg mt-8" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakDisplay />
        <MotivationalMessageCard />
      </div>
      <p className="text-center text-xs text-muted-foreground">SJAM Creates</p>
      <HabitList />
      <p className="text-center text-xs text-muted-foreground mt-4 pb-4">SJAM Creates</p>
    </div>
  );
}
