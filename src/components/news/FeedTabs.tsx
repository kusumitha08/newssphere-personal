import { motion } from 'framer-motion';
import { Sparkles, User, Compass, Bell } from 'lucide-react';
import { FeedTab } from '@/types/news';
import { cn } from '@/lib/utils';

interface FeedTabsProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

const tabs: { id: FeedTab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'essential', label: 'Essential', icon: Sparkles, description: 'Must-know news' },
  { id: 'forYou', label: 'For You', icon: User, description: 'Personalized' },
  { id: 'explore', label: 'Explore', icon: Compass, description: 'Discover new' },
  { id: 'following', label: 'Following', icon: Bell, description: 'Your topics' },
];

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-lg shadow-soft"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
