
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ProgressPhotography from '../../photography/ProgressPhotography';
import CBTModules from '../../therapy/CBTModules';
import ExposureTherapyTracker from '../../therapy/ExposureTherapyTracker';
import CopingSkillsLibrary from '../../therapy/CopingSkillsLibrary';

const TherapyTabContent: React.FC = () => {
  return (
    <>
      <TabsContent value="photography">
        <ProgressPhotography />
      </TabsContent>

      <TabsContent value="cbt">
        <div className="space-y-6">
          <CBTModules />
          <ExposureTherapyTracker />
        </div>
      </TabsContent>

      <TabsContent value="coping">
        <CopingSkillsLibrary />
      </TabsContent>
    </>
  );
};

export default TherapyTabContent;
