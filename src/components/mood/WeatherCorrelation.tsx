
import React, { useState, useEffect } from 'react';
import { StorageManager } from '@/utils/storage';
import { toast } from 'sonner';
import WeatherForm from './weather/WeatherForm';
import WeatherCorrelationChart from './weather/WeatherCorrelationChart';

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

  const saveWeatherData = () => {
    if (!currentWeather.location.trim()) {
      toast.error('Please enter your location');
      return;
    }

    const entry: WeatherMoodEntry = {
      id: `weather_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood: 'neutral',
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

  return (
    <div className="space-y-6">
      <WeatherForm
        currentWeather={currentWeather}
        setCurrentWeather={setCurrentWeather}
        onSave={saveWeatherData}
      />

      {correlations && correlations.length > 0 && (
        <WeatherCorrelationChart correlations={correlations} />
      )}
    </div>
  );
};

export default WeatherCorrelation;
