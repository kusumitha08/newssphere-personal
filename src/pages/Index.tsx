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
import { mockArticles, mockInterests, mockReadingStats } from '@/data/mockNews';
import { FeedTab, ContextMode } from '@/types/news';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FeedTab>('forYou');
  const [contextMode, setContextMode] = useState<ContextMode>('morning');
  const [activePage, setActivePage] = useState('feed');

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

  const filteredArticles = mockArticles.filter((article) => {
    if (activeTab === 'essential') return article.credibilityScore >= 85;
    if (activeTab === 'explore') return !article.matchReason?.includes('interest');
    return true;
  });

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
              <ContextModeSwitcher mode={contextMode} onModeChange={setContextMode} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* News Feed */}
              <div className="lg:col-span-2 space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {filteredArticles.map((article, index) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      index={index}
                      onSave={(id) => console.log('Saved:', id)}
                      onShare={(id) => console.log('Shared:', id)}
                    />
                  ))}
                </motion.div>
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
    </div>
  );
};

export default Index;
