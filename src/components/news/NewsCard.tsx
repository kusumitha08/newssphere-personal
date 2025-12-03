import { motion } from 'framer-motion';
import { Clock, TrendingUp, Bookmark, Share2, AlertCircle, CheckCircle, MinusCircle, Zap } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NewsCardProps {
  article: NewsArticle;
  index?: number;
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (article: NewsArticle) => void;
}

const sentimentConfig = {
  positive: { icon: CheckCircle, label: 'Positive', className: 'bg-news-positive/10 text-news-positive border-news-positive/20' },
  negative: { icon: AlertCircle, label: 'Negative', className: 'bg-news-negative/10 text-news-negative border-news-negative/20' },
  neutral: { icon: MinusCircle, label: 'Neutral', className: 'bg-news-neutral/10 text-news-neutral border-news-neutral/20' },
  controversial: { icon: Zap, label: 'Controversial', className: 'bg-news-controversial/10 text-news-controversial border-news-controversial/20' },
};

const complexityColors = {
  beginner: 'bg-credibility-high/10 text-credibility-high',
  intermediate: 'bg-credibility-medium/10 text-credibility-medium',
  expert: 'bg-accent/10 text-accent',
};

export function NewsCard({ article, index = 0, onSave, onShare, onClick }: NewsCardProps) {
  const SentimentIcon = sentimentConfig[article.sentiment].icon;
  
  const getCredibilityColor = (score: number) => {
    if (score >= 85) return 'text-credibility-high';
    if (score >= 70) return 'text-credibility-medium';
    return 'text-credibility-low';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={() => onClick?.(article)}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 cursor-pointer"
    >
      {article.isBreaking && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="destructive" className="bg-accent text-accent-foreground animate-pulse-soft">
            <Zap className="w-3 h-3 mr-1" />
            Breaking
          </Badge>
        </div>
      )}
      
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>
      )}
      
      <div className="p-5">
        {/* Header with source and time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary">{article.source}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{formatTime(article.publishedAt)}</span>
          </div>
          <div className={cn("flex items-center gap-1 text-sm font-medium", getCredibilityColor(article.credibilityScore))}>
            <TrendingUp className="w-3.5 h-3.5" />
            {article.credibilityScore}%
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-serif">
          {article.summary}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={cn("text-xs", sentimentConfig[article.sentiment].className)}>
            <SentimentIcon className="w-3 h-3 mr-1" />
            {sentimentConfig[article.sentiment].label}
          </Badge>
          <Badge variant="outline" className={cn("text-xs", complexityColors[article.complexity])}>
            {article.complexity.charAt(0).toUpperCase() + article.complexity.slice(1)}
          </Badge>
          <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-border">
            <Clock className="w-3 h-3 mr-1" />
            {article.readTimeMinutes} min
          </Badge>
        </div>

        {/* Match reason */}
        {article.matchReason && (
          <p className="text-xs text-secondary font-medium mb-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            {article.matchReason}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex gap-1">
            {article.topics.slice(0, 2).map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs bg-muted text-muted-foreground">
                {topic}
              </Badge>
            ))}
          </div>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => onSave?.(article.id)}
              className={cn(article.isSaved && "text-accent")}
            >
              <Bookmark className={cn("w-4 h-4", article.isSaved && "fill-current")} />
            </Button>
            <Button variant="ghost" size="iconSm" onClick={() => onShare?.(article.id)}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
