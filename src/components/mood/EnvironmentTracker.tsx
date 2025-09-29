import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Info } from 'lucide-react';
interface EnvironmentTrackerProps {
  weather: string;
  setWeather: (weather: string) => void;
  location: string;
  setLocation: (location: string) => void;
}
const EnvironmentTracker: React.FC<EnvironmentTrackerProps> = ({
  weather,
  setWeather,
  location,
  setLocation
}) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return Sun;
      case 'cloudy':
        return Cloud;
      case 'rainy':
        return CloudRain;
      case 'snowy':
        return Snowflake;
      case 'windy':
        return Wind;
      default:
        return Cloud;
    }
  };
  const WeatherIcon = getWeatherIcon(weather);
  return <Card className="p-4 bg-mental-peach">
      <div className="flex items-center gap-2 mb-3">
        <WeatherIcon className="h-5 w-5" style={{
        color: '#737373'
      }} />
        <h3 className="text-lg font-semibold" style={{
        color: '#737373'
      }}>Environment</h3>
        <Info className="h-4 w-4" style={{
        color: '#737373'
      }} />
      </div>
      
      <div className="mb-4 p-3 bg-mental-blue/10 rounded-lg">
        <p className="text-sm" style={{
        color: '#737373'
      }}>
          <strong>Why we track weather:</strong> Research shows that weather conditions can significantly impact mood and mental health. 
          Seasonal changes, sunlight exposure, and atmospheric pressure all influence our brain chemistry and emotional well-being.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block" style={{
          color: '#737373'
        }}>
            Current Weather
          </Label>
          <Select value={weather} onValueChange={setWeather}>
            <SelectTrigger>
              <SelectValue placeholder="Select weather condition" />
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
          <Label className="text-sm font-medium mb-2 block" style={{
          color: '#737373'
        }}>
            Location (Optional)
          </Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Where are you?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">🏠 Home</SelectItem>
              <SelectItem value="work">🏢 Work</SelectItem>
              <SelectItem value="outdoors">🌳 Outdoors</SelectItem>
              <SelectItem value="social">👥 Social Setting</SelectItem>
              <SelectItem value="other">📍 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>;
};
export default EnvironmentTracker;