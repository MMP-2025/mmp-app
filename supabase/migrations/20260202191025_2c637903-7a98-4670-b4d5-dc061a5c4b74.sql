-- Set up demo user profiles and roles
-- Run this AFTER creating the auth users in Supabase dashboard:
-- patient@demo.com / password123
-- provider@demo.com / password123

-- Insert demo patient profile (using auth.users email lookup)
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  id,
  'Demo Patient',
  email,
  'patient'::user_role
FROM auth.users 
WHERE email = 'patient@demo.com'
ON CONFLICT (id) DO NOTHING;

-- Insert demo provider profile
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  id,
  'Demo Provider',
  email,
  'provider'::user_role
FROM auth.users 
WHERE email = 'provider@demo.com'
ON CONFLICT (id) DO NOTHING;

-- Insert patient role into user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id,
  'patient'::app_role
FROM auth.users 
WHERE email = 'patient@demo.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert provider role into user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id,
  'provider'::app_role
FROM auth.users 
WHERE email = 'provider@demo.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Create patient-provider relationship for demo accounts
INSERT INTO public.patient_provider_relationships (patient_id, provider_id, status)
SELECT 
  p.id as patient_id,
  pr.id as provider_id,
  'active'
FROM auth.users p
CROSS JOIN auth.users pr
WHERE p.email = 'patient@demo.com' 
  AND pr.email = 'provider@demo.com'
ON CONFLICT DO NOTHING;