import type { Task, HabitLog } from '@/types';
import { subDays, format, parseISO } from 'date-fns';

export const calculateStreak = (habitLog: HabitLog, tasks: Task[], today: string): number => {
  if (tasks.length === 0) return 0;

  let streak = 0;
  let currentDate = parseISO(today);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    const dayLog = habitLog[dateString];

    if (!dayLog) {
      // If it's not today and no log, streak broken
      if (dateString !== today) break;
      // If it's today and no log, check if any task is defined (meaning it should be tracked)
      // If tasks exist but no log for today, streak is 0 unless it's a fresh start.
      // This logic is tricky: if today has no entries yet, streak depends on yesterday.
      // The check below handles if all tasks were completed.
      // If dayLog is undefined for today, means no tasks are checked yet.
      // So, if it's today and tasks are uncompleted, streak from yesterday might be broken.
      // This specific check is handled by `isDayComplete`.
      // Let's assume if a day has no entries for any tasks, it's incomplete.
      if (tasks.some(task => dayLog?.[task.id] === undefined)) {
         break;
      }
    }
    
    let allTasksCompleted = true;
    for (const task of tasks) {
      if (!dayLog?.[task.id]) {
        allTasksCompleted = false;
        break;
      }
    }

    if (allTasksCompleted) {
      streak++;
    } else {
      // If it's today and tasks are not complete, don't count today, streak ends here.
      // If it's a past day and not complete, streak ends here.
      break;
    }
    currentDate = subDays(currentDate, 1);
  }
  return streak;
};

export const isDayComplete = (dateString: string, habitLog: HabitLog, tasks: Task[]): boolean => {
  if (tasks.length === 0) return true; // No tasks to complete
  const dayLog = habitLog[dateString];
  if (!dayLog) return false; // No logs for this day

  for (const task of tasks) {
    if (!dayLog[task.id]) {
      return false; // At least one task not completed
    }
  }
  return true; // All tasks completed
};

export const defaultTasks: Task[] = [
  { id: 'wakeup', name: 'Wake up', iconName: 'Sunrise' },
  { id: 'fajr', name: 'Pray Fajr', iconName: 'Sunrise' }, // Consider custom icon later if possible
  { id: 'zohar', name: 'Pray Zohar', iconName: 'Sun' },
  { id: 'asr', name: 'Pray Asr', iconName: 'CloudSun' },
  { id: 'maghrib', name: 'Pray Maghrib', iconName: 'Sunset' },
  { id: 'isha', name: 'Pray Isha', iconName: 'MoonStar' },
  { id: 'quran', name: 'Read Quran', iconName: 'BookOpenCheck' },
  { id: 'book', name: 'Read other book', iconName: 'Library' },
  { id: 'lecture', name: 'Attend daily lecture', iconName: 'Presentation' },
];
