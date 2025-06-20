'use client';

import React, { useState, useMemo } from 'react';
import { useHabits } from '@/context/HabitContext';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import LucideIconRenderer from './icons/LucideIconRenderer';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

export const HistoryCalendar: React.FC = () => {
  const { tasks, habitLog, isDayComplete, isLoading: habitsLoading, getTaskCompletion } = useHabits();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const selectedDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  const completedTasksForSelectedDate = useMemo(() => {
    if (!selectedDateString || tasks.length === 0) return [];
    return tasks.filter(task => getTaskCompletion(task.id, selectedDateString));
  }, [selectedDateString, tasks, getTaskCompletion]);

  const incompleteTasksForSelectedDate = useMemo(() => {
    if (!selectedDateString || tasks.length === 0) return [];
    return tasks.filter(task => !getTaskCompletion(task.id, selectedDateString));
  }, [selectedDateString, tasks, getTaskCompletion]);
  
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const dayCompletionModifiers = useMemo(() => {
    const modifiers: Record<string, boolean> = {};
    if (tasks.length > 0) {
      daysInMonth.forEach(day => {
        const dateString = format(day, 'yyyy-MM-dd');
        modifiers[dateString] = isDayComplete(dateString);
      });
    }
    return modifiers;
  }, [daysInMonth, isDayComplete, tasks.length]);

  if (habitsLoading) {
    return (
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="md:col-span-2 h-[400px] rounded-lg" />
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 shadow-lg backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Habit History Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border"
            modifiers={{
              completed: (date) => dayCompletionModifiers[format(date, 'yyyy-MM-dd')] === true && tasks.length > 0,
              incomplete: (date) => dayCompletionModifiers[format(date, 'yyyy-MM-dd')] === false && tasks.length > 0,
            }}
            modifiersClassNames={{
              completed: 'bg-accent/30 text-accent-foreground rounded-full',
              incomplete: 'bg-destructive/20 text-destructive-foreground rounded-full opacity-70',
            }}
            
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-xl">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateString && tasks.length > 0 ? (
            <ScrollArea className="h-[280px]">
              {isDayComplete(selectedDateString) && (
                 <Badge variant="default" className="mb-3 bg-accent text-accent-foreground">All habits completed!</Badge>
              )}
              {!isDayComplete(selectedDateString) && habitLog[selectedDateString] && (
                 <Badge variant="destructive" className="mb-3">Not all habits completed</Badge>
              )}
              {!habitLog[selectedDateString] && (
                <p className="text-muted-foreground">No habits tracked for this day.</p>
              )}

              {habitLog[selectedDateString] && (
                <>
                  {completedTasksForSelectedDate.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-primary mb-2">Completed:</h4>
                      <ul className="space-y-1.5">
                        {completedTasksForSelectedDate.map(task => (
                          <li key={task.id} className="flex items-center text-sm text-foreground">
                            <LucideIconRenderer name={task.iconName} className="w-4 h-4 mr-2 text-accent" />
                            {task.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {incompleteTasksForSelectedDate.length > 0 && (
                     <div>
                      <h4 className="font-semibold text-destructive mb-2">Incomplete:</h4>
                      <ul className="space-y-1.5">
                        {incompleteTasksForSelectedDate.map(task => (
                          <li key={task.id} className="flex items-center text-sm text-muted-foreground">
                            <LucideIconRenderer name={task.iconName} className="w-4 h-4 mr-2 text-muted-foreground" />
                            {task.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </ScrollArea>
          ) : tasks.length === 0 ? (
             <p className="text-muted-foreground">No habits configured.</p>
          ) : (
            <p className="text-muted-foreground">Select a date to see details.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
