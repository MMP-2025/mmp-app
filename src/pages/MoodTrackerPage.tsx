import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Meh, Frown, Angry, Laugh, ArrowLeft, TrendingUp, Calendar, Download, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';
import MoodAnalytics from '@/components/mood/MoodAnalytics';
import MoodFactors from '@/components/mood/MoodFactors';
import MoodCorrelationTracker from '@/components/mood/MoodCorrelationTracker';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: number;
  date: string;
  factors: string[];
  location?: string;
  weather?: string;
  sleepHours?: number;
  exercise?: boolean;
}

const MoodTrackerPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState<number[]>([5]);
  const [moodNote, setMoodNote] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentTab, setCurrentTab] = useState('track');
  const { trackMoodEntry, trackAction } = useAnalytics();

  const moodFactors = [
    'Work/School', 'Relationships', 'Health', 'Sleep', 'Exercise',
    'Weather', 'Social Media', 'Finances', 'Family', 'Friends',
    'Stress', 'Relaxation', 'Entertainment', 'Food', 'Travel'
  ];

  useEffect(() => {
    // Load mood history from storage
    const savedMoods = StorageManager.load<MoodEntry[]>(STORAGE_KEYS.MOOD_ENTRIES, []);
    setMoodHistory(savedMoods);
  }, []);

  const handleMoodSelection = (moodName: string) => {
    setSelectedMood(moodName);
    trackAction('mood_selected', { mood: moodName });
  };

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast.error('Please select a mood first');
      return;
    }

    const newEntry: MoodEntry = {
      id: `mood_${Date.now()}`,
      mood: selectedMood,
      intensity: moodIntensity[0],
      note: moodNote,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      factors: selectedFactors,
      sleepHours: Math.floor(Math.random() * 4) + 6, // Simulated for demo - in real app, this would be user input
      exercise: selectedFactors.includes('Exercise')
    };

    const updatedHistory = [newEntry, ...moodHistory];
    setMoodHistory(updatedHistory);
    StorageManager.save(STORAGE_KEYS.MOOD_ENTRIES, updatedHistory);

    // Track analytics
    trackMoodEntry(selectedMood, moodNote);
    
    toast.success('Mood entry saved successfully!');
    setSelectedMood(null);
    setMoodIntensity([5]);
    setMoodNote('');
    setSelectedFactors([]);
  };

  const exportMoodData = () => {
    const dataStr = JSON.stringify(moodHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Mood data exported successfully!');
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'Ecstatic': return Laugh;
      case 'Happy': return Smile;
      case 'Neutral': return Meh;
      case 'Sad': return Frown;
      case 'Angry': return Angry;
      default: return Meh;
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'text-red-500';
    if (intensity <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-mental-blue min-h-screen">
      <SidebarLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/" className="flex items-center gap-2" style={{color: '#737373'}}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{color: '#737373'}}>Mood Tracker</h1>
                <p style={{color: '#737373'}}>Track and understand your emotional patterns</p>
              </div>
            </div>
            <Button onClick={exportMoodData} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="track" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Track Mood
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="correlations" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Correlations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="track" className="space-y-6">
              <Card className="p-6 bg-white/90">
                <h2 className="text-xl font-semibold mb-4" style={{color: '#737373'}}>How are you feeling today?</h2>
                
                <div className="grid grid-cols-5 gap-2 text-center mb-6">
                  {[
                    { name: 'Ecstatic', icon: Laugh },
                    { name: 'Happy', icon: Smile },
                    { name: 'Neutral', icon: Meh },
                    { name: 'Sad', icon: Frown },
                    { name: 'Angry', icon: Angry }
                  ].map(mood => (
                    <button 
                      key={mood.name} 
                      onClick={() => handleMoodSelection(mood.name)} 
                      className={`p-4 rounded-md transition-all flex flex-col items-center gap-2 ${
                        selectedMood === mood.name 
                          ? 'bg-mental-peach border-2' 
                          : 'hover:bg-mental-peach/40'
                      }`}
                      style={{borderColor: selectedMood === mood.name ? '#737373' : 'transparent'}}
                    >
                      <mood.icon className="h-8 w-8" style={{color: '#737373'}} />
                      <span style={{color: '#737373'}}>{mood.name}</span>
                    </button>
                  ))}
                </div>

                {selectedMood && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-lg font-medium mb-3 block" style={{color: '#737373'}}>
                        Intensity Level: {moodIntensity[0]}/10
                      </Label>
                      <Slider
                        value={moodIntensity}
                        onValueChange={setMoodIntensity}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm mt-2" style={{color: '#737373'}}>
                        <span>Low</span>
                        <span className={getIntensityColor(moodIntensity[0])}>
                          {moodIntensity[0] <= 3 ? 'Mild' : moodIntensity[0] <= 6 ? 'Moderate' : 'Strong'}
                        </span>
                        <span>High</span>
                      </div>
                    </div>

                    <MoodFactors 
                      factors={moodFactors}
                      selectedFactors={selectedFactors}
                      onFactorToggle={handleFactorToggle}
                    />

                    <div>
                      <Label className="text-lg font-medium mb-2 block" style={{color: '#737373'}}>
                        Additional Notes (Optional)
                      </Label>
                      <Textarea 
                        placeholder="What's on your mind? Any specific thoughts or events that influenced your mood?" 
                        value={moodNote} 
                        onChange={e => setMoodNote(e.target.value)} 
                        className="min-h-[120px] border-border focus:border-ring" 
                        style={{color: '#737373'}}
                      />
                    </div>

                    <Button 
                      onClick={handleSaveMood} 
                      className="bg-mental-green hover:bg-mental-green/80 w-full"
                      style={{color: '#737373'}}
                    >
                      Save Mood Entry
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="p-6 bg-white/90">
                <h2 className="text-xl font-semibold mb-4" style={{color: '#737373'}}>Your Mood History</h2>
                {moodHistory.length === 0 ? (
                  <p style={{color: '#737373'}}>Your mood entries will appear here</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {moodHistory.slice(0, 20).map(entry => {
                      const MoodIcon = getMoodIcon(entry.mood);
                      return (
                        <div key={entry.id} className="flex items-start gap-3 p-4 bg-mental-peach/20 rounded-md">
                          <MoodIcon className="h-6 w-6 mt-1" style={{color: '#737373'}} />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium" style={{color: '#737373'}}>{entry.mood}</span>
                                <Badge variant="outline" className={getIntensityColor(entry.intensity)}>
                                  {entry.intensity}/10
                                </Badge>
                              </div>
                              <span className="text-sm" style={{color: '#737373'}}>{formatDate(entry.timestamp)}</span>
                            </div>
                            {entry.factors.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {entry.factors.map(factor => (
                                  <Badge key={factor} variant="secondary" className="text-xs">
                                    {factor}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {entry.note && (
                              <p className="text-sm" style={{color: '#737373'}}>{entry.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <MoodAnalytics moodHistory={moodHistory} />
            </TabsContent>

            <TabsContent value="correlations">
              <MoodCorrelationTracker moodHistory={moodHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default MoodTrackerPage;
