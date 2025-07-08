-- Create demo accounts in auth.users table and corresponding profiles
-- First, we need to insert demo users manually since we can't use the regular signup flow

-- Insert demo provider user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  aud,
  role
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'provider@demo.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
);

-- Insert demo patient user  
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  aud,
  role
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'patient@demo.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
);

-- Create corresponding profiles for these users
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  id,
  CASE 
    WHEN email = 'provider@demo.com' THEN 'Demo Provider'
    WHEN email = 'patient@demo.com' THEN 'Demo Patient'
  END,
  email,
  CASE 
    WHEN email = 'provider@demo.com' THEN 'provider'::user_role
    WHEN email = 'patient@demo.com' THEN 'patient'::user_role
  END
FROM auth.users 
WHERE email IN ('provider@demo.com', 'patient@demo.com');