
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TopFactor {
  factor: string;
  count: number;
}

interface TopFactorsDisplayProps {
  topFactors: TopFactor[];
}

const TopFactorsDisplay: React.FC<TopFactorsDisplayProps> = ({ topFactors }) => {
  return (
    <Card className="p-6 bg-white/90">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Most Common Factors</h3>
      <div className="space-y-3">
        {topFactors.map((factor, index) => (
          <div key={factor.factor} className="flex items-center justify-between">
            <Badge variant="outline">{factor.factor}</Badge>
            <div className="flex items-center gap-2">
              <div 
                className="h-2 bg-mental-peach rounded"
                style={{
                  width: `${(factor.count / topFactors[0].count) * 100}px`,
                  minWidth: '20px'
                }}
              />
              <span className="text-sm font-medium text-foreground">{factor.count}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopFactorsDisplay;
