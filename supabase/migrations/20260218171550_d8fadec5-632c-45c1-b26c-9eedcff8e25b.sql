-- Clean up orphaned records before adding FK constraints
DELETE FROM public.wellness_score_history WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.progress_photos WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.exposure_goals WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.exposure_sessions WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.user_reminders WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Now add FK constraints
ALTER TABLE public.wellness_score_history 
  ADD CONSTRAINT fk_wellness_score_history_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.progress_photos 
  ADD CONSTRAINT fk_progress_photos_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.exposure_goals 
  ADD CONSTRAINT fk_exposure_goals_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.exposure_sessions 
  ADD CONSTRAINT fk_exposure_sessions_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_reminders 
  ADD CONSTRAINT fk_user_reminders_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;