
import React from 'react';
import { useWeatherCorrelation } from '@/hooks/useWeatherCorrelation';
import WeatherForm from './weather/WeatherForm';
import WeatherCorrelationChart from './weather/WeatherCorrelationChart';
import WeatherAnalysisDisplay from './weather/WeatherAnalysisDisplay';

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
      <WeatherForm
        currentWeather={currentWeather}
        setCurrentWeather={setCurrentWeather}
        onSave={saveWeatherData}
      />

      {correlations && correlations.length > 0 ? (
        <WeatherCorrelationChart correlations={correlations} />
      ) : (
        <WeatherAnalysisDisplay 
          correlations={correlations} 
          dataCount={correlationData.length} 
        />
      )}
    </div>
  );
};

export default WeatherCorrelation;
