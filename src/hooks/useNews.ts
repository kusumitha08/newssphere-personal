import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/news';
import { toast } from '@/hooks/use-toast';

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const fetchNews = useCallback(async ({
    query,
    category,
    page = 1,
    pageSize = 20,
  }: {
    query?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  } = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching news with params:', { query, category, page, pageSize });
      
      const { data, error: fnError } = await supabase.functions.invoke('fetch-news', {
        body: { query, category, page, pageSize },
      });

      console.log('Response from fetch-news:', { data, fnError });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const transformedArticles: NewsArticle[] = (data?.articles || []).map((article: any) => ({
        ...article,
        publishedAt: new Date(article.publishedAt),
        matchReason: query 
          ? `Matches your search "${query}"` 
          : category && category !== 'all'
            ? `Top ${category} news`
            : 'Top headlines for you',
      }));

      console.log('Transformed articles:', transformedArticles.length);
      
      setArticles(transformedArticles);
      setTotalResults(data?.totalResults || 0);
      
      return transformedArticles;
    } catch (err) {
      console.error('Error fetching news:', err);
      const message = err instanceof Error ? err.message : 'Failed to fetch news';
      setError(message);
      toast({
        title: 'Error fetching news',
        description: message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchNews = useCallback(async (query: string) => {
    if (!query.trim()) {
      return fetchNews({});
    }
    return fetchNews({ query });
  }, [fetchNews]);

  const filterByCategory = useCallback(async (category: string) => {
    return fetchNews({ category: category === 'all' ? undefined : category });
  }, [fetchNews]);

  // Initial fetch on mount
  useEffect(() => {
    fetchNews({});
  }, []);

  return {
    articles,
    isLoading,
    error,
    totalResults,
    fetchNews,
    searchNews,
    filterByCategory,
  };
}
