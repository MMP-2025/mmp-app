-- Remove meditation-audios bucket since we removed audio features
DELETE FROM storage.buckets WHERE id = 'meditation-audios';

-- Create patient-provider relationship table
CREATE TABLE IF NOT EXISTS public.patient_provider_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_id, provider_id)
);

-- Create function to check if user is patient's provider
CREATE OR REPLACE FUNCTION public.is_patients_provider(_patient_id UUID, _provider_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.patient_provider_relationships
    WHERE patient_id = _patient_id
      AND provider_id = _provider_id
      AND status = 'active'
  )
$$;

-- Mood entries table
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 10),
  note TEXT,
  factors TEXT[] DEFAULT ARRAY[]::TEXT[],
  location TEXT,
  sleep_hours DECIMAL(3,1),
  exercise BOOLEAN DEFAULT false,
  weather_condition TEXT,
  weather_temperature INTEGER,
  weather_humidity INTEGER,
  weather_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX idx_mood_entries_date ON public.mood_entries(date);
CREATE INDEX idx_mood_entries_user_date ON public.mood_entries(user_id, date DESC);

-- Journal entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  prompt_id UUID REFERENCES public.journal_prompts(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  mood TEXT,
  is_voice_entry BOOLEAN DEFAULT false,
  audio_url TEXT,
  transcript TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX idx_journal_entries_user_created ON public.journal_entries(user_id, created_at DESC);

-- Gratitude entries table
CREATE TABLE IF NOT EXISTS public.gratitude_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  prompt_id UUID REFERENCES public.gratitude_prompts(id) ON DELETE SET NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_gratitude_entries_user_id ON public.gratitude_entries(user_id);
CREATE INDEX idx_gratitude_entries_date ON public.gratitude_entries(date DESC);
CREATE INDEX idx_gratitude_entries_user_date ON public.gratitude_entries(user_id, date DESC);

-- Mindfulness sessions table
CREATE TABLE IF NOT EXISTS public.mindfulness_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.mindfulness_exercises(id) ON DELETE SET NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('meditation', 'breathing', 'body_scan', 'exercise')),
  duration INTEGER NOT NULL, -- in minutes
  quality TEXT CHECK (quality IN ('poor', 'fair', 'good', 'excellent')),
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_mindfulness_sessions_user_id ON public.mindfulness_sessions(user_id);
CREATE INDEX idx_mindfulness_sessions_date ON public.mindfulness_sessions(date DESC);
CREATE INDEX idx_mindfulness_sessions_user_date ON public.mindfulness_sessions(user_id, date DESC);

-- Habit logs table
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_name TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id, habit_name, date)
);

CREATE INDEX idx_habit_logs_user_id ON public.habit_logs(user_id);
CREATE INDEX idx_habit_logs_date ON public.habit_logs(date DESC);
CREATE INDEX idx_habit_logs_user_date ON public.habit_logs(user_id, date DESC);

-- Goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_goals_user_status ON public.goals(user_id, status);

-- Goal milestones table
CREATE TABLE IF NOT EXISTS public.goal_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_goal_milestones_goal_id ON public.goal_milestones(goal_id);

-- CBT sessions table
CREATE TABLE IF NOT EXISTS public.cbt_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_type TEXT NOT NULL,
  situation TEXT,
  thoughts TEXT,
  emotions TEXT,
  behaviors TEXT,
  alternative_thoughts TEXT,
  outcome TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_cbt_sessions_user_id ON public.cbt_sessions(user_id);
CREATE INDEX idx_cbt_sessions_date ON public.cbt_sessions(date DESC);
CREATE INDEX idx_cbt_sessions_user_date ON public.cbt_sessions(user_id, date DESC);

-- Crisis plans table
CREATE TABLE IF NOT EXISTS public.crisis_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  warning_signs TEXT[] DEFAULT ARRAY[]::TEXT[],
  coping_strategies TEXT[] DEFAULT ARRAY[]::TEXT[],
  support_contacts JSONB DEFAULT '[]'::JSONB,
  professional_contacts JSONB DEFAULT '[]'::JSONB,
  emergency_contacts JSONB DEFAULT '[]'::JSONB,
  safe_environment TEXT,
  reasons_to_live TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_crisis_plans_user_id ON public.crisis_plans(user_id);

