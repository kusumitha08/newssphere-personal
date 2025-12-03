import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, TrendingUp, Bookmark, Share2, ExternalLink, Calendar, User, CheckCircle, AlertCircle, MinusCircle, Zap } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ArticleDetailProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
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

export function ArticleDetail({ article, isOpen, onClose, onSave, onShare }: ArticleDetailProps) {
  if (!article) return null;

  const SentimentIcon = sentimentConfig[article.sentiment].icon;

  const getCredibilityColor = (score: number) => {
    if (score >= 85) return 'text-credibility-high';
    if (score >= 70) return 'text-credibility-medium';
    return 'text-credibility-low';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-card rounded-2xl shadow-elevated z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-4">
                <div className={cn("flex items-center gap-1 text-sm font-medium", getCredibilityColor(article.credibilityScore))}>
                  <TrendingUp className="w-4 h-4" />
                  {article.credibilityScore}% Credibility
                </div>
                <Badge variant="outline" className={cn("text-xs", sentimentConfig[article.sentiment].className)}>
                  <SentimentIcon className="w-3 h-3 mr-1" />
                  {sentimentConfig[article.sentiment].label}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="iconSm" onClick={() => onSave?.(article.id)}>
                  <Bookmark className={cn("w-4 h-4", article.isSaved && "fill-current text-accent")} />
                </Button>
                <Button variant="ghost" size="iconSm" onClick={() => onShare?.(article.id)}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="iconSm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Hero Image */}
              {article.imageUrl && (
                <div className="relative h-64 md:h-80 lg:h-96">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                </div>
              )}

              <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">{article.source}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(article.publishedAt)}
                  </span>
                  {(article as any).author && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {(article as any).author}
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className={cn("text-xs", complexityColors[article.complexity])}>
                    {article.complexity.charAt(0).toUpperCase() + article.complexity.slice(1)} Level
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-border">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.readTimeMinutes} min read
                  </Badge>
                  {article.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>

                {/* Summary */}
                <div className="mb-8 p-4 bg-muted/30 rounded-xl border border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Summary</p>
                  <p className="text-foreground font-serif text-lg leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground font-serif leading-relaxed text-base md:text-lg">
                    {(article as any).content || article.summary}
                  </p>
                  
                  {/* Placeholder for more content */}
                  <p className="text-muted-foreground font-serif leading-relaxed text-base md:text-lg mt-6">
                    This article provides comprehensive coverage of the topic. The full content is available at the original source.
                  </p>
                </div>

                {/* Match reason */}
                {article.matchReason && (
                  <div className="mt-8 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                    <p className="text-sm text-secondary font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      {article.matchReason}
                    </p>
                  </div>
                )}

                {/* Read Full Article CTA */}
                {(article as any).url && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={() => window.open((article as any).url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Full Article at {article.source}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
