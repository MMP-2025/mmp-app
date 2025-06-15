
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Thermometer } from 'lucide-react';

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  location: string;
}

interface WeatherFormProps {
  currentWeather: WeatherData;
  setCurrentWeather: React.Dispatch<React.SetStateAction<WeatherData>>;
  onSave: () => void;
}

const WeatherForm: React.FC<WeatherFormProps> = ({
  currentWeather,
  setCurrentWeather,
  onSave
}) => {
  return (
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
      
      <Button onClick={onSave} className="w-full mb-4">
        Save Weather Data
      </Button>
    </Card>
  );
};

export default WeatherForm;
