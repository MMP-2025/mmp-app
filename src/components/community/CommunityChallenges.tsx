import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Users, Calendar, Timer, Star, Award, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // days
  participants: number;
  reward: string;
  startDate: string;
  endDate: string;
  progress?: number;
  joined: boolean;
  completed: boolean;
  tasks: string[];
}
const CommunityChallenges = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [challenges] = useState<Challenge[]>([{
    id: 'mindful_week',
    title: '7-Day Mindfulness Challenge',
    description: 'Practice mindfulness for at least 10 minutes each day for a week.',
    category: 'mindfulness',
    difficulty: 'easy',
    duration: 7,
    participants: 234,
    reward: 'Mindfulness Master Badge',
    startDate: '2024-01-15',
    endDate: '2024-01-21',
    progress: 60,
    joined: true,
    completed: false,
    tasks: ['Day 1: 10-minute breathing meditation', 'Day 2: Mindful walking for 15 minutes', 'Day 3: Body scan meditation', 'Day 4: Mindful eating exercise', 'Day 5: Loving-kindness meditation', 'Day 6: Mindful journaling', 'Day 7: Integration practice']
  }, {
    id: 'gratitude_month',
    title: '30-Day Gratitude Journey',
    description: 'Write down 3 things you\'re grateful for each day for a month.',
    category: 'gratitude',
    difficulty: 'medium',
    duration: 30,
    participants: 189,
    reward: 'Gratitude Champion Badge + Premium Journal Template',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    joined: false,
    completed: false,
    tasks: ['Write 3 gratitudes daily', 'Share weekly reflection', 'Practice gratitude meditation', 'Express gratitude to someone each week']
  }, {
    id: 'mood_tracking',
    title: 'Consistent Mood Tracking',
    description: 'Track your mood daily for 21 days to build awareness and identify patterns.',
    category: 'mood',
    difficulty: 'easy',
    duration: 21,
    participants: 156,
    reward: 'Pattern Detective Badge',
    startDate: '2024-01-10',
    endDate: '2024-01-30',
    progress: 33,
    joined: true,
    completed: false,
    tasks: ['Log mood daily', 'Note contributing factors', 'Weekly pattern review', 'Share insights with community']
  }, {
    id: 'exercise_wellness',
    title: '14-Day Movement for Mental Health',
    description: 'Incorporate 30 minutes of physical activity daily to boost mental wellbeing.',
    category: 'physical',
    difficulty: 'medium',
    duration: 14,
    participants: 298,
    reward: 'Wellness Warrior Badge + Fitness Plan',
    startDate: '2024-01-08',
    endDate: '2024-01-22',
    joined: false,
    completed: false,
    tasks: ['Daily 30-minute activity', 'Try different exercise types', 'Track mood before/after exercise', 'Share favorite activities']
  }, {
    id: 'social_connection',
    title: 'Connect & Share Challenge',
    description: 'Reach out to friends or family members you haven\'t spoken to in a while.',
    category: 'social',
    difficulty: 'hard',
    duration: 10,
    participants: 87,
    reward: 'Connection Builder Badge',
    startDate: '2024-01-12',
    endDate: '2024-01-22',
    joined: false,
    completed: false,
    tasks: ['Contact 1 person daily', 'Have meaningful conversations', 'Plan social activities', 'Reflect on connection quality']
  }]);
  const categories = [{
    value: 'all',
    label: 'All Challenges'
  }, {
    value: 'mindfulness',
    label: 'Mindfulness'
  }, {
    value: 'gratitude',
    label: 'Gratitude'
  }, {
    value: 'mood',
    label: 'Mood Tracking'
  }, {
    value: 'physical',
    label: 'Physical Wellness'
  }, {
    value: 'social',
    label: 'Social Connection'
  }];
  const filteredChallenges = challenges.filter(challenge => selectedCategory === 'all' || challenge.category === selectedCategory);
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };
  const handleJoinChallenge = (challengeId: string) => {
    toast.success('You\'ve joined the challenge! Good luck!');
  };
  const handleViewProgress = (challengeId: string) => {
    toast.info('Opening challenge progress...');
  };
  return <div className="space-y-6 bg-mental-peach">
      {/* Category Filter */}
      <Card className="p-4 bg-mental-gray">
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => <Button key={category.value} variant={selectedCategory === category.value ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(category.value)} className={`text-xs ${selectedCategory === category.value ? 'bg-mental-blue hover:bg-mental-blue/80' : ''}`}>
              {category.label}
            </Button>)}
        </div>
      </Card>

      {/* Active Challenges Summary */}
      <Card className="p-6 bg-mental-gray ">
        <div className="flex items-center gap-3 mb-4 bg-mental-gray">
          <Trophy className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold" style={{
          color: '#737373'
        }}>Your Active Challenges</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 bg-mental-gray">
              {challenges.filter(c => c.joined && !c.completed).length}
            </div>
            <div style={{
            color: '#737373'
          }} className="text-sm bg-mental-gray">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 bg-mental-gray">
              {challenges.filter(c => c.completed).length}
            </div>
            <div style={{
            color: '#737373'
          }} className="text-sm bg-mental-gray">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 bg-mental-gray">
              {Math.round(challenges.filter(c => c.joined).reduce((sum, c) => sum + (c.progress || 0), 0) / Math.max(challenges.filter(c => c.joined).length, 1))}%
            </div>
            <div style={{
            color: '#737373'
          }} className="text-sm bg-mental-gray">Avg Progress</div>
          </div>
        </div>
      </Card>

      {/* Challenges List */}
      <div className="grid gap-4">
        {filteredChallenges.map(challenge => <Card key={challenge.id} className="p-6 bg-mental-gray">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold" style={{
                color: '#737373'
              }}>{challenge.title}</h3>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                  {challenge.joined && <Badge className="bg-blue-100 text-blue-800">Joined</Badge>}
                  {challenge.completed && <Badge className="bg-green-100 text-green-800">
                      <Award className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>}
                </div>
                
                <p className="text-sm mb-3" style={{
              color: '#737373'
            }}>{challenge.description}</p>
                
                <div className="flex items-center gap-4 text-sm mb-3" style={{
              color: '#737373'
            }}>
                  <div className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    {challenge.duration} days
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {challenge.participants} participants
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {getDaysRemaining(challenge.endDate)} days left
                  </div>
                </div>
                
                {challenge.joined && challenge.progress !== undefined && <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{
                  color: '#737373'
                }}>Progress</span>
                      <span style={{
                  color: '#737373'
                }}>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>}
                
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium" style={{
                color: '#737373'
              }}>
                    Reward: {challenge.reward}
                  </span>
                </div>
                
                <div className="text-xs" style={{
              color: '#737373'
            }}>
                  <div className="font-medium mb-1">Challenge Tasks:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {challenge.tasks.slice(0, 3).map((task, index) => <li key={index}>{task}</li>)}
                    {challenge.tasks.length > 3 && <li>...and {challenge.tasks.length - 3} more</li>}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                {challenge.joined ? <>
                    <Button size="sm" className="bg-mental-blue hover:bg-mental-blue/80" onClick={() => handleViewProgress(challenge.id)}>
                      <TrendingUp className="h-4 w-4 mr-1" />
                      View Progress
                    </Button>
                    {!challenge.completed && <Button size="sm" variant="outline">
                        Leave Challenge
                      </Button>}
                  </> : <Button size="sm" className="bg-mental-green hover:bg-mental-green/80" onClick={() => handleJoinChallenge(challenge.id)}>
                    <Target className="h-4 w-4 mr-1" />
                    Join Challenge
                  </Button>}
              </div>
            </div>
          </Card>)}
      </div>

      {/* Create Challenge CTA */}
      <Card className="p-6 bg-mental-green/20 text-center">
        <h3 className="text-lg font-semibold mb-2" style={{
        color: '#737373'
      }}>
          Have an idea for a community challenge?
        </h3>
        <p className="mb-4" style={{
        color: '#737373'
      }}>
          Propose a new challenge and help others on their mental health journey.
        </p>
        <Button className="bg-mental-green hover:bg-mental-green/80">
          Propose Challenge
        </Button>
      </Card>
    </div>;
};
export default CommunityChallenges;