-- Set up demo user profiles and roles
-- Delete any orphaned profiles with demo emails (not linked to auth users)
DELETE FROM public.profiles 
WHERE email IN ('patient@demo.com', 'provider@demo.com');

-- Delete any orphaned user_roles that might reference old IDs
DELETE FROM public.user_roles 
WHERE user_id IN (
  SELECT p.id FROM public.profiles p 
  WHERE p.email IN ('patient@demo.com', 'provider@demo.com')
);

-- Insert demo patient profile
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  id,
  'Demo Patient',
  email,
  'patient'::user_role
FROM auth.users 
WHERE email = 'patient@demo.com';

-- Insert demo provider profile
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  id,
  'Demo Provider',
  email,
  'provider'::user_role
FROM auth.users 
WHERE email = 'provider@demo.com';

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