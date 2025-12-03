import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { availableTopics } from '@/data/mockNews';

interface OnboardingFlowProps {
  onComplete: (selectedTopics: string[]) => void;
}

const steps = [
  { id: 'welcome', title: 'Welcome to NewsSphere', subtitle: 'News that grows with you' },
  { id: 'interests', title: 'What interests you?', subtitle: 'Select at least 3 topics' },
  { id: 'personality', title: 'Your news personality', subtitle: 'Help us understand your preferences' },
  { id: 'complete', title: "You're all set!", subtitle: 'Your personalized feed awaits' },
];

const personalityQuestions = [
  {
    question: 'How do you prefer to consume news?',
    options: ['Quick summaries', 'In-depth analysis', 'Mix of both'],
  },
  {
    question: 'How important is source diversity?',
    options: ['Very important', 'Somewhat', 'Not really'],
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(selectedTopics);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedTopics.length >= 3;
    if (currentStep === 2) return answers.length >= personalityQuestions.length;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl mx-auto px-4">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index <= currentStep ? "bg-primary w-12" : "bg-muted w-8"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-3xl shadow-elevated p-8 border border-border"
          >
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-elevated"
                >
                  <Globe className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <h1 className="text-3xl font-bold text-foreground mb-3">{steps[0].title}</h1>
                <p className="text-lg text-muted-foreground mb-2">{steps[0].subtitle}</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  An intelligent news platform that learns your interests and delivers personalized content with transparency.
                </p>
              </div>
            )}

            {/* Step 1: Interests */}
            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{steps[1].title}</h2>
                  <p className="text-muted-foreground">{steps[1].subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {availableTopics.map((topic, index) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <motion.button
                        key={topic}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleTopicToggle(topic)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-soft"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        )}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
                        {topic}
                      </motion.button>
                    );
                  })}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-6">
                  {selectedTopics.length} of 3 minimum selected
                </p>
              </div>
            )}

            {/* Step 2: Personality */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{steps[2].title}</h2>
                  <p className="text-muted-foreground">{steps[2].subtitle}</p>
                </div>
                <div className="space-y-6">
                  {personalityQuestions.map((q, qIndex) => (
                    <div key={qIndex}>
                      <p className="text-sm font-medium text-foreground mb-3">{q.question}</p>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((option) => {
                          const isSelected = answers[qIndex] === option;
                          return (
                            <button
                              key={option}
                              onClick={() => {
                                const newAnswers = [...answers];
                                newAnswers[qIndex] = option;
                                setAnswers(newAnswers);
                              }}
                              className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                isSelected
                                  ? "bg-secondary text-secondary-foreground shadow-soft"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              )}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Complete */}
            {currentStep === 3 && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-news-positive/20 flex items-center justify-center"
                >
                  <Sparkles className="w-10 h-10 text-news-positive" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-3">{steps[3].title}</h2>
                <p className="text-muted-foreground mb-6">{steps[3].subtitle}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedTopics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={cn(currentStep === 0 && "invisible")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {currentStep === steps.length - 1 ? "Start Reading" : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
