import { motion, AnimatePresence } from 'framer-motion';
import { Sun, BookOpen, Headphones, Zap, ChevronDown } from 'lucide-react';
import { ContextMode } from '@/types/news';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ContextModeSwitcherProps {
  mode: ContextMode;
  onModeChange: (mode: ContextMode) => void;
}

const modes: { id: ContextMode; label: string; icon: React.ElementType; description: string; color: string }[] = [
  { id: 'morning', label: 'Morning Brief', icon: Sun, description: '5-min summary format', color: 'text-credibility-medium' },
  { id: 'deep', label: 'Deep Dive', icon: BookOpen, description: 'Long-form articles', color: 'text-primary' },
  { id: 'commute', label: 'Commute', icon: Headphones, description: 'Audio summaries', color: 'text-secondary' },
  { id: 'breaking', label: 'Breaking', icon: Zap, description: 'Urgent news only', color: 'text-accent' },
];

export function ContextModeSwitcher({ mode, onModeChange }: ContextModeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentMode = modes.find((m) => m.id === mode)!;
  const Icon = currentMode.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-card rounded-xl border border-border shadow-soft hover:shadow-card transition-all duration-200"
      >
        <div className={cn("p-1.5 rounded-lg bg-muted", currentMode.color)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">{currentMode.label}</p>
          <p className="text-xs text-muted-foreground">{currentMode.description}</p>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-64 bg-card rounded-xl border border-border shadow-elevated z-50 overflow-hidden"
            >
              {modes.map((m) => {
                const ModeIcon = m.icon;
                const isActive = m.id === mode;
                
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onModeChange(m.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                      isActive ? "bg-primary/5" : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn("p-1.5 rounded-lg bg-muted", m.color)}>
                      <ModeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-sm font-medium", isActive ? "text-primary" : "text-foreground")}>
                        {m.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
