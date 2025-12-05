import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const interestCategories = [
  { id: 'general', label: 'General', emoji: '📰' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'health', label: 'Health', emoji: '🏥' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
];

const Auth = () => {
  const navigate = useNavigate();
  const { user, signUp, signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: credentials, 2: interests (signup only)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleToggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    if (isLogin) {
      setIsSubmitting(true);
      const { error } = await signIn(email, password);
      setIsSubmitting(false);
      
      if (error) {
        toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Welcome back!', description: 'Successfully logged in' });
        navigate('/');
      }
    } else {
      // Move to interests step for signup
      setStep(2);
    }
  };

  const handleSignupComplete = async () => {
    if (selectedInterests.length === 0) {
      toast({ title: 'Select interests', description: 'Please select at least one interest', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(email, password, selectedInterests);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast({ title: 'Account exists', description: 'This email is already registered. Please login instead.', variant: 'destructive' });
        setIsLogin(true);
        setStep(1);
      } else {
        toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'Welcome to NewsSphere!', description: 'Your account has been created' });
      localStorage.setItem('newssphere_onboarded', 'true');
      localStorage.setItem('newssphere_topics', JSON.stringify(selectedInterests));
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-elevated p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-3xl">🌐</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground">NewsSphere</h1>
            <p className="text-muted-foreground text-sm mt-1">News That Grows With You</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleCredentialsSubmit}
                className="space-y-4"
              >
                <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                      isLogin ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                    )}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                      !isLogin ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                    )}
                  >
                    Sign Up
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Please wait...' : isLogin ? 'Login' : 'Continue'}
                  {!isLogin && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="interests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Select Your Interests</h2>
                  <p className="text-sm text-muted-foreground">Choose topics you want to follow</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {interestCategories.map((category) => {
                    const isSelected = selectedInterests.includes(category.id);
                    return (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleToggleInterest(category.id)}
                        className={cn(
                          "relative p-4 rounded-xl border-2 transition-all text-left",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                        <span className="text-2xl mb-2 block">{category.emoji}</span>
                        <span className="text-sm font-medium text-foreground">{category.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <Button
                  onClick={handleSignupComplete}
                  className="w-full mt-4"
                  disabled={isSubmitting || selectedInterests.length === 0}
                >
                  {isSubmitting ? 'Creating account...' : 'Start Reading'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
