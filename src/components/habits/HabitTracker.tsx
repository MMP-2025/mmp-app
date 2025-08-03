import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';
import { Moon, Dumbbell, Pill, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
interface HabitEntry {
  id: string;
  date: string;
  sleepHours: number;
  exerciseMinutes: number;
  exerciseCompleted: boolean;
  medications: Array<{
    name: string;
    taken: boolean;
    time?: string;
  }>;
  customHabits: Array<{
    name: string;
    completed: boolean;
  }>;
}
interface HabitTrackerProps {
  onHabitUpdate?: (habits: HabitEntry) => void;
}
const HabitTracker: React.FC<HabitTrackerProps> = ({
  onHabitUpdate
}) => {
  const [sleepHours, setSleepHours] = useState<number[]>([7]);
  const [exerciseMinutes, setExerciseMinutes] = useState<number[]>([30]);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [medications, setMedications] = useState<Array<{
    name: string;
    taken: boolean;
    time?: string;
  }>>([]);
  const [customHabits, setCustomHabits] = useState<Array<{
    name: string;
    completed: boolean;
  }>>([]);
  const [newMedication, setNewMedication] = useState('');
  const [newHabit, setNewHabit] = useState('');
  const [habitHistory, setHabitHistory] = useState<HabitEntry[]>([]);
  useEffect(() => {
    const saved = StorageManager.load<HabitEntry[]>('habit_entries', []);
    setHabitHistory(saved);

    // Load today's habits if they exist
    const today = new Date().toISOString().split('T')[0];
    const todaysEntry = saved.find(entry => entry.date === today);
    if (todaysEntry) {
      setSleepHours([todaysEntry.sleepHours]);
      setExerciseMinutes([todaysEntry.exerciseMinutes]);
      setExerciseCompleted(todaysEntry.exerciseCompleted);
      setMedications(todaysEntry.medications);
      setCustomHabits(todaysEntry.customHabits);
    }
  }, []);
  const addMedication = () => {
    if (!newMedication.trim()) return;
    setMedications(prev => [...prev, {
      name: newMedication,
      taken: false
    }]);
    setNewMedication('');
  };
  const addCustomHabit = () => {
    if (!newHabit.trim()) return;
    setCustomHabits(prev => [...prev, {
      name: newHabit,
      completed: false
    }]);
    setNewHabit('');
  };
  const toggleMedication = (index: number) => {
    setMedications(prev => prev.map((med, i) => i === index ? {
      ...med,
      taken: !med.taken,
      time: !med.taken ? new Date().toLocaleTimeString() : undefined
    } : med));
  };
  const toggleCustomHabit = (index: number) => {
    setCustomHabits(prev => prev.map((habit, i) => i === index ? {
      ...habit,
      completed: !habit.completed
    } : habit));
  };
  const removeMedication = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index));
  };
  const removeCustomHabit = (index: number) => {
    setCustomHabits(prev => prev.filter((_, i) => i !== index));
  };
  const saveHabits = () => {
    const today = new Date().toISOString().split('T')[0];
    const entry: HabitEntry = {
      id: `habit_${Date.now()}`,
      date: today,
      sleepHours: sleepHours[0],
      exerciseMinutes: exerciseMinutes[0],
      exerciseCompleted,
      medications,
      customHabits
    };
    const updatedHistory = habitHistory.filter(h => h.date !== today);
    updatedHistory.push(entry);
    setHabitHistory(updatedHistory);
    StorageManager.save('habit_entries', updatedHistory);
    onHabitUpdate?.(entry);
    toast.success('Habits saved successfully!');
  };
  return <Card className="p-6 bg-mental-blue">
      <h3 className="text-xl font-semibold mb-4" style={{
      color: '#737373'
    }}>Daily Habits</h3>
      
      <div className="space-y-6">
        {/* Sleep Tracking */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Moon className="h-5 w-5" style={{
            color: '#737373'
          }} />
            <Label className="text-lg font-medium" style={{
            color: '#737373'
          }}>
              Sleep: {sleepHours[0]} hours
            </Label>
          </div>
          <Slider value={sleepHours} onValueChange={setSleepHours} min={0} max={12} step={0.5} className="w-full" />
        </div>

        {/* Exercise Tracking */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="h-5 w-5" style={{
            color: '#737373'
          }} />
            <Label className="text-lg font-medium" style={{
            color: '#737373'
          }}>
              Exercise: {exerciseMinutes[0]} minutes
            </Label>
          </div>
          <Slider value={exerciseMinutes} onValueChange={setExerciseMinutes} min={0} max={180} step={5} className="w-full mb-2" />
          <div className="flex items-center space-x-2">
            <Checkbox id="exercise-completed" checked={exerciseCompleted} onCheckedChange={checked => setExerciseCompleted(checked === true)} />
            <Label htmlFor="exercise-completed" style={{
            color: '#737373'
          }}>
              Completed today's exercise
            </Label>
          </div>
        </div>

        {/* Medication Tracking */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Pill className="h-5 w-5" style={{
            color: '#737373'
          }} />
            <Label className="text-lg font-medium" style={{
            color: '#737373'
          }}>Medications</Label>
          </div>
          <div className="flex gap-2 mb-3">
            <Input placeholder="Add medication..." value={newMedication} onChange={e => setNewMedication(e.target.value)} onKeyPress={e => e.key === 'Enter' && addMedication()} />
            <Button onClick={addMedication} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {medications.map((med, index) => <div key={index} className="flex items-center justify-between p-2 bg-mental-peach/20 rounded">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={med.taken} onCheckedChange={checked => toggleMedication(index)} />
                  <span style={{
                color: '#737373'
              }}>{med.name}</span>
                  {med.taken && med.time && <Badge variant="outline" className="text-xs">
                      Taken at {med.time}
                    </Badge>}
                </div>
                <Button variant="outline" size="sm" onClick={() => removeMedication(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>)}
          </div>
        </div>

        {/* Custom Habits */}
        <div>
          <Label className="text-lg font-medium mb-3 block" style={{
          color: '#737373'
        }}>Custom Habits</Label>
          <div className="flex gap-2 mb-3">
            <Input placeholder="Add custom habit..." value={newHabit} onChange={e => setNewHabit(e.target.value)} onKeyPress={e => e.key === 'Enter' && addCustomHabit()} />
            <Button onClick={addCustomHabit} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {customHabits.map((habit, index) => <div key={index} className="flex items-center justify-between p-2 bg-mental-peach/20 rounded">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={habit.completed} onCheckedChange={checked => toggleCustomHabit(index)} />
                  <span style={{
                color: '#737373'
              }}>{habit.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => removeCustomHabit(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>)}
          </div>
        </div>

        <Button onClick={saveHabits} style={{
        color: '#737373'
      }} className="w-full bg-mental-peach">
          Save Today's Habits
        </Button>
      </div>
    </Card>;
};
export default HabitTracker;