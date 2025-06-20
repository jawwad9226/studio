
'use client';

import React, { useState, useEffect } from 'react';
import { useHabits } from '@/context/HabitContext';
import type { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Pencil, Trash2, PlusCircle, Save } from 'lucide-react';
import LucideIconRenderer from './icons/LucideIconRenderer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const availableIcons = [
  "Activity", "Anchor", "Award", "Atom", "Bike", "BookOpenCheck", "Brain", "Briefcase", "Brush",
  "CalendarCheck", "Camera", "CheckCircle2", "ClipboardCheck", "CloudSun", "Code2", "Coffee",
  "Contact", "Crosshair", "DollarSign", "Dumbbell", "Edit3", "Feather", "Flag", "Gift", "Globe",
  "Grab", "Grid", "Guitar", "Headphones", "Heart", "HelpCircle", "Home", "Image", "IterationCw",
  "Languages", "Laptop2", "Leaf", "Library", "Lightbulb", "Link", "ListChecks", "Lock", "MapPin",
  "Medal", "Mic2", "MoonStar", "MousePointer2", "Move", "Music2", "Palette", "Paperclip", "PenTool",
  "Percent", "PersonStanding", "Phone", "PieChart", "PiggyBank", "Pilcrow", "Plane", "PlayCircle",
  "Podcast", "Presentation", "Printer", "Puzzle", "Quote", "Repeat", "Rocket", "Save", "Scale",
  "Scissors", "ScreenShare", "Send", "Settings2", "Share2", "Sheet", "ShieldCheck", "ShoppingBag",
  "Smile", "Sparkles", "Speaker", "Star", "StickyNote", "Sun", "Sunrise", "Sunset", "Target",
  "Tent", "Terminal", "ThumbsUp", "Timer", "ToggleRight", "Trash2", "TrendingUp", "Trophy",
  "Umbrella", "Users2", "Video", "Wallet2", "Watch", "Wifi", "Wind", "Wrench", "Zap"
];

interface ManageHabitsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageHabitsModal: React.FC<ManageHabitsModalProps> = ({ isOpen, onClose }) => {
  const { tasks, addTask, updateTask, deleteTask } = useHabits();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskIcon, setNewTaskIcon] = useState(availableIcons[0]);

  useEffect(() => {
    if (isOpen) {
      setNewTaskName('');
      setNewTaskIcon(availableIcons[0]);
      setEditingTask(null);
    }
  }, [isOpen]);

  const handleAddTask = () => {
    if (newTaskName.trim() === '') return;
    addTask(newTaskName, newTaskIcon);
    setNewTaskName('');
    setNewTaskIcon(availableIcons[0]);
  };

  const handleUpdateTask = () => {
    if (editingTask && editingTask.name.trim() !== '') {
      updateTask(editingTask.id, editingTask.name, editingTask.iconName);
      setEditingTask(null);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask({ ...task });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-card text-card-foreground flex flex-col max-h-[85vh]">
        <DialogHeader className="px-6 pt-6 shrink-0">
          <DialogTitle className="font-headline text-xl sm:text-2xl">Manage Habits</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-4 border-b shrink-0">
          <h3 className="text-lg font-semibold mb-2 font-headline">Add New Habit</h3>
          <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex-grow">
              <Label htmlFor="new-task-name" className="text-sm">Habit Name</Label>
              <Input
                id="new-task-name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="e.g., Morning Exercise"
                className="bg-background text-base sm:text-sm"
              />
            </div>
            <div className="w-full sm:w-auto sm:min-w-[160px]">
              <Label htmlFor="new-task-icon" className="text-sm">Icon</Label>
                <Select value={newTaskIcon} onValueChange={setNewTaskIcon}>
                <SelectTrigger className="w-full bg-background text-base sm:text-sm">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                  {availableIcons.map(icon => (
                    <SelectItem key={icon} value={icon} className="text-sm">
                      <div className="flex items-center">
                        <LucideIconRenderer name={icon} className="w-4 h-4 mr-2" />
                        {icon}
                      </div>
                    </SelectItem>
                  ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddTask} size="icon" aria-label="Add habit" className="bg-primary hover:bg-primary/90 shrink-0 self-end sm:self-auto h-10 w-10">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* "Current Habits" title section - fixed */}
        <div className="px-6 pt-2 pb-2 shrink-0"> {/* Reduced pt-4 to pt-2 */}
          <h3 className="text-lg font-semibold font-headline">Current Habits</h3>
        </div>

        {/* Scrollable habit list container */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-4">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={cn(
                  "p-3 rounded-md border bg-background/80 shadow-sm flex items-center justify-between",
                  "hover:shadow-md transition-shadow duration-200"
                )}
              >
                {editingTask && editingTask.id === task.id ? (
                  <div className="space-y-2 flex-grow">
                    <Input
                      value={editingTask.name}
                      onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                      className="bg-background text-base sm:text-sm"
                    />
                    <Select value={editingTask.iconName} onValueChange={(value) => setEditingTask({...editingTask, iconName: value })}>
                      <SelectTrigger className="w-full bg-background text-base sm:text-sm">
                          <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-[200px]">
                        {availableIcons.map(icon => (
                          <SelectItem key={icon} value={icon} className="text-sm">
                            <div className="flex items-center">
                              <LucideIconRenderer name={icon} className="w-4 h-4 mr-2" />
                              {icon}
                            </div>
                          </SelectItem>
                        ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <div className="flex justify-end space-x-2">
                      <Button onClick={handleUpdateTask} size="sm" className="bg-primary hover:bg-primary/90 text-sm">
                        <Save className="w-4 h-4 mr-1" /> Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingTask(null)} className="text-sm">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3 flex-grow">
                      <LucideIconRenderer name={task.iconName} className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                      <span className="text-base sm:text-lg">{task.name}</span>
                    </div>
                    <div className="space-x-1 sm:space-x-2 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(task)} aria-label={`Edit ${task.name}`} className="h-8 w-8 sm:h-9 sm:w-9">
                        <Pencil className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.name}`} className="h-8 w-8 sm:h-9 sm:w-9">
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-muted-foreground py-4 text-sm sm:text-base">No habits added yet.</p>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t shrink-0">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} className="text-sm sm:text-base">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

