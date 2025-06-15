
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import CBTModules from '@/components/therapy/CBTModules';
import CopingSkillsLibrary from '@/components/therapy/CopingSkillsLibrary';
import ExposureTherapyTracker from '@/components/therapy/ExposureTherapyTracker';
import ProgressPhotography from '@/components/photography/ProgressPhotography';

const TherapeuticTools = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#7e868b]">
          <Brain className="h-5 w-5" />
          Therapeutic Tools & Exercises
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <CBTModules />
          <ExposureTherapyTracker />
          <CopingSkillsLibrary />
          <ProgressPhotography />
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapeuticTools;
