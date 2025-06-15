
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StorageManager } from '@/utils/storage';
import { Brain, Heart, Activity, Users, Star } from 'lucide-react';
import { toast } from 'sonner';

interface CopingSkill {
  id: string;
  title: string;
  description: string;
  category: 'cognitive' | 'emotional' | 'physical' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  steps: string[];
  tags: string[];
  effectiveness?: number;
  timesUsed: number;
}

interface SkillUsage {
  id: string;
  skillId: string;
  date: string;
  effectiveness: number;
  notes: string;
  timestamp: number;
}

const CopingSkillsLibrary: React.FC = () => {
  const [skills, setSkills] = useState<CopingSkill[]>([]);
  const [usageHistory, setUsageHistory] = useState<SkillUsage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const defaultSkills: CopingSkill[] = [
    {
      id: 'box-breathing',
      title: '4-7-8 Breathing',
      description: 'A calming breathing technique to reduce anxiety',
      category: 'physical',
      difficulty: 'easy',
      duration: '5-10 minutes',
      steps: [
        'Sit comfortably with your back straight',
        'Inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat 3-4 cycles'
      ],
      tags: ['anxiety', 'stress', 'breathing', 'quick'],
      timesUsed: 0
    },
    {
      id: 'grounding-5-4-3-2-1',
      title: '5-4-3-2-1 Grounding',
      description: 'Use your senses to stay present and reduce anxiety',
      category: 'cognitive',
      difficulty: 'easy',
      duration: '5 minutes',
      steps: [
        'Name 5 things you can see',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste'
      ],
      tags: ['grounding', 'anxiety', 'present', 'mindfulness'],
      timesUsed: 0
    },
    {
      id: 'thought-stopping',
      title: 'Thought Stopping',
      description: 'Interrupt negative thought patterns',
      category: 'cognitive',
      difficulty: 'medium',
      duration: '2-5 minutes',
      steps: [
        'Notice when negative thoughts start',
        'Say "STOP" out loud or mentally',
        'Take 3 deep breaths',
        'Replace with a positive or neutral thought',
        'Engage in a different activity'
      ],
      tags: ['negative thoughts', 'cognitive', 'interruption'],
      timesUsed: 0
    },
    {
      id: 'progressive-muscle-relaxation',
      title: 'Progressive Muscle Relaxation',
      description: 'Release physical tension throughout your body',
      category: 'physical',
      difficulty: 'medium',
      duration: '15-20 minutes',
      steps: [
        'Lie down or sit comfortably',
        'Start with your toes - tense for 5 seconds, then relax',
        'Move up to your calves, thighs, abdomen',
        'Continue with arms, shoulders, face',
        'Notice the contrast between tension and relaxation'
      ],
      tags: ['relaxation', 'tension', 'body', 'stress'],
      timesUsed: 0
    },
    {
      id: 'emotional-validation',
      title: 'Emotional Validation',
      description: 'Acknowledge and accept your emotions without judgment',
      category: 'emotional',
      difficulty: 'medium',
      duration: '10 minutes',
      steps: [
        'Identify what you\'re feeling',
        'Say "It\'s okay to feel this way"',
        'Remember emotions are temporary',
        'Ask what this emotion is telling you',
        'Decide on a healthy response'
      ],
      tags: ['emotions', 'acceptance', 'self-compassion'],
      timesUsed: 0
    },
    {
      id: 'social-support',
      title: 'Reach Out for Support',
      description: 'Connect with others when you need help',
      category: 'social',
      difficulty: 'easy',
      duration: 'Variable',
      steps: [
        'Identify trusted friends or family',
        'Choose how to reach out (call, text, in-person)',
        'Be specific about what you need',
        'Listen to their perspective',
        'Express gratitude for their support'
      ],
      tags: ['support', 'connection', 'communication'],
      timesUsed: 0
    }
  ];

  useEffect(() => {
    const savedSkills = StorageManager.load<CopingSkill[]>('coping_skills', defaultSkills);
    const savedUsage = StorageManager.load<SkillUsage[]>('skill_usage', []);
    setSkills(savedSkills);
    setUsageHistory(savedUsage);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cognitive': return Brain;
      case 'emotional': return Heart;
      case 'physical': return Activity;
      case 'social': return Users;
      default: return Brain;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const useSkill = (skill: CopingSkill) => {
    // For demo purposes, we'll simulate effectiveness rating
    const effectiveness = Math.floor(Math.random() * 3) + 8; // 8-10 rating
    
    const usage: SkillUsage = {
      id: `usage_${Date.now()}`,
      skillId: skill.id,
      date: new Date().toISOString().split('T')[0],
      effectiveness,
      notes: '',
      timestamp: Date.now()
    };

    const updatedUsage = [usage, ...usageHistory];
    setUsageHistory(updatedUsage);
    StorageManager.save('skill_usage', updatedUsage);

    // Update skill usage count and effectiveness
    const updatedSkills = skills.map(s => {
      if (s.id === skill.id) {
        const newTimesUsed = s.timesUsed + 1;
        const currentEffectiveness = s.effectiveness || 0;
        const newEffectiveness = ((currentEffectiveness * (newTimesUsed - 1)) + effectiveness) / newTimesUsed;
        
        return {
          ...s,
          timesUsed: newTimesUsed,
          effectiveness: newEffectiveness
        };
      }
      return s;
    });

    setSkills(updatedSkills);
    StorageManager.save('coping_skills', updatedSkills);
    
    toast.success(`Great job using ${skill.title}! Keep practicing coping skills.`);
  };

  const getPersonalizedRecommendations = () => {
    const recentUsage = usageHistory.slice(0, 10);
    const effectiveSkills = recentUsage
      .filter(usage => usage.effectiveness >= 8)
      .map(usage => usage.skillId);
    
    const categories = effectiveSkills.map(skillId => 
      skills.find(skill => skill.id === skillId)?.category
    ).filter(Boolean);

    const mostEffectiveCategory = categories.reduce((acc, cat) => {
      acc[cat!] = (acc[cat!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(mostEffectiveCategory)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    return skills
      .filter(skill => skill.category === topCategory && !effectiveSkills.includes(skill.id))
      .slice(0, 3);
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendations = getPersonalizedRecommendations();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <h3 className="text-xl font-semibold mb-4" style={{color: '#737373'}}>Coping Skills Library</h3>
        <p className="mb-4" style={{color: '#737373'}}>
          Discover and practice evidence-based coping strategies for mental wellness
        </p>

        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search skills or tags..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
            <TabsTrigger value="emotional">Emotional</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            {recommendations.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{color: '#737373'}}>
                  <Star className="h-4 w-4" />
                  Recommended for You
                </h4>
                <div className="grid gap-3">
                  {recommendations.map(skill => (
                    <div key={skill.id} className="border rounded-lg p-3 bg-mental-green/10">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium" style={{color: '#737373'}}>{skill.title}</h5>
                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      </div>
                      <p className="text-sm mb-2" style={{color: '#737373'}}>{skill.description}</p>
                      <Button size="sm" onClick={() => useSkill(skill)}>
                        Try This Skill
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {filteredSkills.map(skill => {
                const IconComponent = getCategoryIcon(skill.category);
                return (
                  <Card key={skill.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" style={{color: '#737373'}} />
                        <h4 className="font-semibold" style={{color: '#737373'}}>{skill.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={getDifficultyColor(skill.difficulty)}>
                          {skill.difficulty}
                        </Badge>
                        <Badge variant="outline">{skill.duration}</Badge>
                        {skill.effectiveness && (
                          <Badge variant="outline" className="text-green-600">
                            {skill.effectiveness.toFixed(1)}/10
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm mb-3" style={{color: '#737373'}}>{skill.description}</p>

                    <div className="mb-3">
                      <h5 className="font-medium mb-2" style={{color: '#737373'}}>Steps:</h5>
                      <ol className="text-sm space-y-1" style={{color: '#737373'}}>
                        {skill.steps.map((step, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="font-medium">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {skill.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {skill.timesUsed > 0 && (
                          <span className="text-xs" style={{color: '#737373'}}>
                            Used {skill.timesUsed} times
                          </span>
                        )}
                        <Button onClick={() => useSkill(skill)}>
                          Use Skill
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CopingSkillsLibrary;
