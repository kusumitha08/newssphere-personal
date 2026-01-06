import { motion } from 'framer-motion';
import { Clock, ExternalLink, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReadingHistoryItem } from '@/hooks/useReadingHistory';
import { formatDistanceToNow } from 'date-fns';

interface ReadingHistoryProps {
  history: ReadingHistoryItem[];
  onClear: () => void;
  isLoading?: boolean;
}

export function ReadingHistory({ history, onClear, isLoading }: ReadingHistoryProps) {
  if (isLoading) {
    return (
      <div className="p-6 bg-card rounded-2xl border border-border shadow-soft">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-6 bg-card rounded-2xl border border-border shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Reading History
        </h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            No articles read this week yet.
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Start reading to track your habits!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-2xl border border-border shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Reading History
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <ScrollArea className="h-[300px] pr-2">
        <div className="space-y-3">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="flex gap-3">
                {item.article_image_url && (
                  <img
                    src={item.article_image_url}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {item.article_title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    {item.article_source && (
                      <span>{item.article_source}</span>
                    )}
                    {item.article_category && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {item.article_category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(item.read_at), { addSuffix: true })}</span>
                    {item.read_time_minutes > 0 && (
                      <span>• {item.read_time_minutes} min read</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
