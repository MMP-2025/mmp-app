
import React from 'react';
import { Button } from '@/components/ui/button';

interface CBTModule {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

interface CBTModuleSelectorProps {
  modules: CBTModule[];
  onSelectModule: (module: CBTModule) => void;
}

export const CBTModuleSelector: React.FC<CBTModuleSelectorProps> = ({ modules, onSelectModule }) => {
  return (
    <div className="grid gap-4">
      {modules.map(module => (
        <div key={module.id} className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2" style={{color: '#737373'}}>{module.title}</h4>
          <p className="text-sm mb-3" style={{color: '#737373'}}>{module.description}</p>
          <div className="flex justify-between items-center">
            <div className="text-sm" style={{color: '#737373'}}>
              {module.steps.length} steps
            </div>
            <Button onClick={() => onSelectModule(module)}>
              Start Module
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
