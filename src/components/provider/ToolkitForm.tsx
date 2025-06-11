import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
interface ToolkitFormProps {
  newToolkitItem: {
    title: string;
    description: string;
    instructions: string;
    category: string;
    duration: string;
  };
  setNewToolkitItem: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    instructions: string;
    category: string;
    duration: string;
  }>>;
  onAddToolkitItem: () => void;
}
const ToolkitForm: React.FC<ToolkitFormProps> = ({
  newToolkitItem,
  setNewToolkitItem,
  onAddToolkitItem
}) => {
  return <Card className="bg-mental-blue">
      <CardHeader className="bg-mental-blue">
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <Plus className="h-5 w-5" />
          Add New Toolkit Item
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-mental-blue">
        <Input placeholder="Toolkit item title..." value={newToolkitItem.title} onChange={e => setNewToolkitItem(prev => ({
        ...prev,
        title: e.target.value
      }))} />
        <Input placeholder="Brief description..." value={newToolkitItem.description} onChange={e => setNewToolkitItem(prev => ({
        ...prev,
        description: e.target.value
      }))} />
        <Textarea placeholder="Step-by-step instructions..." value={newToolkitItem.instructions} onChange={e => setNewToolkitItem(prev => ({
        ...prev,
        instructions: e.target.value
      }))} rows={4} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Category (e.g., Breathing, Grounding)" value={newToolkitItem.category} onChange={e => setNewToolkitItem(prev => ({
          ...prev,
          category: e.target.value
        }))} />
          <Input placeholder="Duration (e.g., 5 minutes)" value={newToolkitItem.duration} onChange={e => setNewToolkitItem(prev => ({
          ...prev,
          duration: e.target.value
        }))} />
        </div>
        <Button onClick={onAddToolkitItem} className="text-mental-gray bg-mental-gray">Add Toolkit Item</Button>
      </CardContent>
    </Card>;
};
export default ToolkitForm;