
export type GratitudeExercise = {
  id: number;
  title: string;
  description: string;
  instructions: string;
};

export type GratitudeEntry = {
  id: string;
  content: string;
  date: Date;
  category?: string;
};
