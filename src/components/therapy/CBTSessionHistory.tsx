
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CBTSession {
  id: string;
  date: string;
  module: string;
  thought: string;
  alternativeThought?: string;
  completed: boolean;
}

interface CBTSessionHistoryProps {
  sessions: CBTSession[];
}

export const CBTSessionHistory: React.FC<CBTSessionHistoryProps> = ({ sessions }) => {
  if (sessions.length === 0) return null;

  return (
    <Card className="p-6 bg-white/90">
      <h4 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Session History</h4>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sessions.slice(0, 10).map(session => (
          <div key={session.id} className="border rounded-lg p-3 bg-mental-peach/20">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium" style={{color: '#737373'}}>{session.module}</span>
              <Badge variant={session.completed ? "default" : "secondary"}>
                {session.completed ? "Completed" : "In Progress"}
              </Badge>
            </div>
            <p className="text-sm mb-2" style={{color: '#737373'}}>
              <strong>Original thought:</strong> {session.thought}
            </p>
            {session.alternativeThought && (
              <p className="text-sm" style={{color: '#737373'}}>
                <strong>Balanced thought:</strong> {session.alternativeThought}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">{session.date}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
