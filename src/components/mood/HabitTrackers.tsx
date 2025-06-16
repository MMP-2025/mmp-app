
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Moon, Dumbbell, Calendar } from 'lucide-react';

interface HabitTrackersProps {
  sleepHours: number[];
  setSleepHours: (hours: number[]) => void;
  exerciseMinutes: number[];
  setExerciseMinutes: (minutes: number[]) => void;
  cycleTracking: boolean;
  setCycleTracking: (enabled: boolean) => void;
  cycleDay: number[];
  setCycleDay: (day: number[]) => void;
}

const HabitTrackers: React.FC<HabitTrackersProps> = ({
  sleepHours,
  setSleepHours,
  exerciseMinutes,
  setExerciseMinutes,
  cycleTracking,
  setCycleTracking,
  cycleDay,
  setCycleDay
}) => {
  return (
    <Card className="p-4 bg-white/90">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{color: '#737373'}}>
        Daily Habits
      </h3>
      
      <div className="space-y-6">
        {/* Sleep Tracker */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Moon className="h-4 w-4" style={{color: '#737373'}} />
            <Label className="text-sm font-medium" style={{color: '#737373'}}>
              Sleep Hours: {sleepHours[0]} hours
            </Label>
          </div>
          <Slider
            value={sleepHours}
            onValueChange={setSleepHours}
            min={0}
            max={12}
            step={0.5}
            className="w-full"
          />
          <p className="text-xs mt-1" style={{color: '#737373'}}>
            Quality sleep is essential for emotional regulation and mental well-being
          </p>
        </div>

        {/* Exercise Tracker */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="h-4 w-4" style={{color: '#737373'}} />
            <Label className="text-sm font-medium" style={{color: '#737373'}}>
              Exercise: {exerciseMinutes[0]} minutes
            </Label>
          </div>
          <Slider
            value={exerciseMinutes}
            onValueChange={setExerciseMinutes}
            min={0}
            max={180}
            step={15}
            className="w-full"
          />
          <p className="text-xs mt-1" style={{color: '#737373'}}>
            Physical activity releases endorphins and can significantly improve mood
          </p>
        </div>

        {/* Menstrual Cycle Tracker */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Checkbox
              id="cycle-tracking"
              checked={cycleTracking}
              onCheckedChange={setCycleTracking}
            />
            <Calendar className="h-4 w-4" style={{color: '#737373'}} />
            <Label htmlFor="cycle-tracking" className="text-sm font-medium" style={{color: '#737373'}}>
              Track Menstrual Cycle (Optional)
            </Label>
          </div>
          
          {cycleTracking && (
            <div className="ml-6">
              <Label className="text-sm font-medium mb-2 block" style={{color: '#737373'}}>
                Cycle Day: {cycleDay[0]}
              </Label>
              <Slider
                value={cycleDay}
                onValueChange={setCycleDay}
                min={1}
                max={35}
                step={1}
                className="w-full"
              />
              <p className="text-xs mt-1" style={{color: '#737373'}}>
                Hormones fluctuate throughout your cycle, which can impact mood, energy, and emotional sensitivity
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default HabitTrackers;
