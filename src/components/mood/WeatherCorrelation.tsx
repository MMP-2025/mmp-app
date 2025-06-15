
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StorageManager } from '@/utils/storage';
import { Cloud, Sun, CloudRain, Snowflake, MapPin, Thermometer } from 'lucide-react';
import { toast } from 'sonner';

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  location: string;
}

interface WeatherMoodEntry {
  id: string;
  date: string;
  mood: string;
  moodIntensity: number;
  weather: WeatherData;
  timestamp: number;
}

interface WeatherCorrelationProps {
  moodHistory?: Array<{
    mood: string;
    intensity: number;
    timestamp: number;
    weather?: WeatherData;
  }>;
}

const WeatherCorrelation: React.FC<WeatherCorrelationProps> = ({ moodHistory = [] }) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData>({
    condition: 'sunny',
    temperature: 22,
    humidity: 50,
    location: ''
  });
  const [correlationData, setCorrelationData] = useState<WeatherMoodEntry[]>([]);

  useEffect(() => {
    const saved = StorageManager.load<WeatherMoodEntry[]>('weather_mood_data', []);
    setCorrelationData(saved);
  }, []);

  const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: Snowflake,
    windy: Cloud
  };

  const saveWeatherData = () => {
    if (!currentWeather.location.trim()) {
      toast.error('Please enter your location');
      return;
    }

    const entry: WeatherMoodEntry = {
      id: `weather_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood: 'neutral', // This would be linked to actual mood entry
      moodIntensity: 5,
      weather: currentWeather,
      timestamp: Date.now()
    };

    const updatedData = [...correlationData, entry];
    setCorrelationData(updatedData);
    StorageManager.save('weather_mood_data', updatedData);
    toast.success('Weather data saved!');
  };

  const analyzeCorrelations = () => {
    if (correlationData.length < 5) {
      return null;
    }

    const weatherMoodMap = correlationData.reduce((acc, entry) => {
      const condition = entry.weather.condition;
      if (!acc[condition]) {
        acc[condition] = { totalMood: 0, count: 0 };
      }
      acc[condition].totalMood += entry.moodIntensity;
      acc[condition].count += 1;
      return acc;
    }, {} as Record<string, { totalMood: number; count: number }>);

    const correlations = Object.entries(weatherMoodMap).map(([condition, data]) => ({
      condition,
      averageMood: data.totalMood / data.count,
      count: data.count
    })).sort((a, b) => b.averageMood - a.averageMood);

    return correlations;
  };

  const correlations = analyzeCorrelations();

  const getMoodColor = (mood: number) => {
    if (mood >= 7) return 'text-green-600';
    if (mood >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <h3 className="text-xl font-semibold mb-4" style={{color: '#737373'}}>Weather & Location Tracking</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="mb-2 block" style={{color: '#737373'}}>Current Location</Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" style={{color: '#737373'}} />
              <Input
                placeholder="Enter your location..."
                value={currentWeather.location}
                onChange={e => setCurrentWeather(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block" style={{color: '#737373'}}>Weather Condition</Label>
            <Select 
              value={currentWeather.condition} 
              onValueChange={(value: WeatherData['condition']) => 
                setCurrentWeather(prev => ({ ...prev, condition: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunny">☀️ Sunny</SelectItem>
                <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                <SelectItem value="snowy">❄️ Snowy</SelectItem>
                <SelectItem value="windy">💨 Windy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="mb-2 block" style={{color: '#737373'}}>Temperature (°C)</Label>
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" style={{color: '#737373'}} />
              <Input
                type="number"
                value={currentWeather.temperature}
                onChange={e => setCurrentWeather(prev => ({ ...prev, temperature: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block" style={{color: '#737373'}}>Humidity (%)</Label>
            <Input
              type="number"
              value={currentWeather.humidity}
              onChange={e => setCurrentWeather(prev => ({ ...prev, humidity: parseInt(e.target.value) || 0 }))}
              min={0}
              max={100}
            />
          </div>
        </div>
        
        <Button onClick={saveWeatherData} className="w-full mb-4">
          Save Weather Data
        </Button>
      </Card>

      {correlations && correlations.length > 0 && (
        <Card className="p-6 bg-white/90">
          <h4 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Weather-Mood Correlations</h4>
          <div className="space-y-3">
            {correlations.map(({ condition, averageMood, count }) => {
              const IconComponent = weatherIcons[condition as keyof typeof weatherIcons];
              return (
                <div key={condition} className="flex items-center justify-between p-3 bg-mental-peach/20 rounded">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5" style={{color: '#737373'}} />
                    <span className="capitalize font-medium" style={{color: '#737373'}}>{condition}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{count} entries</Badge>
                    <span className={`font-semibold ${getMoodColor(averageMood)}`}>
                      {averageMood.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WeatherCorrelation;
