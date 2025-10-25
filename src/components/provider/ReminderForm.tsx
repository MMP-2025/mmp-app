
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Reminder } from '@/types/provider';

interface ReminderFormProps {
  newReminder: {
    message: string;
    frequency: Reminder['frequency'];
    time: string;
  };
  setNewReminder: React.Dispatch<React.SetStateAction<{
    message: string;
    frequency: Reminder['frequency'];
    time: string;
  }>>;
  onAddReminder: () => void;
}
const ReminderForm: React.FC<ReminderFormProps> = ({
  newReminder,
  setNewReminder,
  onAddReminder
}) => {
  return <Card className="bg-mental-blue">
      <CardHeader className="bg-mental-blue">
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <Plus className="h-5 w-5" />
          Add New Reminder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-mental-blue">
        <Textarea 
          placeholder="Reminder message..." 
          value={newReminder.message} 
          onChange={e => setNewReminder(prev => ({
            ...prev,
            message: e.target.value
          }))} 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select 
            value={newReminder.frequency} 
            onChange={e => setNewReminder(prev => ({
              ...prev,
              frequency: e.target.value as Reminder['frequency']
            }))} 
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <Input 
            type="time"
            placeholder="Time (e.g., 09:00)" 
            value={newReminder.time} 
            onChange={e => setNewReminder(prev => ({
              ...prev,
              time: e.target.value
            }))} 
          />
        </div>
        <Button onClick={onAddReminder} className="bg-mental-gray">Add Reminder</Button>
      </CardContent>
    </Card>;
};
export default ReminderForm;
