-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'provider', 'patient', 'guest');

-- Create user_roles table for proper role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policy for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quotes_provider_id ON public.quotes(provider_id);
CREATE INDEX idx_quotes_is_active ON public.quotes(is_active);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active quotes"
ON public.quotes FOR SELECT
USING (is_active = true);

CREATE POLICY "Providers can insert quotes"
ON public.quotes FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can update own quotes"
ON public.quotes FOR UPDATE
TO authenticated
USING (provider_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can delete own quotes"
ON public.quotes FOR DELETE
TO authenticated
USING (provider_id = auth.uid() AND public.has_role(auth.uid(), 'provider'));

-- Create journal_prompts table
CREATE TABLE public.journal_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_journal_prompts_provider_id ON public.journal_prompts(provider_id);
CREATE INDEX idx_journal_prompts_is_active ON public.journal_prompts(is_active);

ALTER TABLE public.journal_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active journal prompts"
ON public.journal_prompts FOR SELECT
USING (is_active = true);

CREATE POLICY "Providers can insert journal prompts"
ON public.journal_prompts FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can update own journal prompts"
ON public.journal_prompts FOR UPDATE
TO authenticated
USING (provider_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can delete own journal prompts"
ON public.journal_prompts FOR DELETE
TO authenticated
USING (provider_id = auth.uid() AND public.has_role(auth.uid(), 'provider'));

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'reflection',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_provider_id ON public.questions(provider_id);
CREATE INDEX idx_questions_is_active ON public.questions(is_active);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active questions"
ON public.questions FOR SELECT
USING (is_active = true);

CREATE POLICY "Providers can insert questions"
ON public.questions FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can update own questions"
ON public.questions FOR UPDATE
TO authenticated
USING (provider_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can delete own questions"
ON public.questions FOR DELETE
TO authenticated
USING (provider_id = auth.uid() AND public.has_role(auth.uid(), 'provider'));

-- Create resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resources_provider_id ON public.resources(provider_id);
CREATE INDEX idx_resources_is_active ON public.resources(is_active);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active resources"
ON public.resources FOR SELECT
USING (is_active = true);

CREATE POLICY "Providers can insert resources"
ON public.resources FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can update own resources"
ON public.resources FOR UPDATE
TO authenticated
USING (provider_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can delete own resources"
ON public.resources FOR DELETE
TO authenticated
USING (provider_id = auth.uid() AND public.has_role(auth.uid(), 'provider'));

-- Create gratitude_prompts table
CREATE TABLE public.gratitude_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  difficulty TEXT NOT NULL DEFAULT 'simple',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gratitude_prompts_provider_id ON public.gratitude_prompts(provider_id);
CREATE INDEX idx_gratitude_prompts_is_active ON public.gratitude_prompts(is_active);

ALTER TABLE public.gratitude_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active gratitude prompts"
ON public.gratitude_prompts FOR SELECT
USING (is_active = true);

CREATE POLICY "Providers can insert gratitude prompts"
ON public.gratitude_prompts FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can update own gratitude prompts"
ON public.gratitude_prompts FOR UPDATE
TO authenticated
USING (provider_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can delete own gratitude prompts"
ON public.gratitude_prompts FOR DELETE
TO authenticated
USING (provider_id = auth.uid() AND public.has_role(auth.uid(), 'provider'));

-- Create mindfulness_exercises table
CREATE TABLE public.mindfulness_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  duration INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mindfulness_exercises_provider_id ON public.mindfulness_exercises(provider_id);
CREATE INDEX idx_mindfulness_exercises_is_active ON public.mindfulness_exercises(is_active);

ALTER TABLE public.mindfulness_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active mindfulness exercises"
ON public.mindfulness_exercises FOR SELECT
USING (is_active = true);

CREATE POLICY "Providers can insert mindfulness exercises"
ON public.mindfulness_exercises FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can update own mindfulness exercises"
ON public.mindfulness_exercises FOR UPDATE
TO authenticated
USING (provider_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can delete own mindfulness exercises"
ON public.mindfulness_exercises FOR DELETE
TO authenticated
USING (provider_id = auth.uid() AND public.has_role(auth.uid(), 'provider'));

-- Create toolkit_items table
CREATE TABLE public.toolkit_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_toolkit_items_provider_id ON public.toolkit_items(provider_id);
CREATE INDEX idx_toolkit_items_is_active ON public.toolkit_items(is_active);

ALTER TABLE public.toolkit_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active toolkit items"
ON public.toolkit_items FOR SELECT
USING (is_active = true);

CREATE POLICY "Providers can insert toolkit items"
ON public.toolkit_items FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can update own toolkit items"
ON public.toolkit_items FOR UPDATE
TO authenticated
USING (provider_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can delete own toolkit items"
ON public.toolkit_items FOR DELETE
TO authenticated
USING (provider_id = auth.uid() AND public.has_role(auth.uid(), 'provider'));

-- Create reminders table
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  time TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'daily',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reminders_provider_id ON public.reminders(provider_id);
CREATE INDEX idx_reminders_is_active ON public.reminders(is_active);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active reminders"
ON public.reminders FOR SELECT
USING (is_active = true);

CREATE POLICY "Providers can insert reminders"
ON public.reminders FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can update own reminders"
ON public.reminders FOR UPDATE
TO authenticated
USING (provider_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'provider'));

CREATE POLICY "Providers can delete own reminders"
ON public.reminders FOR DELETE
TO authenticated
USING (provider_id = auth.uid() AND public.has_role(auth.uid(), 'provider'));

-- Create triggers for updated_at
CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_prompts_updated_at
BEFORE UPDATE ON public.journal_prompts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gratitude_prompts_updated_at
BEFORE UPDATE ON public.gratitude_prompts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mindfulness_exercises_updated_at
BEFORE UPDATE ON public.mindfulness_exercises
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_toolkit_items_updated_at
BEFORE UPDATE ON public.toolkit_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at
BEFORE UPDATE ON public.reminders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed quotes from hardcoded data
INSERT INTO public.quotes (text, author, category, provider_id) VALUES
('You don''t have to control your thoughts. You just have to stop letting them control you.', 'Dan Millman', 'Mindfulness', NULL),
('There is hope, even when your brain tells you there isn''t.', 'John Green', 'Hope', NULL),
('Self-care is how you take your power back.', 'Lalah Delia', 'Self-Care', NULL),
('Mental health problems don''t define who you are. They are something you experience.', 'Roy Chisholm', 'Mental Health', NULL),
('Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.', 'Unknown', 'Recovery', NULL),
('The only journey is the one within.', 'Rainer Maria Rilke', 'Self-Discovery', NULL),
('Your present circumstances don''t determine where you can go; they merely determine where you start.', 'Nido Qubein', 'Motivation', NULL);

-- Seed questions from hardcoded data
INSERT INTO public.questions (question, type, provider_id) VALUES
('What brought you joy today?', 'reflection', NULL),
('What''s one small thing you can do for yourself today?', 'self-care', NULL),
('What are you grateful for right now?', 'gratitude', NULL),
('What''s something that challenged you recently, and how did you handle it?', 'growth', NULL),
('What''s one boundary you want to set this week?', 'boundaries', NULL),
('What helps you feel calm when you''re stressed?', 'coping', NULL),
('What''s one self-care activity you''d like to try?', 'self-care', NULL);