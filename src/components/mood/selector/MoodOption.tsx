
import React from 'react';
import { Button } from '@/components/ui/button';

interface MoodOptionProps {
  name: string;
  icon: React.ComponentType<any>;
  isSelected: boolean;
  onSelect: (mood: string) => void;
}

const MoodOption: React.FC<MoodOptionProps> = ({
  name,
  icon: IconComponent,
  isSelected,
  onSelect
}) => {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={`flex flex-col items-center p-4 h-auto transition-all hover:scale-105 ${
        isSelected 
          ? 'bg-mental-peach text-gray-700 border-gray-400' 
          : 'hover:bg-mental-peach/40'
      }`}
      onClick={() => onSelect(name)}
    >
      <IconComponent className="h-8 w-8 mb-2" />
      <span className="text-xs font-medium">{name}</span>
    </Button>
  );
};

export default MoodOption;
