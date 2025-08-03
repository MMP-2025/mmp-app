import React from 'react';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
const MindfulnessBenefits: React.FC = () => {
  return <Card className="p-6 bg-mental-peach/20">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-mental-peach" />
        <h2 className="text-xl font-semibold text-slate-700">Benefits of Mindfulness</h2>
      </div>
      <ul className="space-y-2 list-disc list-inside">
        <li className="">Reduces stress and anxiety</li>
        <li>Improves focus and attention</li>
        <li>Enhances emotional regulation</li>
        <li>Promotes better sleep</li>
        <li>Boosts immune system function</li>
        <li>Increases self-awareness and compassion</li>
      </ul>
    </Card>;
};
export default MindfulnessBenefits;