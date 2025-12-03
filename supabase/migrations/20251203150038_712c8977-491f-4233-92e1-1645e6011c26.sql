-- Phase 1a: Sync existing users to user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'provider'::app_role FROM profiles WHERE role = 'provider'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'patient'::app_role FROM profiles WHERE role = 'patient'
ON CONFLICT DO NOTHING;

-- Phase 1c: Create user_reminders table for personal reminders (all users)
CREATE TABLE public.user_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT '09:00',
  frequency TEXT NOT NULL DEFAULT 'daily',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_reminders - all authenticated users can manage their own
CREATE POLICY "Users can view their own reminders"
ON public.user_reminders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
ON public.user_reminders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
ON public.user_reminders FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
ON public.user_reminders FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_reminders_updated_at
BEFORE UPDATE ON public.user_reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();