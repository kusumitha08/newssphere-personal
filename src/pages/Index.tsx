import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { FeedTabs } from '@/components/news/FeedTabs';
import { ContextModeSwitcher } from '@/components/news/ContextModeSwitcher';
import { NewsCard } from '@/components/news/NewsCard';
import { InterestDNA } from '@/components/news/InterestDNA';
import { ReadingInsights } from '@/components/news/ReadingInsights';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { SearchBar } from '@/components/news/SearchBar';
import { CategoryFilter } from '@/components/news/CategoryFilter';
import { ArticleDetail } from '@/components/news/ArticleDetail';
import { NewsSkeletonGrid } from '@/components/news/NewsSkeleton';
import { useNews } from '@/hooks/useNews';
import { mockInterests, mockReadingStats } from '@/data/mockNews';
import { FeedTab, ContextMode, NewsArticle } from '@/types/news';
import { toast } from '@/hooks/use-toast';

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

  const { articles, isLoading, fetchNews, searchNews, filterByCategory } = useNews();

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

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsArticleOpen(true);
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
        {/* Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar
            isOpen={true}
            onClose={() => setSidebarOpen(false)}
            activePage={activePage}
            onNavigate={setActivePage}
          />
        </div>

        {/* Mobile Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activePage={activePage}
          onNavigate={setActivePage}
        />

        {/* Main Content */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* News Feed */}
              <div className="lg:col-span-2">
                {isLoading ? (
                  <NewsSkeletonGrid count={6} />
                ) : articles.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-muted-foreground">No articles found. Try a different search or category.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {articles.map((article, index) => (
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

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Interest DNA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <InterestDNA interests={mockInterests} />
                </motion.div>

                {/* Reading Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ReadingInsights stats={mockReadingStats} />
                </motion.div>
              </div>
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
    </div>
  );
};

export default Index;
