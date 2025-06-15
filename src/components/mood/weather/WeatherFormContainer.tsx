
import React from 'react';
import WeatherForm from './WeatherForm';

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  location: string;
}

interface WeatherFormContainerProps {
  currentWeather: WeatherData;
  setCurrentWeather: React.Dispatch<React.SetStateAction<WeatherData>>;
  onSave: () => void;
}

const WeatherFormContainer: React.FC<WeatherFormContainerProps> = ({
  currentWeather,
  setCurrentWeather,
  onSave
}) => {
  return (
    <WeatherForm
      currentWeather={currentWeather}
      setCurrentWeather={setCurrentWeather}
      onSave={onSave}
    />
  );
};

export default WeatherFormContainer;
