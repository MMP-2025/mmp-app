import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const reminderSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  message: z.string().trim().min(1, "Message is required").max(500, "Message must be less than 500 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required")
});

interface SetReminderDialogProps {
  trigger: React.ReactNode;
  onSetReminder: (reminder: { title: string; message: string; date: Date; time: string }) => void;
}

export const SetReminderDialog = ({ trigger, onSetReminder }: SetReminderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = reminderSchema.parse({ title, message, date, time });
      
      onSetReminder({
        title: validated.title,
        message: validated.message,
        date: new Date(validated.date),
        time: validated.time
      });
      
      toast({
        title: "Reminder set",
        description: "Your reminder has been set successfully"
      });
      
      setTitle('');
      setMessage('');
      setDate('');
      setTime('');
      setOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Reminder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reminder-title">Reminder Title</Label>
            <Input
              id="reminder-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter reminder title"
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="reminder-message">Message</Label>
            <Textarea
              id="reminder-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter reminder message"
              maxLength={500}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="reminder-date">Date</Label>
            <Input
              id="reminder-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reminder-time">Time</Label>
            <Input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Set Reminder</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
