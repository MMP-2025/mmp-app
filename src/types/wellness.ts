
export interface WellnessMetric {
  name: string;
  value: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
  suggestion: string;
}

export interface WellnessScore {
  overall: number;
  metrics: WellnessMetric[];
  calculatedAt: string;
  improvements: string[];
  strengths: string[];
}

export interface ScoreHistory {
  date: string;
  score: number;
  breakdown: { [key: string]: number };
}
