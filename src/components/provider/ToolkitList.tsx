import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Trash2 } from 'lucide-react';
interface ToolkitItem {
  id: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  duration: string;
}
interface ToolkitListProps {
  toolkitItems: ToolkitItem[];
  onDeleteToolkitItem: (id: string) => void;
}
const ToolkitList: React.FC<ToolkitListProps> = ({
  toolkitItems,
  onDeleteToolkitItem
}) => {
  return <Card>
      <CardHeader className="bg-mental-blue">
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <Wrench className="h-5 w-5" />
          Saved Toolkit Items ({toolkitItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-mental-blue">
        {toolkitItems.length === 0 ? <p className="text-gray-500 text-center py-8">No toolkit items added yet</p> : <div className="space-y-3">
            {toolkitItems.map(item => <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#7e868b] mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="text-sm text-gray-700 mb-2">{item.instructions.substring(0, 100)}...</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {item.category}
                      </span>
                      {item.duration && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {item.duration}
                        </span>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onDeleteToolkitItem(item.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>)}
          </div>}
      </CardContent>
    </Card>;
};
export default ToolkitList;