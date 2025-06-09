
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  message: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
}

interface ReminderFormProps {
  newReminder: { title: string; message: string; frequency: Reminder['frequency']; category: string };
  setNewReminder: React.Dispatch<React.SetStateAction<{ title: string; message: string; frequency: Reminder['frequency']; category: string }>>;
  onAddReminder: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ newReminder, setNewReminder, onAddReminder }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <Plus className="h-5 w-5" />
          Add New Reminder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Reminder title..."
          value={newReminder.title}
          onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
        />
        <Textarea
          placeholder="Reminder message..."
          value={newReminder.message}
          onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Category (e.g., Self-care, Medication)"
            value={newReminder.category}
            onChange={(e) => setNewReminder(prev => ({ ...prev, category: e.target.value }))}
          />
          <select
            value={newReminder.frequency}
            onChange={(e) => setNewReminder(prev => ({ ...prev, frequency: e.target.value as Reminder['frequency'] }))}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <Button onClick={onAddReminder}>Add Reminder</Button>
      </CardContent>
    </Card>
  );
};

export default ReminderForm;
