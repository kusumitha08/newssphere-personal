import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioBase64: string | null;
  title: string;
  summary: string;
  isLoading: boolean;
  onClose: () => void;
}

export function AudioPlayer({ audioBase64, title, summary, isLoading, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioBase64) {
      const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
      audioRef.current = audio;
      
      audio.addEventListener('timeupdate', () => {
        setProgress((audio.currentTime / audio.duration) * 100);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });

      // Auto-play when audio is ready
      audio.play().then(() => setIsPlaying(true)).catch(console.error);

      return () => {
        audio.pause();
        audio.remove();
      };
    }
  }, [audioBase64]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50"
      >
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <motion.div 
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-4 py-3 flex items-center gap-4">
          {/* Play/Pause button */}
          <button
            onClick={togglePlayPause}
            disabled={isLoading || !audioBase64}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              isLoading ? "bg-muted" : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          {/* Article info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Volume2 className="w-4 h-4 text-secondary" />
              <span className="text-xs font-medium text-secondary uppercase tracking-wide">
                {isLoading ? 'Generating audio...' : 'Audio Summary'}
              </span>
            </div>
            <h4 className="text-sm font-medium text-foreground truncate">{title}</h4>
            <p className="text-xs text-muted-foreground truncate">{summary}</p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
