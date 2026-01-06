import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { NewsArticle, ReadingStats } from '@/types/news';

export interface ReadingHistoryItem {
  id: string;
  article_id: string;
  article_title: string;
  article_source: string | null;
  article_category: string | null;
  article_image_url: string | null;
  read_time_minutes: number;
  read_at: string;
}

export function useReadingHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('reading_history')
        .select('*')
        .eq('user_id', user.id)
        .gte('read_at', oneWeekAgo.toISOString())
        .order('read_at', { ascending: false });

      if (error) throw error;

      setHistory(data || []);

      // Calculate stats
      if (data && data.length > 0) {
        const totalReadTime = data.reduce((sum, item) => sum + (item.read_time_minutes || 0), 0);
        const avgReadTime = totalReadTime / data.length;

        // Count categories
        const categoryCount: Record<string, number> = {};
        data.forEach(item => {
          const cat = item.article_category || 'general';
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });

        const topCategories = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([cat]) => cat.charAt(0).toUpperCase() + cat.slice(1));

        // Mock sentiment breakdown based on articles read
        // In a real app, this would come from article data
        const total = data.length;
        setStats({
          articlesReadThisWeek: data.length,
          averageReadTime: avgReadTime,
          topCategories,
          sentimentBreakdown: {
            positive: Math.round((total * 0.35)),
            negative: Math.round((total * 0.15)),
            neutral: Math.round((total * 0.4)),
            controversial: Math.round((total * 0.1)),
          },
        });
      } else {
        setStats({
          articlesReadThisWeek: 0,
          averageReadTime: 0,
          topCategories: [],
          sentimentBreakdown: {
            positive: 0,
            negative: 0,
            neutral: 0,
            controversial: 0,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching reading history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const trackArticleRead = useCallback(async (article: NewsArticle) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('reading_history')
        .upsert({
          user_id: user.id,
          article_id: article.id,
          article_title: article.title,
          article_source: article.source,
          article_category: article.category,
          article_image_url: article.imageUrl || null,
          read_time_minutes: article.readTimeMinutes,
          read_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,article_id',
        });

      if (error) throw error;

      // Refresh history after tracking
      await fetchHistory();
    } catch (error) {
      console.error('Error tracking article read:', error);
    }
  }, [user, fetchHistory]);

  const clearHistory = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('reading_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setHistory([]);
      setStats(null);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
      setStats(null);
    }
  }, [user, fetchHistory]);

  return {
    history,
    stats,
    isLoading,
    trackArticleRead,
    clearHistory,
    refreshHistory: fetchHistory,
  };
}
