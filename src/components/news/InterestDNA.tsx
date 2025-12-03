import { motion } from 'framer-motion';
import { Interest } from '@/types/news';
import { cn } from '@/lib/utils';

interface InterestDNAProps {
  interests: Interest[];
  compact?: boolean;
}

export function InterestDNA({ interests, compact = false }: InterestDNAProps) {
  const sortedInterests = [...interests].sort((a, b) => b.strength - a.strength);
  const maxStrength = Math.max(...interests.map((i) => i.strength));

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {sortedInterests.slice(0, 5).map((interest, index) => (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            <div
              className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all hover:scale-105"
              style={{
                backgroundColor: `${interest.color}10`,
                borderColor: `${interest.color}30`,
                color: interest.color,
              }}
            >
              {interest.name}
              <span className="ml-1.5 text-xs opacity-70">{interest.strength}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-2xl border border-border shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-4">Your Interest DNA</h3>
      
      {/* Visual Web */}
      <div className="relative h-48 mb-6">
        <svg className="w-full h-full" viewBox="0 0 200 150">
          {/* Connection lines */}
          {sortedInterests.map((interest, i) => {
            const angle = (i * 360) / sortedInterests.length;
            const radius = 50 * (interest.strength / maxStrength);
            const x = 100 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 75 + radius * Math.sin((angle * Math.PI) / 180);
            
            return (
              <motion.line
                key={`line-${interest.id}`}
                x1="100"
                y1="75"
                x2={x}
                y2={y}
                stroke={interest.color}
                strokeWidth="1"
                strokeOpacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            );
          })}
          
          {/* Center node */}
          <motion.circle
            cx="100"
            cy="75"
            r="8"
            className="fill-primary"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
          />
          
          {/* Interest nodes */}
          {sortedInterests.map((interest, i) => {
            const angle = (i * 360) / sortedInterests.length;
            const radius = 50 * (interest.strength / maxStrength);
            const x = 100 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 75 + radius * Math.sin((angle * Math.PI) / 180);
            const size = 4 + (interest.strength / maxStrength) * 6;
            
            return (
              <motion.g key={interest.id}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={interest.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4, delay: i * 0.08 }}
                />
                <text
                  x={x}
                  y={y + size + 12}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[8px] font-medium"
                >
                  {interest.name}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Interest List */}
      <div className="space-y-3">
        {sortedInterests.map((interest, index) => (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: interest.color }}
            />
            <span className="flex-1 text-sm font-medium text-foreground">{interest.name}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: interest.color }}
                initial={{ width: 0 }}
                animate={{ width: `${interest.strength}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-12 text-right">{interest.strength}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
