
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PersonalInfoCard from '@/components/profile/PersonalInfoCard';
import NotificationPreferencesCard from '@/components/profile/NotificationPreferencesCard';


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
    // In a real app, this would save to a database
    // const fullProfile = { ...personalInfo, notifications };
    // console.log("Saving profile", fullProfile);
    toast({
      title: 'Profile saved successfully',
      description: 'Your information has been updated.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-muted-foreground mb-2">User Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <PersonalInfoCard
        personalInfo={personalInfo}
        onPersonalInfoChange={handlePersonalInfoChange}
      />

      <NotificationPreferencesCard
        notifications={notifications}
        onNotificationChange={handleNotificationChange}
      />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          className="flex items-center gap-2 bg-mental-blue hover:bg-mental-blue/80 text-gray-800"
        >
          <Save className="h-4 w-4" />
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
