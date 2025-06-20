
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Task, HabitLog, HabitContextType } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { calculateStreak as calculateStreakUtil, isDayComplete as isDayCompleteUtil, defaultTasks } from '@/lib/habitUtils';
import { getTodayDateString, formatDate } from '@/lib/dateUtils';
import { subDays } from 'date-fns';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = 'habitualStreak_tasks';
const HABITLOG_STORAGE_KEY = 'habitualStreak_habitLog';

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_STORAGE_KEY, defaultTasks);
  const [habitLog, setHabitLog] = useLocalStorage<HabitLog>(HABITLOG_STORAGE_KEY, {});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs once after the initial render and after
    // useLocalStorage has had a chance to load data from localStorage.
    setIsLoading(false);
  }, []); // Empty dependency array ensures this runs once on mount client-side

  useEffect(() => {
    if (!isLoading) {
      const today = getTodayDateString();
      setCurrentStreak(calculateStreakUtil(habitLog, tasks, today));
    }
  }, [habitLog, tasks, isLoading]);

  const addTask = useCallback((name: string, iconName: string) => {
    const newTask: Task = { id: Date.now().toString(), name, iconName };
    setTasks(prevTasks => [...(prevTasks || []), newTask]);
  }, [setTasks]);

  const updateTask = useCallback((id: string, name: string, iconName: string) => {
    setTasks(prevTasks => (prevTasks || []).map(task => task.id === id ? { ...task, name, iconName } : task));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => (prevTasks || []).filter(task => task.id !== id));
    // Optionally, remove task from habitLog history, or keep it for historical accuracy
  }, [setTasks]);

  const toggleTaskCompletion = useCallback((taskId: string, date: string) => {
    setHabitLog(prevLog => {
      const newLog = { ...prevLog };
      if (!newLog[date]) {
        newLog[date] = {};
      }
      newLog[date][taskId] = !newLog[date][taskId];
      return newLog;
    });
  }, [setHabitLog]);

  const getTaskCompletion = useCallback((taskId: string, date: string): boolean => {
    return !!habitLog?.[date]?.[taskId];
  }, [habitLog]);

  const isDayComplete = useCallback((date: string): boolean => {
    return isDayCompleteUtil(date, habitLog, tasks || []);
  }, [habitLog, tasks]);

  const getHistoricalDataForAI = useCallback((numberOfDays: number): boolean[][] => {
    if (isLoading || !tasks || tasks.length === 0) return [];
    const history: boolean[][] = [];
    const today = new Date();
    for (let i = 1; i <= numberOfDays; i++) {
      const date = subDays(today, i);
      const dateString = formatDate(date);
      const dayCompletion: boolean[] = tasks.map(task => getTaskCompletion(task.id, dateString));
      history.unshift(dayCompletion); // Add to beginning to keep chronological order for AI (oldest first)
    }
    return history;
  }, [tasks, getTaskCompletion, isLoading]);
  
  const getTodayCompletionStatusForAI = useCallback((): boolean[] => {
    if (isLoading || !tasks || tasks.length === 0) return [];
    const todayString = getTodayDateString();
    return tasks.map(task => getTaskCompletion(task.id, todayString));
  }, [tasks, getTaskCompletion, isLoading]);


  return (
    <HabitContext.Provider value={{ 
      tasks: tasks || [], 
      habitLog, 
      currentStreak, 
      addTask, 
      updateTask, 
      deleteTask, 
      toggleTaskCompletion, 
      getTaskCompletion,
      isDayComplete,
      isLoading,
      getHistoricalDataForAI,
      getTodayCompletionStatusForAI
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
