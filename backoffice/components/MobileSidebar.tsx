'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sidebar, NavigationView } from './Sidebar';
import { cn } from '@/lib/utils';

interface MobileSidebarProps {
  activeView: NavigationView;
  onNavigate: (view: NavigationView) => void;
}

export function MobileSidebar({ activeView, onNavigate }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (view: NavigationView) => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <h2 className="font-semibold text-foreground">Panel Administrativo</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden',
              isOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <Sidebar activeView={activeView} onNavigate={handleNavigate} />
          </div>
        </>
      )}
    </>
  );
}
