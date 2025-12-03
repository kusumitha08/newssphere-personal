import { motion } from 'framer-motion';

export function NewsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-2xl overflow-hidden border border-border/50"
    >
      {/* Image skeleton */}
      <div className="h-48 bg-muted animate-pulse" />
      
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 w-full bg-muted rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-muted rounded-md animate-pulse" />
          <div className="h-6 w-24 bg-muted rounded-md animate-pulse" />
          <div className="h-6 w-16 bg-muted rounded-md animate-pulse" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            <div className="h-6 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function NewsSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <NewsSkeleton key={i} />
      ))}
    </div>
  );
}
