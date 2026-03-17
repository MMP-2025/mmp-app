import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, BookOpen, Brain, Sparkles, TrendingUp, Target,
  CheckCircle2, ArrowRight, X, MessageCircle
} from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';
import logo from '@/assets/logo.png';

const OnboardingFlow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { completeOnboarding, updatePreferences } = useOnboarding();
  const { isGuest } = useAuth();

  const totalScreens = 4;
  const progress = ((currentScreen + 1) / totalScreens) * 100;

  const goals = [
    { id: 'mood', label: 'Track my mood and emotions', icon: Heart },
    { id: 'journal', label: 'Journal regularly', icon: BookOpen },
    { id: 'mindfulness', label: 'Practice mindfulness', icon: Brain },
    { id: 'gratitude', label: 'Cultivate gratitude', icon: Sparkles },
    { id: 'progress', label: 'Monitor my mental wellness progress', icon: TrendingUp },
    { id: 'coping', label: 'Develop better coping strategies', icon: Target },
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId) ? prev.filter(id => id !== goalId) : [...prev, goalId]
    );
  };

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => handleComplete();

  const handleComplete = async () => {
    updatePreferences({ goals: selectedGoals });
    await completeOnboarding({ goals: selectedGoals });
  };

  const screens = [
    // Screen 0: Welcome
    <div key="welcome" className="space-y-6 text-center">
      <img src={logo} alt="" className="h-20 w-20 mx-auto" />
      <div className="space-y-3">
        <h2 className="text-2xl font-merriweather font-bold text-foreground">
          Welcome to Making Meaning Psychology
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {isGuest 
            ? "You're exploring as a guest. To save your progress, schedule a consultation with your provider."
            : "Let's set you up for your mental wellness journey."}
        </p>
      </div>
      <div className="flex flex-col gap-3 max-w-sm mx-auto pt-4">
        <Button onClick={handleNext} size="lg" className="w-full bg-primary text-primary-foreground rounded-xl">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button onClick={handleSkip} variant="ghost" size="sm" className="text-muted-foreground">
          Skip Tour
        </Button>
      </div>
    </div>,

    // Screen 1: How it works — Provider questions
    <div key="how-it-works" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-merriweather font-bold text-foreground">How It Works</h2>
        <p className="text-muted-foreground">Your provider connects with you through this app</p>
      </div>
      <div className="grid gap-4 max-w-2xl mx-auto">
        <FeatureCard
          icon={MessageCircle}
          title="Provider Check-ins"
          description="Your provider sends personalized questions. You'll get notified and can respond instantly."
          highlight
        />
        <FeatureCard
          icon={Heart}
          title="Mood & Journal Tracking"
          description="Track your emotions and journal your thoughts between sessions"
        />
        <FeatureCard
          icon={Brain}
          title="Mindfulness Tools"
          description="Guided breathing exercises and meditation to support your wellbeing"
        />
        <FeatureCard
          icon={TrendingUp}
          title="Progress Insights"
          description="See your wellness journey over time with personalized analytics"
        />
      </div>
      <div className="flex gap-3 max-w-sm mx-auto pt-4">
        <Button onClick={handleNext} className="flex-1 bg-primary text-primary-foreground rounded-xl">
          Continue
        </Button>
        <Button onClick={handleSkip} variant="outline" className="rounded-xl">Skip</Button>
      </div>
    </div>,

    // Screen 2: Set Goals
    <div key="goals" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-merriweather font-bold text-foreground">Set Your Goals</h2>
        <p className="text-muted-foreground">Choose what you'd like to focus on (optional)</p>
      </div>
      <div className="grid gap-3 max-w-2xl mx-auto">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoals.includes(goal.id);
          return (
            <div
              key={goal.id}
              onClick={() => handleGoalToggle(goal.id)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-sage-light'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <Checkbox checked={isSelected} />
              <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`flex-1 text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {goal.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 max-w-sm mx-auto pt-4">
        <Button onClick={handleNext} className="flex-1 bg-primary text-primary-foreground rounded-xl">Continue</Button>
        <Button onClick={handleSkip} variant="outline" className="rounded-xl">Skip</Button>
      </div>
    </div>,

    // Screen 3: Ready
    <div key="quickstart" className="space-y-6">
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-sage-light rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-merriweather font-bold text-foreground">You're All Set!</h2>
        <p className="text-muted-foreground">Here's how to get started</p>
      </div>
      <div className="grid gap-4 max-w-2xl mx-auto">
        <QuickActionCard number="1" title="Check in with your mood" description="Start by logging how you're feeling right now" />
        <QuickActionCard number="2" title="Respond to your provider" description="Look for provider questions on your home screen" />
        <QuickActionCard number="3" title="Try a mindfulness exercise" description="Take 5 minutes to center yourself" />
      </div>
      <div className="max-w-sm mx-auto pt-4">
        <Button onClick={handleComplete} className="w-full bg-primary text-primary-foreground rounded-xl" size="lg">
          Start Your Journey
        </Button>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto border-border/50 shadow-xl">
        <CardHeader className="relative">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="text-xs text-muted-foreground font-normal">
              Step {currentScreen + 1} of {totalScreens}
            </CardTitle>
            <Button onClick={handleSkip} variant="ghost" size="sm" className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-1.5" />
        </CardHeader>
        <CardContent className="py-8">
          {screens[currentScreen]}
        </CardContent>
      </Card>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  highlight?: boolean;
}> = ({ icon: Icon, title, description, highlight }) => (
  <div className={`flex items-start gap-4 p-4 rounded-xl ${
    highlight ? 'bg-sage-light border border-primary/20' : 'bg-muted/30'
  }`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
      highlight ? 'bg-primary/15' : 'bg-accent'
    }`}>
      <Icon className={`h-5 w-5 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-foreground text-sm mb-0.5">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

const QuickActionCard: React.FC<{
  number: string;
  title: string;
  description: string;
}> = ({ number, title, description }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl border border-border">
    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-foreground text-sm mb-0.5">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default OnboardingFlow;
