import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NEWSAPI_KEY = Deno.env.get('NEWSAPI_KEY');
    if (!NEWSAPI_KEY) {
      throw new Error('NEWSAPI_KEY is not configured');
    }

    const { query, category, countries = ['us', 'in'], pageSize = 20, page = 1 } = await req.json();
    
    let allArticles: NewsAPIArticle[] = [];
    
    if (query) {
      // Search endpoint - search across all languages
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt`;
      console.log('Fetching search results from:', url);
      
      const response = await fetch(url, {
        headers: { 'X-Api-Key': NEWSAPI_KEY },
      });
      
      if (response.ok) {
        const data = await response.json();
        allArticles = data.articles || [];
      }
    } else {
      // Fetch top headlines from multiple countries (US and India)
      const countryList = Array.isArray(countries) ? countries : ['us', 'in'];
      const articlesPerCountry = Math.ceil(pageSize / countryList.length);
      
      const fetchPromises = countryList.map(async (country: string) => {
        let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=${articlesPerCountry}&page=${page}`;
        if (category && category !== 'all') {
          url += `&category=${category}`;
        }
        console.log(`Fetching news from ${country}:`, url);
        
        const response = await fetch(url, {
          headers: { 'X-Api-Key': NEWSAPI_KEY },
        });
        
        if (response.ok) {
          const data = await response.json();
          return (data.articles || []).map((article: NewsAPIArticle) => ({
            ...article,
            country,
          }));
        }
        return [];
      });
      
      const results = await Promise.all(fetchPromises);
      allArticles = results.flat();
      
      // Shuffle articles to mix US and Indian news
      allArticles = allArticles.sort(() => Math.random() - 0.5);
    }

    // Transform articles to our format
    const articles = allArticles.map((article: NewsAPIArticle & { country?: string }, index: number) => ({
      id: `${Date.now()}-${index}`,
      title: article.title || 'Untitled',
      summary: article.description || 'No description available.',
      content: article.content || article.description || 'No content available.',
      source: article.source?.name || 'Unknown Source',
      author: article.author,
      imageUrl: article.urlToImage,
      url: article.url,
      publishedAt: article.publishedAt,
      readTimeMinutes: Math.max(2, Math.ceil((article.content?.length || 500) / 1000)),
      complexity: getComplexity(article.content?.length || 0),
      sentiment: getSentiment(article.title + ' ' + (article.description || '')),
      credibilityScore: getCredibilityScore(article.source?.name || ''),
      category: category || 'general',
      topics: extractTopics(article.title + ' ' + (article.description || '')),
      country: article.country || 'us',
    }));

    console.log(`Fetched ${articles.length} articles from multiple countries`);

    return new Response(JSON.stringify({ 
      articles,
      totalResults: articles.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-news function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      articles: [],
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions to enrich article data
function getComplexity(contentLength: number): 'beginner' | 'intermediate' | 'expert' {
  if (contentLength < 500) return 'beginner';
  if (contentLength < 1500) return 'intermediate';
  return 'expert';
}

function getSentiment(text: string): 'positive' | 'negative' | 'neutral' | 'controversial' {
  const lowerText = text.toLowerCase();
  const positiveWords = ['success', 'win', 'growth', 'breakthrough', 'achieve', 'improve', 'gain', 'rise', 'benefit', 'positive'];
  const negativeWords = ['fail', 'crash', 'crisis', 'death', 'loss', 'decline', 'fall', 'worst', 'danger', 'threat'];
  const controversialWords = ['debate', 'controversy', 'divided', 'dispute', 'conflict', 'tension', 'clash', 'oppose'];
  
  const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;
  const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;
  const controversialCount = controversialWords.filter(w => lowerText.includes(w)).length;
  
  if (controversialCount > 0) return 'controversial';
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function getCredibilityScore(sourceName: string): number {
  const highCredibility = ['reuters', 'associated press', 'bbc', 'npr', 'the new york times', 'the washington post', 'the guardian', 'financial times', 'the economist', 'wall street journal', 'the hindu', 'hindustan times', 'indian express', 'ndtv', 'the times of india', 'mint', 'business standard', 'economic times'];
  const mediumCredibility = ['cnn', 'abc news', 'cbs news', 'nbc news', 'usa today', 'time', 'newsweek', 'politico', 'india today', 'news18', 'zee news', 'republic', 'firstpost', 'scroll', 'the quint', 'the wire', 'livemint'];
  
  const lowerSource = sourceName.toLowerCase();
  
  if (highCredibility.some(s => lowerSource.includes(s))) return Math.floor(Math.random() * 5) + 90;
  if (mediumCredibility.some(s => lowerSource.includes(s))) return Math.floor(Math.random() * 10) + 78;
  return Math.floor(Math.random() * 15) + 65;
}

function extractTopics(text: string): string[] {
  const topicKeywords: Record<string, string[]> = {
    'Technology': ['ai', 'tech', 'software', 'digital', 'cyber', 'robot', 'computer', 'internet', 'app'],
    'Politics': ['president', 'congress', 'election', 'vote', 'government', 'senate', 'policy', 'democrat', 'republican'],
    'Finance': ['stock', 'market', 'economy', 'bank', 'invest', 'crypto', 'bitcoin', 'trade', 'dollar'],
    'Health': ['health', 'medical', 'vaccine', 'hospital', 'doctor', 'disease', 'treatment', 'drug'],
    'Science': ['research', 'study', 'scientist', 'discovery', 'space', 'nasa', 'climate'],
    'Sports': ['game', 'team', 'player', 'championship', 'score', 'win', 'league', 'match'],
    'Entertainment': ['movie', 'film', 'music', 'celebrity', 'show', 'star', 'award', 'album'],
  };
  
  const lowerText = text.toLowerCase();
  const foundTopics: string[] = [];
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(k => lowerText.includes(k))) {
      foundTopics.push(topic);
    }
  }
  
  return foundTopics.length > 0 ? foundTopics.slice(0, 3) : ['General'];
}
