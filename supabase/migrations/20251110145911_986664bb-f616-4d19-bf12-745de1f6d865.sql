-- Create wellness_score_history table
CREATE TABLE public.wellness_score_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  score integer NOT NULL,
  breakdown jsonb DEFAULT '{}'::jsonb,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.wellness_score_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own wellness score history"
ON public.wellness_score_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wellness score history"
ON public.wellness_score_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness score history"
ON public.wellness_score_history FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wellness score history"
ON public.wellness_score_history FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' wellness score history"
ON public.wellness_score_history FOR SELECT
USING (is_patients_provider(user_id, auth.uid()));

-- Create progress_photos table
CREATE TABLE public.progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  photo_url text NOT NULL,
  caption text,
  category text DEFAULT 'General',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own progress photos"
ON public.progress_photos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress photos"
ON public.progress_photos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress photos"
ON public.progress_photos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress photos"
ON public.progress_photos FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' progress photos"
ON public.progress_photos FOR SELECT
USING (is_patients_provider(user_id, auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_progress_photos_updated_at
BEFORE UPDATE ON public.progress_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create exposure_goals table
CREATE TABLE public.exposure_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal text NOT NULL,
  description text,
  difficulty_level integer DEFAULT 1,
  status text DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.exposure_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own exposure goals"
ON public.exposure_goals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exposure goals"
ON public.exposure_goals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exposure goals"
ON public.exposure_goals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exposure goals"
ON public.exposure_goals FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' exposure goals"
ON public.exposure_goals FOR SELECT
USING (is_patients_provider(user_id, auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_exposure_goals_updated_at
BEFORE UPDATE ON public.exposure_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create exposure_sessions table
CREATE TABLE public.exposure_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_id uuid REFERENCES public.exposure_goals(id) ON DELETE CASCADE,
  anxiety_before integer NOT NULL,
  anxiety_after integer NOT NULL,
  duration integer,
  notes text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exposure_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own exposure sessions"
ON public.exposure_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exposure sessions"
ON public.exposure_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exposure sessions"
ON public.exposure_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exposure sessions"
ON public.exposure_sessions FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' exposure sessions"
ON public.exposure_sessions FOR SELECT
USING (is_patients_provider(user_id, auth.uid()));

-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for progress photos
CREATE POLICY "Users can view their own progress photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own progress photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own progress photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own progress photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Providers can view their patients' progress photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'progress-photos' AND
  EXISTS (
    SELECT 1 FROM public.patient_provider_relationships
    WHERE patient_id = ((storage.foldername(name))[1])::uuid
    AND provider_id = auth.uid()
    AND status = 'active'
  )
);