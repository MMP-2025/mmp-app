import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const timeBlockSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required")
});

interface TimeBlockingAssistantProps {
  onAddTimeBlock?: (block: { title: string; startTime: string; endTime: string }) => void;
}

export const TimeBlockingAssistant = ({ onAddTimeBlock }: TimeBlockingAssistantProps) => {
  const { toast } = useToast();
  const [timeBlocks, setTimeBlocks] = useState([
    { id: '1', title: 'Deep Work', startTime: '09:00', endTime: '11:00', color: 'bg-blue-100 text-blue-800' },
    { id: '2', title: 'Meetings', startTime: '14:00', endTime: '16:00', color: 'bg-green-100 text-green-800' },
  ]);
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockStart, setNewBlockStart] = useState('');
  const [newBlockEnd, setNewBlockEnd] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const addTimeBlock = () => {
    try {
      const validated = timeBlockSchema.parse({
        title: newBlockTitle,
        startTime: newBlockStart,
        endTime: newBlockEnd
      });

      if (editingId) {
        // Update existing block
        setTimeBlocks(timeBlocks.map(block => 
          block.id === editingId 
            ? { ...block, title: validated.title, startTime: validated.startTime, endTime: validated.endTime }
            : block
        ));
        
        toast({
          title: "Time block updated",
          description: "Your time block has been updated successfully"
        });
        
        setEditingId(null);
      } else {
        // Add new block
        const newBlock = {
          id: Date.now().toString(),
          title: validated.title,
          startTime: validated.startTime,
          endTime: validated.endTime,
          color: 'bg-purple-100 text-purple-800'
        };
        
        setTimeBlocks([...timeBlocks, newBlock]);
        
        // Also add to parent events if callback provided
        if (onAddTimeBlock) {
          onAddTimeBlock({
            title: validated.title,
            startTime: validated.startTime,
            endTime: validated.endTime
          });
        }
        
        toast({
          title: "Time block added",
          description: "Your time block has been added successfully"
        });
      }
      
      setNewBlockTitle('');
      setNewBlockStart('');
      setNewBlockEnd('');
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

  const editTimeBlock = (block: { id: string; title: string; startTime: string; endTime: string }) => {
    setEditingId(block.id);
    setNewBlockTitle(block.title);
    setNewBlockStart(block.startTime);
    setNewBlockEnd(block.endTime);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewBlockTitle('');
    setNewBlockStart('');
    setNewBlockEnd('');
  };

  const removeTimeBlock = (id: string) => {
    setTimeBlocks(timeBlocks.filter(block => block.id !== id));
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg text-neutral-500">Time Blocking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-neutral-500">Create Time Block</Label>
          
          <Input
            placeholder="Block title"
            value={newBlockTitle}
            onChange={(e) => setNewBlockTitle(e.target.value)}
            className="text-sm text-neutral-500"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-neutral-500">Start</Label>
              <Input
                type="time"
                value={newBlockStart}
                onChange={(e) => setNewBlockStart(e.target.value)}
                className="text-sm text-neutral-500"
              />
            </div>
            <div>
              <Label className="text-xs text-neutral-500">End</Label>
              <Input
                type="time"
                value={newBlockEnd}
                onChange={(e) => setNewBlockEnd(e.target.value)}
                className="text-sm text-neutral-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={addTimeBlock}
              size="sm" 
              className="flex-1 bg-neutral-300 hover:bg-neutral-400 border border-mental-gray text-neutral-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              {editingId ? 'Update Block' : 'Add Block'}
            </Button>
            {editingId && (
              <Button 
                onClick={cancelEdit}
                size="sm"
                variant="outline"
                className="text-neutral-600"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <Label className="text-sm font-medium text-neutral-500 mb-3 block">Active Time Blocks</Label>
          <div className="space-y-2">
            {timeBlocks.map((block) => (
              <div 
                key={block.id} 
                className="flex items-center justify-between p-2 bg-mental-gray rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                onClick={() => editTimeBlock(block)}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-neutral-500" />
                  <div>
                    <div className="text-sm font-medium text-neutral-600">{block.title}</div>
                    <div className="text-xs text-neutral-500">{block.startTime} - {block.endTime}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTimeBlock(block.id);
                  }}
                  className="h-6 w-6 p-0 text-neutral-500 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};