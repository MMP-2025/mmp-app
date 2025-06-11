
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bio: string;
  timezone: string;
}

interface PersonalInfoCardProps {
  profile: ProfileData;
  onInputChange: (field: string, value: string) => void;
}

const PersonalInfoCard = ({ profile, onInputChange }: PersonalInfoCardProps) => {
  const { toast } = useToast();

  return (
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
                onChange={(e) => onInputChange('username', e.target.value)}
                placeholder="Enter your username"
                className="bg-mental-gray border-[#737373]"
              />
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                className="bg-mental-gray border-[#737373]"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
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
              onChange={(e) => onInputChange('email', e.target.value)}
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
              onChange={(e) => onInputChange('phone', e.target.value)}
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
              onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
              className="bg-mental-gray border-[#737373]"
            />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={profile.timezone} onValueChange={(value) => onInputChange('timezone', value)}>
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
            onChange={(e) => onInputChange('bio', e.target.value)}
            placeholder="Tell us a bit about yourself, your goals, or anything you'd like to share..."
            rows={4}
            className="bg-mental-gray border-[#737373]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
