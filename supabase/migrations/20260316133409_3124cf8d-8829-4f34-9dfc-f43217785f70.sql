
-- FIX 1: Restrict user_roles INSERT to only allow 'patient' role (prevent self-escalation)
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
CREATE POLICY "Users can insert their own patient role"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND role = 'patient'::app_role);

-- FIX 1b: Prevent users from changing their own role on profiles table
-- Create a trigger that blocks role changes by non-admin users
CREATE OR REPLACE FUNCTION public.prevent_role_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If role is being changed, only allow if the caller is an admin
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
      NEW.role := OLD.role; -- Silently revert the role change
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_role_self_update_trigger ON public.profiles;
CREATE TRIGGER prevent_role_self_update_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_update();

-- FIX 2: Remove open invitation SELECT policy and create secure RPC
DROP POLICY IF EXISTS "Anyone can view invitations with valid token for validation" ON public.patient_invitations;

-- Create a secure RPC for token validation
CREATE OR REPLACE FUNCTION public.validate_invitation(p_token text)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'valid', true,
    'patient_email', i.patient_email,
    'provider_name', p.name
  )
  FROM public.patient_invitations i
  JOIN public.profiles p ON p.id = i.provider_id
  WHERE i.token = p_token
    AND i.status = 'pending'
    AND i.expires_at > now()
  LIMIT 1;
$$;
