'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, History, Settings } from 'lucide-react';
import { ManageHabitsModal } from './ManageHabitsModal';
import { useState } from 'react';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-headline hover:opacity-90 transition-opacity">
          Habitual Streak
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Link href="/">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 px-2 sm:px-3">
              <Home className="h-5 w-5 sm:mr-2" /> <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 px-2 sm:px-3">
              <History className="h-5 w-5 sm:mr-2" /> <span className="hidden sm:inline">History</span>
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => setIsModalOpen(true)} className="text-primary-foreground hover:bg-primary/80 px-2 sm:px-3">
            <Settings className="h-5 w-5 sm:mr-2" /> <span className="hidden sm:inline">Manage Habits</span>
          </Button>
        </nav>
      </div>
      <ManageHabitsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}
