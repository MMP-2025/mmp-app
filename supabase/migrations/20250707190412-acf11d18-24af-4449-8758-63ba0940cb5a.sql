-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('patient', 'provider', 'guest');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient invitations table
CREATE TABLE public.patient_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_email TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired')),
  used_at TIMESTAMP WITH TIME ZONE,
  patient_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

-- Create policies for patient_invitations table
CREATE POLICY "Providers can view their own invitations" 
ON public.patient_invitations 
FOR SELECT 
USING (auth.uid()::text = provider_id::text);

CREATE POLICY "Providers can create invitations" 
ON public.patient_invitations 
FOR INSERT 
WITH CHECK (auth.uid()::text = provider_id::text);

CREATE POLICY "Providers can update their own invitations" 
ON public.patient_invitations 
FOR UPDATE 
USING (auth.uid()::text = provider_id::text);

CREATE POLICY "Anyone can view invitations with valid token for validation" 
ON public.patient_invitations 
FOR SELECT 
USING (status = 'pending' AND expires_at > now());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_patient_invitations_token ON public.patient_invitations(token);
CREATE INDEX idx_patient_invitations_provider_id ON public.patient_invitations(provider_id);
CREATE INDEX idx_patient_invitations_status ON public.patient_invitations(status);
CREATE INDEX idx_profiles_email ON public.profiles(email);