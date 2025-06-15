
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StorageManager } from '@/utils/storage';
import { Brain } from 'lucide-react';
import { CBTSessionWizard } from './CBTSessionWizard';
import { CBTModuleSelector } from './CBTModuleSelector';
import { CBTSessionHistory } from './CBTSessionHistory';
import { useCBTSessions } from '@/hooks/useCBTSessions';

const CBTModules: React.FC = () => {
  const { sessions, addSession, modules } = useCBTSessions();
  const [currentModule, setCurrentModule] = useState<any>(null);

  const getCompletedModules = () => {
    return sessions.filter(session => session.completed).length;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5" style={{color: '#737373'}} />
          <h3 className="text-xl font-semibold" style={{color: '#737373'}}>CBT Modules</h3>
        </div>
        <p className="mb-4" style={{color: '#737373'}}>
          Cognitive Behavioral Therapy exercises to help challenge and reframe negative thoughts
        </p>
        
        <div className="mb-4">
          <Badge variant="outline" className="mb-2">
            Completed Sessions: {getCompletedModules()}
          </Badge>
        </div>

        {!currentModule ? (
          <CBTModuleSelector modules={modules} onSelectModule={setCurrentModule} />
        ) : (
          <CBTSessionWizard 
            module={currentModule} 
            onComplete={addSession} 
            onCancel={() => setCurrentModule(null)} 
          />
        )}
      </Card>

      <CBTSessionHistory sessions={sessions} />
    </div>
  );
};

export default CBTModules;
