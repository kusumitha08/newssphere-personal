import { motion } from 'framer-motion';
import { Search, Bell, Settings, Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  onSearchClick?: () => void;
}

export function Header({ onMenuClick, onSettingsClick, onSearchClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 glass-strong border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <motion.div
                className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground tracking-tight">NewsSphere</h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">News That Grows With You</p>
              </div>
            </div>
          </div>

          {/* Center: Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              onClick={onSearchClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-muted/50 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search news, topics, sources...</span>
              <kbd className="ml-auto text-xs bg-background px-2 py-0.5 rounded border border-border">⌘K</kbd>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onSearchClick}>
              <Search className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={onSettingsClick}>
              <Settings className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="ml-2">
              <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-medium text-sm">
                JS
              </div>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
