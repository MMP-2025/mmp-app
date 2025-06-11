
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PersonalInfoCard from '@/components/profile/PersonalInfoCard';
import EmergencyContactCard from '@/components/profile/EmergencyContactCard';
import NotificationPreferencesCard from '@/components/profile/NotificationPreferencesCard';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bio: '',
    timezone: '',
    preferredTheme: 'light',
    notifications: {
      moodReminders: true,
      journalReminders: true,
      appointmentReminders: true,
      crisisAlerts: true
    }
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: ''
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setEmergencyContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to a database
    toast({
      title: "Profile saved successfully",
      description: "Your information has been updated.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#737373] mb-2">User Profile</h1>
        <p className="text-[#737373]">Manage your personal information and preferences.</p>
      </div>

      <PersonalInfoCard 
        profile={profile} 
        onInputChange={handleInputChange} 
      />

      <EmergencyContactCard 
        emergencyContact={emergencyContact}
        onEmergencyContactChange={handleEmergencyContactChange}
      />

      <NotificationPreferencesCard 
        notifications={profile.notifications}
        onNotificationChange={handleNotificationChange}
      />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
