
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MoodTrackingForm from '../MoodTrackingForm';

interface TrackingTabContentProps {
  selectedMood: string | null;
  moodIntensity: number[];
  moodNote: string;
  selectedFactors: string[];
  moodFactors: string[];
  onMoodSelection: (mood: string) => void;
  onIntensityChange: (intensity: number[]) => void;
  onNoteChange: (note: string) => void;
  onFactorToggle: (factor: string) => void;
  onSaveMood: () => void;
}

const TrackingTabContent: React.FC<TrackingTabContentProps> = ({
  selectedMood,
  moodIntensity,
  moodNote,
  selectedFactors,
  moodFactors,
  onMoodSelection,
  onIntensityChange,
  onNoteChange,
  onFactorToggle,
  onSaveMood
}) => {
  return (
    <TabsContent value="track" className="space-y-6">
      <MoodTrackingForm
        selectedMood={selectedMood}
        moodIntensity={moodIntensity}
        moodNote={moodNote}
        selectedFactors={selectedFactors}
        moodFactors={moodFactors}
        onMoodSelection={onMoodSelection}
        onIntensityChange={onIntensityChange}
        onNoteChange={onNoteChange}
        onFactorToggle={onFactorToggle}
        onSaveMood={onSaveMood}
      />
    </TabsContent>
  );
};

export default TrackingTabContent;
