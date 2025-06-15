
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, Bell, Award, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useProviderData } from '@/hooks/useProviderData';
import { useProviderHandlers } from '@/hooks/useProviderHandlers';

// Mock current user ID until auth is implemented
const CURRENT_USER_ID = 'user123';

const RemindersPage = () => {
  // Using shared state and handlers
  const data = useProviderData();
  const handlers = useProviderHandlers(data);

  const [newReminderText, setNewReminderText] = useState('');
  const [completedReminders, setCompletedReminders] = useState<Set<string>>(new Set());
  const [rewardPoints, setRewardPoints] = useState(0);

  const userReminders = useMemo(() => {
    return data.reminders.filter(r => 
      !r.targetUser || r.targetUser === '' || r.targetUser === CURRENT_USER_ID
    );
  }, [data.reminders]);

  const handleAddReminder = () => {
    if (!newReminderText.trim()) {
      toast.error('Please enter a reminder');
      return;
    }
    
    // Use the shared `newReminder` state structure
    data.setNewReminder({
      title: newReminderText,
      message: 'User-created reminder', // Default message for simple user reminders
      frequency: 'daily',
      category: 'Personal',
      targetUser: CURRENT_USER_ID // Set the target user
    });

    // Use a timeout to ensure state is updated before calling the handler
    setTimeout(() => {
      handlers.handleAddReminder();
      setNewReminderText('');
    }, 0);
  };

  const toggleCompleted = (id: string) => {
    const newCompletedSet = new Set(completedReminders);
    const isCompleted = completedReminders.has(id);
    
    if (isCompleted) {
      newCompletedSet.delete(id);
      setRewardPoints(prev => Math.max(0, prev - 10));
      toast.info('10 points removed');
    } else {
      newCompletedSet.add(id);
      setRewardPoints(prev => prev + 10);
      toast.success('You earned 10 points!');
    }
    setCompletedReminders(newCompletedSet);
  };

  const deleteReminder = (id: string) => {
    handlers.handleDeleteReminder(id);
  };

  const rewardLevel = Math.floor(rewardPoints / 50);
  const nextLevelProgress = rewardPoints % 50 * 2; // Calculate percentage to next level

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#7e868b]">Reminders</h1>
          <p className="text-[#7e868b]">Keep track of your tasks and earn rewards</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="bg-mental-green">
                <CardTitle className="flex items-center text-[#7e868b]">
                  <Bell className="mr-2 h-5 w-5 text-[#7e868b]" />
                  Add New Reminder
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-mental-green">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Enter your reminder" value={newReminderText} onChange={e => setNewReminderText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddReminder()} />
                  <Button onClick={handleAddReminder} className="text-mental-green bg-mental-green">
                    <Plus className="h-4 w-4 text-[#7e868b]" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-mental-green">
                <CardTitle className="text-[#7e868b]">Your Reminders</CardTitle>
              </CardHeader>
              <CardContent className="bg-mental-green">
                {userReminders.length === 0 ? <div className="text-center py-6 text-[#7e868b]">
                    No reminders yet. Add one above!
                  </div> : <div className="space-y-2">
                    {userReminders.map(reminder => {
                      const isCompleted = completedReminders.has(reminder.id);
                      return (<div key={reminder.id} className={`flex items-center justify-between p-3 rounded-md ${isCompleted ? 'bg-mental-green/20' : 'bg-mental-peach/20'}`}>
                        <div className="flex items-center space-x-3">
                          <Checkbox id={`reminder-${reminder.id}`} checked={isCompleted} onCheckedChange={() => toggleCompleted(reminder.id)} />
                          <div>
                            <Label htmlFor={`reminder-${reminder.id}`} className={isCompleted ? 'line-through text-[#7e868b]' : 'text-[#7e868b]'}>
                              {reminder.title}
                            </Label>
                             <p className="text-sm text-gray-500">{reminder.message}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteReminder(reminder.id)} className="text-[#7e868b]">
                          Remove
                        </Button>
                      </div>)
                    })}
                  </div>}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="rounded-t-lg bg-mental-green">
                <CardTitle className="flex items-center text-[#7e868b]">
                  <Award className="mr-2 h-5 w-5 text-[#7e868b]" /> 
                  Reward System
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 bg-mental-green">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-[#7e868b]">{rewardPoints}</div>
                  <div className="text-[#7e868b]">Total Points</div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-[#7e868b]">
                    <span>Level {rewardLevel}</span>
                    <span>Level {rewardLevel + 1}</span>
                  </div>
                  <Progress value={nextLevelProgress} className="h-2" />
                  <div className="text-xs text-center text-[#7e868b]">
                    {50 - rewardPoints % 50} points to next level
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-[#7e868b]">Your Achievements</h3>
                  {rewardLevel >= 1 && <div className="bg-mental-blue/20 p-2 rounded-md flex items-center">
                      <Check className="h-4 w-4 mr-2 text-[#7e868b]" />
                      <span className="text-[#7e868b]">Beginner Achiever</span>
                    </div>}
                  {rewardLevel >= 2 && <div className="bg-mental-blue/20 p-2 rounded-md flex items-center">
                      <Check className="h-4 w-4 mr-2 text-[#7e868b]" />
                      <span className="text-[#7e868b]">Consistent Completer</span>
                    </div>}
                  {rewardLevel >= 3 && <div className="bg-mental-blue/20 p-2 rounded-md flex items-center">
                      <Check className="h-4 w-4 mr-2 text-[#7e868b]" />
                      <span className="text-[#7e868b]">Task Master</span>
                    </div>}
                  {rewardLevel === 0 && <div className="text-sm text-[#7e868b] text-center italic">
                      Complete reminders to earn achievements!
                    </div>}
                </div>
              </CardContent>
              <CardFooter className="rounded-b-lg flex justify-center bg-mental-green">
                <div className="text-xs text-center text-[#7e868b]">
                  Complete reminders to earn points and unlock rewards!
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};
export default RemindersPage;
