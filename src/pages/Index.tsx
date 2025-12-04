import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { FeedTabs } from '@/components/news/FeedTabs';
import { ContextModeSwitcher } from '@/components/news/ContextModeSwitcher';
import { NewsCard } from '@/components/news/NewsCard';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { SearchBar } from '@/components/news/SearchBar';
import { CategoryFilter } from '@/components/news/CategoryFilter';
import { ArticleDetail } from '@/components/news/ArticleDetail';
import { NewsSkeletonGrid } from '@/components/news/NewsSkeleton';
import { AudioPlayer } from '@/components/news/AudioPlayer';
import { useNews } from '@/hooks/useNews';
import { FeedTab, ContextMode, NewsArticle } from '@/types/news';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const categories = ['all', 'general', 'business', 'technology', 'science', 'health', 'sports', 'entertainment'];

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FeedTab>('forYou');
  const [contextMode, setContextMode] = useState<ContextMode>('morning');
  const [activePage, setActivePage] = useState('feed');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isArticleOpen, setIsArticleOpen] = useState(false);
  
  // Audio player state
  const [audioArticle, setAudioArticle] = useState<NewsArticle | null>(null);
  const [audioSummary, setAudioSummary] = useState<string>('');
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const { articles, isLoading, fetchNews, searchNews, filterByCategory } = useNews();

  // Filter articles based on context mode
  const displayedArticles = useMemo(() => {
    if (contextMode === 'breaking') {
      // Show only breaking/urgent news (negative sentiment or high credibility urgent topics)
      return articles.filter(article => 
        article.sentiment === 'negative' || 
        article.sentiment === 'controversial' ||
        article.topics.some(topic => 
          ['Politics', 'Breaking', 'Urgent', 'Emergency'].includes(topic)
        )
      );
    }
    return articles;
  }, [articles, contextMode]);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('newssphere_onboarded');
    if (hasOnboarded) {
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = (topics: string[]) => {
    localStorage.setItem('newssphere_onboarded', 'true');
    localStorage.setItem('newssphere_topics', JSON.stringify(topics));
    setShowOnboarding(false);
  };

  const handleSearch = async (query: string) => {
    await searchNews(query);
  };

  const handleCategoryChange = async (category: string) => {
    setActiveCategory(category);
    await filterByCategory(category === 'all' ? '' : category);
  };

  const generateAudioSummary = async (article: NewsArticle) => {
    setAudioArticle(article);
    setAudioSummary(article.summary);
    setAudioBase64(null);
    setIsGeneratingAudio(true);

    try {
      const { data, error } = await supabase.functions.invoke('summarize-article', {
        body: {
          title: article.title,
          summary: article.summary,
          content: (article as any).content || '',
          generateAudio: true,
        },
      });

      if (error) throw error;

      setAudioSummary(data.summary || article.summary);
      setAudioBase64(data.audioBase64);
      
      if (!data.audioBase64) {
        toast({
          title: 'Audio unavailable',
          description: 'Summary generated but audio could not be created.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate audio summary. Please try again.',
        variant: 'destructive',
      });
      setAudioArticle(null);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleArticleClick = (article: NewsArticle) => {
    if (contextMode === 'commute') {
      // In commute mode, generate audio summary instead of opening detail
      generateAudioSummary(article);
    } else {
      setSelectedArticle(article);
      setIsArticleOpen(true);
    }
  };

  const handleSaveArticle = (id: string) => {
    toast({
      title: 'Article saved',
      description: 'Added to your reading list',
    });
  };

  const handleShareArticle = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article && (article as any).url) {
      navigator.clipboard.writeText((article as any).url);
      toast({
        title: 'Link copied',
        description: 'Article link copied to clipboard',
      });
    }
  };

  const handleCloseAudio = () => {
    setAudioArticle(null);
    setAudioBase64(null);
    setAudioSummary('');
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onSettingsClick={() => {}}
        onSearchClick={() => {}}
      />

      <div className="flex">
        {/* Mobile Sidebar - only shows when menu is opened */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activePage={activePage}
          onNavigate={setActivePage}
        />

        {/* Main Content - Full Width */}
        <main className="flex-1 min-w-0">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                onSearch={handleSearch}
                isLoading={isLoading}
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
              <ContextModeSwitcher mode={contextMode} onModeChange={setContextMode} />
            </div>

            {/* Context Mode Banner */}
            {contextMode === 'commute' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg flex items-center gap-2"
              >
                <span className="text-secondary">🎧</span>
                <p className="text-sm text-secondary">
                  <strong>Commute Mode:</strong> Tap any article to listen to an audio summary
                </p>
              </motion.div>
            )}

            {contextMode === 'breaking' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-lg flex items-center gap-2"
              >
                <span className="text-accent">⚡</span>
                <p className="text-sm text-accent">
                  <strong>Breaking Mode:</strong> Showing only urgent and breaking news
                </p>
              </motion.div>
            )}

            {/* News Feed - Full Width */}
            <div className="w-full pb-20">
              {isLoading ? (
                <NewsSkeletonGrid count={6} />
              ) : displayedArticles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">
                    {contextMode === 'breaking' 
                      ? 'No breaking news at the moment. Check back later.'
                      : 'No articles found. Try a different search or category.'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {displayedArticles.map((article, index) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      index={index}
                      onSave={handleSaveArticle}
                      onShare={handleShareArticle}
                      onClick={handleArticleClick}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Article Detail Modal */}
      <ArticleDetail
        article={selectedArticle}
        isOpen={isArticleOpen}
        onClose={() => setIsArticleOpen(false)}
        onSave={handleSaveArticle}
        onShare={handleShareArticle}
      />

      {/* Audio Player */}
      {audioArticle && (
        <AudioPlayer
          audioBase64={audioBase64}
          title={audioArticle.title}
          summary={audioSummary}
          isLoading={isGeneratingAudio}
          onClose={handleCloseAudio}
        />
      )}
    </div>
  );
};

export default Index;
