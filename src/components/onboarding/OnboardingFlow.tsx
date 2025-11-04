import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Heart, 
  BookOpen, 
  Brain, 
  TrendingUp, 
  Target,
  CheckCircle2,
  ArrowRight,
  X
} from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';

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
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    updatePreferences({ goals: selectedGoals });
    await completeOnboarding({ goals: selectedGoals });
  };

  const screens = [
    // Screen 0: Welcome
    <div key="welcome" className="space-y-6 text-center">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
        <Heart className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-foreground">
          Welcome to Making Meaning Psychology
        </h2>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          {isGuest 
            ? "You're exploring as a guest. Ready to unlock the full experience and save your progress? Schedule a consultation to start your journey with Making Meaning Psychology."
            : "We're so glad you're here. Let's take a quick tour to help you get the most out of your mental wellness journey."}
        </p>
      </div>
      <div className="flex flex-col gap-3 max-w-md mx-auto pt-4">
        <Button onClick={handleNext} size="lg" className="w-full">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button onClick={handleSkip} variant="ghost" size="sm">
          Skip Tour
        </Button>
      </div>
    </div>,

    // Screen 1: Key Features
    <div key="features" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Key Features to Explore</h2>
        <p className="text-muted-foreground">
          Discover the tools designed to support your wellbeing
        </p>
      </div>
      <div className="grid gap-4 max-w-2xl mx-auto">
        <FeatureCard
          icon={Heart}
          title="Mood Tracking"
          description="Monitor your emotional patterns and identify triggers"
        />
        <FeatureCard
          icon={BookOpen}
          title="Journaling"
          description="Express your thoughts with guided prompts and free writing"
        />
        <FeatureCard
          icon={Brain}
          title="Mindfulness Exercises"
          description="Access guided meditations and breathing exercises"
        />
        <FeatureCard
          icon={Sparkles}
          title="Gratitude Practice"
          description="Cultivate positivity through daily gratitude reflections"
        />
        <FeatureCard
          icon={TrendingUp}
          title="Progress Insights"
          description="Visualize your wellness journey with detailed analytics"
        />
      </div>
      <div className="flex gap-3 max-w-md mx-auto pt-4">
        <Button onClick={handleNext} className="flex-1">
          Continue
        </Button>
        <Button onClick={handleSkip} variant="outline">
          Skip
        </Button>
      </div>
    </div>,

    // Screen 2: Set Goals
    <div key="goals" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Set Your Goals</h2>
        <p className="text-muted-foreground">
          Choose what you'd like to focus on (optional)
        </p>
      </div>
      <div className="grid gap-3 max-w-2xl mx-auto">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoals.includes(goal.id);
          return (
            <div
              key={goal.id}
              onClick={() => handleGoalToggle(goal.id)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Checkbox checked={isSelected} />
              <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`flex-1 ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {goal.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 max-w-md mx-auto pt-4">
        <Button onClick={handleNext} className="flex-1">
          Continue
        </Button>
        <Button onClick={handleSkip} variant="outline">
          Skip
        </Button>
      </div>
    </div>,

    // Screen 3: Quick Start
    <div key="quickstart" className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/40 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">You're All Set!</h2>
        <p className="text-muted-foreground">
          Here are some suggested first steps to get started
        </p>
      </div>
      <div className="grid gap-4 max-w-2xl mx-auto">
        <QuickActionCard
          number="1"
          title="Check in with your mood"
          description="Track how you're feeling today"
        />
        <QuickActionCard
          number="2"
          title="Try a mindfulness exercise"
          description="Take 5 minutes to center yourself"
        />
        <QuickActionCard
          number="3"
          title="Write in your journal"
          description="Reflect on your thoughts and experiences"
        />
      </div>
      <div className="flex gap-3 max-w-md mx-auto pt-4">
        <Button onClick={handleComplete} className="flex-1" size="lg">
          Start Your Journey
        </Button>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-sm text-muted-foreground">
              Step {currentScreen + 1} of {totalScreens}
            </CardTitle>
            <Button
              onClick={handleSkip}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
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
}> = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const QuickActionCard: React.FC<{
  number: string;
  title: string;
  description: string;
}> = ({ number, title, description }) => (
  <div className="flex items-start gap-4 p-4 rounded-lg border-2 border-border">
    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default OnboardingFlow;
