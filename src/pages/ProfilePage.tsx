
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, User, Bell, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PersonalInfoCard from '@/components/profile/PersonalInfoCard';
import NotificationPreferencesCard from '@/components/profile/NotificationPreferencesCard';
import { PageTransition, StaggeredList } from '@/components/ui/animated';

const ProfilePage = () => {
  const [personalInfo, setPersonalInfo] = useState({
    username: '',
    email: '',
  });

  const [notifications, setNotifications] = useState({
    moodReminders: true,
    journalReminders: true,
    appointmentReminders: true,
    crisisAlerts: true,
  });

  const { toast } = useToast();

  const handlePersonalInfoChange = (
    field: 'username' | 'email',
    value: string
  ) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (
    field: keyof typeof notifications,
    value: boolean
  ) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    toast({
      title: 'Profile saved successfully',
      description: 'Your information has been updated.',
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <h1 className="text-2xl font-merriweather font-bold text-foreground mb-1">Your Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and preferences.
          </p>
        </div>

        <StaggeredList baseDelay={100} increment={100} className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">Personal Information</h2>
            </div>
            <PersonalInfoCard
              personalInfo={personalInfo}
              onPersonalInfoChange={handlePersonalInfoChange}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">Notification Preferences</h2>
            </div>
            <NotificationPreferencesCard
              notifications={notifications}
              onNotificationChange={handleNotificationChange}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">Privacy & Data</h2>
            </div>
            <div className="p-5 rounded-xl border bg-card shadow-card">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is private and securely stored. Only your provider can see responses you submit to their questions. You can request a data export at any time.
              </p>
            </div>
          </div>
        </StaggeredList>

        <div className="flex justify-end pt-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <Button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 rounded-xl shadow-card-hover"
          >
            <Save className="h-4 w-4" />
            Save Profile
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
