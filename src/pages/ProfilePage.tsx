
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, Calendar, MapPin, Heart, Camera, Save, FileText, Shield, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

      {/* Profile Picture & Basic Info */}
      <Card className="bg-mental-gray">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#737373]">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt="Profile picture" />
                <AvatarFallback className="text-lg">
                  {profile.firstName[0]}{profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                onClick={() => toast({ title: "Photo Upload", description: "Photo upload functionality would be implemented here" })}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter your username"
                  className="bg-mental-gray border-[#737373]"
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  className="bg-mental-gray border-[#737373]"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  className="bg-mental-gray border-[#737373]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="bg-mental-gray border-[#737373]"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="bg-mental-gray border-[#737373]"
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="bg-mental-gray border-[#737373]"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={profile.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                <SelectTrigger className="bg-mental-gray border-[#737373]">
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                  <SelectItem value="CST">Central Time (CST)</SelectItem>
                  <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                  <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="bio">About Me</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us a bit about yourself, your goals, or anything you'd like to share..."
              rows={4}
              className="bg-mental-gray border-[#737373]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact - Separate Section */}
      <Card className="bg-mental-peach">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#737373]">
            <Shield className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
              <Input
                id="emergencyContact"
                value={emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                placeholder="Contact person's name"
                className="bg-mental-peach border-[#737373]"
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="bg-mental-peach border-[#737373]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-mental-blue">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#737373]">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'moodReminders', label: 'Mood tracking reminders', icon: Heart },
            { key: 'journalReminders', label: 'Journal writing reminders', icon: FileText },
            { key: 'appointmentReminders', label: 'Appointment reminders', icon: Calendar },
            { key: 'crisisAlerts', label: 'Crisis resource alerts', icon: Shield }
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg border-[#737373]">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-[#737373]" />
                <span className="text-[#737373]">{label}</span>
              </div>
              <Button
                variant={profile.notifications[key as keyof typeof profile.notifications] ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotificationChange(key, !profile.notifications[key as keyof typeof profile.notifications])}
              >
                {profile.notifications[key as keyof typeof profile.notifications] ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

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