-- Enable RLS on all tables
ALTER TABLE public.patient_provider_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mindfulness_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patient_provider_relationships
CREATE POLICY "Users can view their own provider relationships"
  ON public.patient_provider_relationships FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = provider_id);

CREATE POLICY "Providers can create relationships"
  ON public.patient_provider_relationships FOR INSERT
  WITH CHECK (auth.uid() = provider_id AND has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can update their relationships"
  ON public.patient_provider_relationships FOR UPDATE
  USING (auth.uid() = provider_id AND has_role(auth.uid(), 'provider'));

-- RLS Policies for mood_entries
CREATE POLICY "Users can view their own mood entries"
  ON public.mood_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' mood entries"
  ON public.mood_entries FOR SELECT
  USING (is_patients_provider(user_id, auth.uid()));

CREATE POLICY "Users can insert their own mood entries"
  ON public.mood_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries"
  ON public.mood_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries"
  ON public.mood_entries FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for journal_entries
CREATE POLICY "Users can view their own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' journal entries"
  ON public.journal_entries FOR SELECT
  USING (is_patients_provider(user_id, auth.uid()));

CREATE POLICY "Users can insert their own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for gratitude_entries
CREATE POLICY "Users can view their own gratitude entries"
  ON public.gratitude_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' gratitude entries"
  ON public.gratitude_entries FOR SELECT
  USING (is_patients_provider(user_id, auth.uid()));

CREATE POLICY "Users can insert their own gratitude entries"
  ON public.gratitude_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gratitude entries"
  ON public.gratitude_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gratitude entries"
  ON public.gratitude_entries FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for mindfulness_sessions
CREATE POLICY "Users can view their own mindfulness sessions"
  ON public.mindfulness_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' mindfulness sessions"
  ON public.mindfulness_sessions FOR SELECT
  USING (is_patients_provider(user_id, auth.uid()));

CREATE POLICY "Users can insert their own mindfulness sessions"
  ON public.mindfulness_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mindfulness sessions"
  ON public.mindfulness_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mindfulness sessions"
  ON public.mindfulness_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for habit_logs
CREATE POLICY "Users can view their own habit logs"
  ON public.habit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' habit logs"
  ON public.habit_logs FOR SELECT
  USING (is_patients_provider(user_id, auth.uid()));

CREATE POLICY "Users can insert their own habit logs"
  ON public.habit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit logs"
  ON public.habit_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit logs"
  ON public.habit_logs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for goals
CREATE POLICY "Users can view their own goals"
  ON public.goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' goals"
  ON public.goals FOR SELECT
  USING (is_patients_provider(user_id, auth.uid()));

CREATE POLICY "Users can insert their own goals"
  ON public.goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON public.goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON public.goals FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for goal_milestones (inherits from goals)
CREATE POLICY "Users can view milestones for their own goals"
  ON public.goal_milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_milestones.goal_id
      AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Providers can view milestones for their patients' goals"
  ON public.goal_milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_milestones.goal_id
      AND is_patients_provider(goals.user_id, auth.uid())
  ));

CREATE POLICY "Users can insert milestones for their own goals"
  ON public.goal_milestones FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_milestones.goal_id
      AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update milestones for their own goals"
  ON public.goal_milestones FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_milestones.goal_id
      AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete milestones for their own goals"
  ON public.goal_milestones FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_milestones.goal_id
      AND goals.user_id = auth.uid()
  ));

-- RLS Policies for cbt_sessions
CREATE POLICY "Users can view their own cbt sessions"
  ON public.cbt_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' cbt sessions"
  ON public.cbt_sessions FOR SELECT
  USING (is_patients_provider(user_id, auth.uid()));

CREATE POLICY "Users can insert their own cbt sessions"
  ON public.cbt_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cbt sessions"
  ON public.cbt_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cbt sessions"
  ON public.cbt_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for crisis_plans
CREATE POLICY "Users can view their own crisis plans"
  ON public.crisis_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their patients' crisis plans"
  ON public.crisis_plans FOR SELECT
  USING (is_patients_provider(user_id, auth.uid()));

CREATE POLICY "Users can insert their own crisis plans"
  ON public.crisis_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crisis plans"
  ON public.crisis_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crisis plans"
  ON public.crisis_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_patient_provider_relationships_updated_at
  BEFORE UPDATE ON public.patient_provider_relationships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crisis_plans_updated_at
  BEFORE UPDATE ON public.crisis_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();