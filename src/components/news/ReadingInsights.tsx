import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { ReadingStats } from '@/types/news';
import { cn } from '@/lib/utils';

interface ReadingInsightsProps {
  stats: ReadingStats;
}

export function ReadingInsights({ stats }: ReadingInsightsProps) {
  const totalSentiment = Object.values(stats.sentimentBreakdown).reduce((a, b) => a + b, 0);
  const negativePct = Math.round((stats.sentimentBreakdown.negative / totalSentiment) * 100);
  const showBurnoutWarning = negativePct > 30;

  return (
    <div className="p-6 bg-card rounded-2xl border border-border shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-4">This Week's Insights</h3>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-muted/50 rounded-xl"
        >
          <BookOpen className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.articlesReadThisWeek}</p>
          <p className="text-sm text-muted-foreground">Articles read</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-muted/50 rounded-xl"
        >
          <Clock className="w-5 h-5 text-secondary mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.averageReadTime.toFixed(1)}m</p>
          <p className="text-sm text-muted-foreground">Avg. read time</p>
        </motion.div>
      </div>

      {/* Top Categories */}
      <div className="mb-6">
        <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Top Categories
        </p>
        <div className="flex flex-wrap gap-2">
          {stats.topCategories.map((category, index) => (
            <motion.span
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {category}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Sentiment Breakdown */}
      <div className="mb-4">
        <p className="text-sm font-medium text-foreground mb-3">Sentiment Breakdown</p>
        <div className="flex h-3 rounded-full overflow-hidden bg-muted">
          <motion.div
            className="bg-news-positive"
            initial={{ width: 0 }}
            animate={{ width: `${stats.sentimentBreakdown.positive}%` }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="bg-news-neutral"
            initial={{ width: 0 }}
            animate={{ width: `${stats.sentimentBreakdown.neutral}%` }}
            transition={{ duration: 0.8, delay: 0.1 }}
          />
          <motion.div
            className="bg-news-controversial"
            initial={{ width: 0 }}
            animate={{ width: `${stats.sentimentBreakdown.controversial}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.div
            className="bg-news-negative"
            initial={{ width: 0 }}
            animate={{ width: `${stats.sentimentBreakdown.negative}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-news-positive" /> Positive
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-news-neutral" /> Neutral
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-news-negative" /> Negative
          </span>
        </div>
      </div>

      {/* Burnout Warning */}
      {showBurnoutWarning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-accent/10 border border-accent/20 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Consider a news break</p>
              <p className="text-xs text-muted-foreground mt-1">
                {negativePct}% of your reading has been negative content. Taking breaks can help maintain a healthier perspective.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
