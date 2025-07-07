import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

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

      // If no profile exists, create one with default values
      if (!profile) {
        const newProfile = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          role: 'patient' as UserRole,
          email: supabaseUser.email!
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }

        setUser(newProfile);
      } else {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole
        });
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
        .from('patient_invitations')
        .select(`
          *,
          provider:profiles!patient_invitations_provider_id_fkey(name)
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        return { valid: false };
      }

      return {
        valid: true,
        email: data.patient_email,
        providerName: data.provider.name
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

      // In a real app, you would send an email here with the invitation link
      console.log(`Invitation sent to ${patientEmail} with token: ${token}`);
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

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
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

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-' + Date.now().toString(),
      name: 'Guest User',
      email: '',
      role: 'guest'
    };
    setUser(guestUser);
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
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
    sendPatientInvitation
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
