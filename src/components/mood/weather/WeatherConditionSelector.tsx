
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  location: string;
}

interface WeatherConditionSelectorProps {
  weather: WeatherData;
  onWeatherChange: (weather: WeatherData) => void;
}

const WeatherConditionSelector: React.FC<WeatherConditionSelectorProps> = ({
  weather,
  onWeatherChange
}) => {
  const weatherOptions = [
    { value: 'sunny', label: 'Sunny', icon: Sun },
    { value: 'cloudy', label: 'Cloudy', icon: Cloud },
    { value: 'rainy', label: 'Rainy', icon: CloudRain },
    { value: 'snowy', label: 'Snowy', icon: Snowflake },
    { value: 'windy', label: 'Windy', icon: Wind }
  ];

  return (
    <div>
      <Label className="text-sm font-medium" style={{color: '#737373'}}>
        Weather Condition
      </Label>
      <Select
        value={weather.condition}
        onValueChange={(value) => 
          onWeatherChange({ ...weather, condition: value as WeatherData['condition'] })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {weatherOptions.map(({ value, label, icon: Icon }) => (
            <SelectItem key={value} value={value}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WeatherConditionSelector;
