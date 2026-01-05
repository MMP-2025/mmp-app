import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Trash2 } from 'lucide-react';
import { ToolkitItem } from '@/types/provider';

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
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Wrench className="h-5 w-5" />
          Saved Toolkit Items ({toolkitItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-mental-blue">
        {toolkitItems.length === 0 ? <p className="text-muted-foreground text-center py-8">No toolkit items added yet</p> : <div className="space-y-3">
            {toolkitItems.map(item => <div key={item.id} className="p-4 border rounded-lg bg-background/50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-sm text-foreground/80 mb-2">{item.instructions.substring(0, 100)}...</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-mental-green/30 text-foreground rounded-full text-xs">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onDeleteToolkitItem(item.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>)}
          </div>}
      </CardContent>
    </Card>;
};
export default ToolkitList;