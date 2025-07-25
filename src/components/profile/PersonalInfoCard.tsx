
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface PersonalInfoData {
  username: string;
  email: string;
}

interface PersonalInfoCardProps {
  personalInfo: PersonalInfoData;
  onPersonalInfoChange: (field: keyof PersonalInfoData, value: string) => void;
}

const PersonalInfoCard = ({ personalInfo, onPersonalInfoChange }: PersonalInfoCardProps) => {
  return (
    <Card className="bg-mental-gray">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#737373]">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={personalInfo.username}
              onChange={(e) => onPersonalInfoChange('username', e.target.value)}
              placeholder="Enter your username"
              className="bg-mental-gray border-[#737373]"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => onPersonalInfoChange('email', e.target.value)}
              placeholder="your.email@example.com"
              className="bg-mental-gray border-[#737373]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
