export interface Task {
  id: string;
  name: string;
  iconName: string; // Lucide icon name
}

// Stores completion status for tasks on a specific date
// Outer key: date string (YYYY-MM-DD)
// Inner key: taskId
// Value: boolean (completed or not)
export type HabitLog = Record<string, Record<string, boolean>>;

export interface HabitContextType {
  tasks: Task[];
  habitLog: HabitLog;
  currentStreak: number;
  addTask: (name: string, iconName: string) => void;
  updateTask: (id: string, name: string, iconName: string) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (taskId: string, date: string) => void;
  getTaskCompletion: (taskId: string, date: string) => boolean;
  isDayComplete: (date: string) => boolean;
  isLoading: boolean;
  getHistoricalDataForAI: (numberOfDays: number) => boolean[][];
  getTodayCompletionStatusForAI: () => boolean[];
}
