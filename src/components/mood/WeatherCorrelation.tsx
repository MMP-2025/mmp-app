
import React from 'react';
import { useWeatherCorrelation } from '@/hooks/useWeatherCorrelation';
import WeatherFormContainer from './weather/WeatherFormContainer';
import WeatherCorrelationDisplay from './weather/WeatherCorrelationDisplay';

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  location: string;
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
  const {
    currentWeather,
    setCurrentWeather,
    correlationData,
    saveWeatherData,
    analyzeCorrelations
  } = useWeatherCorrelation();

  const correlations = analyzeCorrelations();

  return (
    <div className="space-y-6">
      <WeatherFormContainer
        currentWeather={currentWeather}
        setCurrentWeather={setCurrentWeather}
        onSave={saveWeatherData}
      />

      <WeatherCorrelationDisplay
        correlations={correlations}
        dataCount={correlationData.length}
      />
    </div>
  );
};

export default WeatherCorrelation;
