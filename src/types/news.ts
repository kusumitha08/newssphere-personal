export type Sentiment = 'positive' | 'negative' | 'neutral' | 'controversial';
export type Complexity = 'beginner' | 'intermediate' | 'expert';
export type FeedTab = 'essential' | 'forYou' | 'explore' | 'following';
export type ContextMode = 'morning' | 'deep' | 'commute' | 'breaking';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceIcon?: string;
  imageUrl?: string;
  publishedAt: Date;
  readTimeMinutes: number;
  complexity: Complexity;
  sentiment: Sentiment;
  credibilityScore: number; // 0-100
  category: string;
  isBreaking?: boolean;
  isSaved?: boolean;
  matchReason?: string; // Why this was recommended
  topics: string[];
}

export interface Interest {
  id: string;
  name: string;
  strength: number; // 0-100
  color: string;
  relatedInterests: string[];
}

export interface UserPreferences {
  interests: Interest[];
  contextMode: ContextMode;
  priorityAccuracyVsSpeed: number; // 0-100 (0=speed, 100=accuracy)
  priorityDepthVsBrevity: number; // 0-100 (0=brevity, 100=depth)
  priorityDiverseVsConfirmed: number; // 0-100 (0=confirmed, 100=diverse)
  blockedTopics: string[];
  trustedSources: string[];
  blockedSources: string[];
}

export interface ReadingStats {
  articlesReadThisWeek: number;
  averageReadTime: number;
  topCategories: string[];
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
    controversial: number;
  };
}
