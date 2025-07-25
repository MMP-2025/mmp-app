
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Reminder } from '@/types/provider';

interface ReminderFormProps {
  newReminder: {
    title: string;
    message: string;
    frequency: Reminder['frequency'];
    category: string;
    targetUser?: string;
  };
  setNewReminder: React.Dispatch<React.SetStateAction<{
    title: string;
    message: string;
    frequency: Reminder['frequency'];
    category: string;
    targetUser?: string;
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
        <Input placeholder="Reminder title..." value={newReminder.title} onChange={e => setNewReminder(prev => ({
        ...prev,
        title: e.target.value
      }))} />
        <Textarea placeholder="Reminder message..." value={newReminder.message} onChange={e => setNewReminder(prev => ({
        ...prev,
        message: e.target.value
      }))} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Category (e.g., Self-care, Medication)" value={newReminder.category} onChange={e => setNewReminder(prev => ({
          ...prev,
          category: e.target.value
        }))} />
          <select value={newReminder.frequency} onChange={e => setNewReminder(prev => ({
          ...prev,
          frequency: e.target.value as Reminder['frequency']
        }))} className="p-2 border border-gray-300 rounded-md">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <Input placeholder="Target User ID (optional, leave blank for all users)" value={newReminder.targetUser || ''} onChange={e => setNewReminder(prev => ({
          ...prev,
          targetUser: e.target.value
        }))} />
        <Button onClick={onAddReminder} className="bg-mental-gray">Add Reminder</Button>
      </CardContent>
    </Card>;
};
export default ReminderForm;
