import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { analytics } from '@/utils/analytics';
import { identifyUser, resetAnalyticsIdentity, trackEvent } from '@/utils/trackEvent';

export type UserRole = 'patient' | 'provider' | 'guest';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, invitationToken?: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isProvider: boolean;
  isPatient: boolean;
  isGuest: boolean;
  loading: boolean;
  validateInvitation: (token: string) => Promise<{ valid: boolean; email?: string; providerName?: string }>;
  sendPatientInvitation: (patientEmail: string, patientName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate guest session from localStorage so guests aren't kicked
    // back to the login screen on reload / re-entry.
    try {
      const storedGuest = localStorage.getItem('guest_user');
      if (storedGuest) {
        const parsed = JSON.parse(storedGuest) as User;
        if (parsed?.role === 'guest') {
          setUser(parsed);
          identifyUser(parsed.id, 'guest');
        }
      }
    } catch {
      // ignore parse errors
    }

    // Listen for auth changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        // Defer profile fetching to avoid blocking auth state updates
        if (session?.user) {
          // A real auth session takes precedence over a stored guest.
          localStorage.removeItem('guest_user');
          setTimeout(() => {
            fetchUserProfile(session.user);
          }, 0);
        } else {
          // Don't clobber a hydrated guest user when no Supabase session exists.
          setUser((current) => (current?.role === 'guest' ? current : null));
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      // Do NOT silently auto-create a profile with role 'patient' — that
      // would let any future SSO/sign-in path bypass the invitation gate.
      // Profiles are created during the explicit register() flow.
      if (!profile) {
        console.warn('No profile found for authenticated user; signing out.');
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      } else {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole
        });
        identifyUser(profile.id, profile.role);
        trackEvent('user_logged_in');
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateInvitation = async (token: string) => {
    try {
      const { data, error } = await supabase
        .rpc('validate_invitation', { p_token: token });

      if (error || !data) {
        return { valid: false };
      }

      const result = data as { valid: boolean; patient_email: string; provider_name: string };
      return {
        valid: true,
        email: result.patient_email,
        providerName: result.provider_name
      };
    } catch (error) {
      console.error('Error validating invitation:', error);
      return { valid: false };
    }
  };

  const sendPatientInvitation = async (patientEmail: string, patientName: string) => {
    if (!user || user.role !== 'provider') {
      throw new Error('Only providers can send invitations');
    }

    try {
      // Generate a unique token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      const { error } = await supabase
        .from('patient_invitations')
        .insert([
          {
            provider_id: user.id,
            patient_email: patientEmail,
            patient_name: patientName,
            token,
            expires_at: expiresAt.toISOString(),
            status: 'pending'
          }
        ]);

      if (error) throw error;

      // In production, send an email with the invitation link via a secure edge function
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole, invitationToken?: string) => {
    setLoading(true);
    try {
      // If registering as a patient, validate the invitation token
      if (role === 'patient') {
        if (!invitationToken) {
          throw new Error('Invitation token is required for patient registration');
        }

        const invitationResult = await validateInvitation(invitationToken);
        if (!invitationResult.valid) {
          throw new Error('Invalid or expired invitation token');
        }

        if (invitationResult.email !== email) {
          throw new Error('Email does not match the invitation');
        }
      }

      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              role
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw new Error('Failed to create user profile');
        }

        // Sync role to user_roles table for RLS policies
        const appRole = role === 'provider' ? 'provider' : role === 'patient' ? 'patient' : 'guest';
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([
            {
              user_id: data.user.id,
              role: appRole
            }
          ]);

        if (roleError) {
          console.error('Error creating user role:', roleError);
        }

        // If patient registration with invitation, mark invitation as used
        if (role === 'patient' && invitationToken) {
          await supabase
            .from('patient_invitations')
            .update({
              status: 'used',
              used_at: new Date().toISOString(),
              patient_id: data.user.id
            })
            .eq('token', invitationToken);
        }
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const loginAsGuest = () => {
    // Stable guest id — many hooks/local-storage keys assume this exact
    // value (see project memory: "Guests have ID `guest-123`").
    const guestUser: User = {
      id: 'guest-123',
      name: 'Guest User',
      email: '',
      role: 'guest'
    };
    setUser(guestUser);
    try {
      localStorage.setItem('guest_user', JSON.stringify(guestUser));
    } catch {
      // storage may be unavailable (private mode); session stays in-memory
    }
    identifyUser(guestUser.id, 'guest');
    trackEvent('guest_session_started');
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Guests have no Supabase session — just clear local state.
      const wasGuest = user?.role === 'guest';
      if (!wasGuest) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      try {
        localStorage.removeItem('guest_user');
      } catch {
        // ignore
      }
      setUser(null);
      // Clear local analytics so previous user's data isn't visible on shared devices
      analytics.clearAnalytics();
      trackEvent('user_logged_out');
      resetAnalyticsIdentity();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    loginAsGuest,
    logout,
    isAuthenticated: !!user,
    isProvider: user?.role === 'provider',
    isPatient: user?.role === 'patient',
    isGuest: user?.role === 'guest',
    loading,
    validateInvitation,
    sendPatientInvitation,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
