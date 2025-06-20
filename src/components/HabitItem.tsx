
'use client';

import React from 'react';
import type { Task } from '@/types';
import { useHabits } from '@/context/HabitContext';
import { Checkbox } from '@/components/ui/checkbox';
import LucideIconRenderer from './icons/LucideIconRenderer';
import { cn } from '@/lib/utils';

interface HabitItemProps {
  task: Task;
  date: string;
}

export const HabitItem: React.FC<HabitItemProps> = ({ task, date }) => {
  const { getTaskCompletion, toggleTaskCompletion } = useHabits();
  const isCompleted = getTaskCompletion(task.id, date);

  const handleToggle = () => {
    toggleTaskCompletion(task.id, date);
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-3 sm:p-4 rounded-lg border shadow-sm transition-all duration-300 ease-in-out",
      isCompleted ? "bg-accent/20 border-accent" : "bg-card hover:shadow-md"
    )}>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <LucideIconRenderer 
          name={task.iconName} 
          className={cn(
            "w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300",
            isCompleted ? "text-accent" : "text-primary"
          )} 
        />
        <label
          htmlFor={`task-${task.id}-${date}`}
          className={cn(
            "text-base sm:text-lg transition-all duration-300",
            isCompleted ? "line-through text-muted-foreground" : "text-card-foreground"
          )}
        >
          {task.name}
        </label>
      </div>
      <Checkbox
        id={`task-${task.id}-${date}`}
        checked={isCompleted}
        onCheckedChange={handleToggle}
        className={cn(
          "w-5 h-5 sm:w-6 sm:h-6 rounded transition-all duration-300 ease-in-out data-[state=checked]:bg-accent data-[state=checked]:border-accent border-2",
          isCompleted ? "border-accent" : "border-primary/50"
        )}
        aria-label={`Mark ${task.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
      />
    </div>
  );
};
