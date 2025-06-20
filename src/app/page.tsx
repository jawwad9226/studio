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
        {/* Skeleton for HabitList */}
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakDisplay />
        <MotivationalMessageCard />
      </div>
      <HabitList />
    </div>
  );
}
