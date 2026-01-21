-- Create notifications table for provider-to-patient notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  patient_id UUID, -- NULL means all patients
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  action_url TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE, -- NULL means send immediately
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' -- pending, sent, read, cancelled
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Providers can create notifications
CREATE POLICY "Providers can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (
  auth.uid() = provider_id AND 
  has_role(auth.uid(), 'provider'::app_role)
);

-- Providers can view their own notifications
CREATE POLICY "Providers can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = provider_id);

-- Providers can update their own notifications
CREATE POLICY "Providers can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = provider_id);

-- Providers can delete their own notifications
CREATE POLICY "Providers can delete their own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = provider_id);

-- Patients can view notifications sent to them (or to all patients if they're linked to the provider)
CREATE POLICY "Patients can view their notifications"
ON public.notifications
FOR SELECT
USING (
  (patient_id = auth.uid()) OR 
  (patient_id IS NULL AND is_patients_provider(auth.uid(), provider_id))
);

-- Patients can update (mark as read) their notifications
CREATE POLICY "Patients can mark notifications as read"
ON public.notifications
FOR UPDATE
USING (
  (patient_id = auth.uid()) OR 
  (patient_id IS NULL AND is_patients_provider(auth.uid(), provider_id))
)
WITH CHECK (
  (patient_id = auth.uid()) OR 
  (patient_id IS NULL AND is_patients_provider(auth.uid(), provider_id))
);

-- Create index for faster queries
CREATE INDEX idx_notifications_provider ON public.notifications(provider_id);
CREATE INDEX idx_notifications_patient ON public.notifications(patient_id);
CREATE INDEX idx_notifications_status ON public.notifications(status);
CREATE INDEX idx_notifications_scheduled ON public.notifications(scheduled_at) WHERE scheduled_at IS NOT NULL;