
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

interface EmergencyContact {
  name: string;
  phone: string;
}

interface EmergencyContactCardProps {
  emergencyContact: EmergencyContact;
  onEmergencyContactChange: (field: string, value: string) => void;
}

const EmergencyContactCard = ({ emergencyContact, onEmergencyContactChange }: EmergencyContactCardProps) => {
  return (
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
              onChange={(e) => onEmergencyContactChange('name', e.target.value)}
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
              onChange={(e) => onEmergencyContactChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              className="bg-mental-peach border-[#737373]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactCard;
