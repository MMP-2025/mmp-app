import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CBTSession {
  id: string;
  date: string;
  module_type: string;
  thoughts?: string;
  alternative_thoughts?: string;
  emotions?: string;
  outcome?: string;
  created_at: string;
}

interface CBTSessionHistoryProps {
  sessions: CBTSession[];
}

export const CBTSessionHistory: React.FC<CBTSessionHistoryProps> = ({ sessions }) => {
  if (sessions.length === 0) return null;

  const getModuleTitle = (moduleType: string) => {
    switch (moduleType) {
      case 'thought-challenging':
        return 'Thought Challenging';
      case 'cognitive-restructuring':
        return 'Cognitive Restructuring';
      default:
        return moduleType;
    }
  };

  return (
    <Card className="p-6 bg-white/90">
      <h4 className="text-lg font-semibold mb-4" style={{color: '#737373'}}>Session History</h4>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sessions.slice(0, 10).map(session => (
          <div key={session.id} className="border rounded-lg p-3 bg-mental-peach/20">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium" style={{color: '#737373'}}>
                {getModuleTitle(session.module_type)}
              </span>
              <Badge variant="default">
                Completed
              </Badge>
            </div>
            {session.thoughts && (
              <p className="text-sm mb-2" style={{color: '#737373'}}>
                <strong>Thoughts:</strong> {session.thoughts}
              </p>
            )}
            {session.alternative_thoughts && (
              <p className="text-sm mb-2" style={{color: '#737373'}}>
                <strong>Alternative perspective:</strong> {session.alternative_thoughts}
              </p>
            )}
            {session.outcome && (
              <p className="text-sm mb-2" style={{color: '#737373'}}>
                <strong>Outcome:</strong> {session.outcome}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {new Date(session.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
