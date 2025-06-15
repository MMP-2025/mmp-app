
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import WeatherConditionSelector from './WeatherConditionSelector';

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  location: string;
}

interface WeatherFormProps {
  currentWeather: WeatherData;
  setCurrentWeather: (weather: WeatherData) => void;
  onSave: () => void;
}

const WeatherForm: React.FC<WeatherFormProps> = ({
  currentWeather,
  setCurrentWeather,
  onSave
}) => {
  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>
        Current Weather
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <WeatherConditionSelector
          weather={currentWeather}
          onWeatherChange={setCurrentWeather}
        />
        
        <div>
          <Label className="text-sm font-medium" style={{color: '#737373'}}>
            Temperature (°C)
          </Label>
          <Input
            type="number"
            value={currentWeather.temperature}
            onChange={(e) => setCurrentWeather({
              ...currentWeather,
              temperature: parseInt(e.target.value) || 0
            })}
            placeholder="22"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium" style={{color: '#737373'}}>
            Humidity (%)
          </Label>
          <Input
            type="number"
            value={currentWeather.humidity}
            onChange={(e) => setCurrentWeather({
              ...currentWeather,
              humidity: parseInt(e.target.value) || 0
            })}
            placeholder="50"
            min="0"
            max="100"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium" style={{color: '#737373'}}>
            Location
          </Label>
          <Input
            value={currentWeather.location}
            onChange={(e) => setCurrentWeather({
              ...currentWeather,
              location: e.target.value
            })}
            placeholder="Your location"
          />
        </div>
      </div>
      
      <Button onClick={onSave} className="w-full">
        Save Weather Data
      </Button>
    </Card>
  );
};

export default WeatherForm;
