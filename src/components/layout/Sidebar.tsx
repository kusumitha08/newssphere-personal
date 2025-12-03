import { motion } from 'framer-motion';
import { Home, Bookmark, TrendingUp, Clock, Newspaper, Settings, HelpCircle, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

const navItems = [
  { id: 'feed', label: 'My Feed', icon: Home },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'history', label: 'History', icon: Clock },
];

const categories = [
  'Technology', 'Politics', 'Finance', 'Science', 'Health', 'Sports'
];

export function Sidebar({ isOpen, onClose, activePage = 'feed', onNavigate }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-50",
          "lg:translate-x-0 lg:static lg:z-auto"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border lg:hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sidebar-foreground">NewsSphere</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate?.(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Categories */}
            <div className="mt-8">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Categories
              </p>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                  >
                    <Newspaper className="w-4 h-4 text-muted-foreground" />
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
                <HelpCircle className="w-4 h-4" />
                Help & Feedback
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
