
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, UserPlus } from 'lucide-react';

const PatientInvitations: React.FC = () => {
  const [patientEmail, setPatientEmail] = useState('');
  const [patientName, setPatientName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendPatientInvitation } = useAuth();
  const { toast } = useToast();

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientEmail || !patientName) {
      toast({
        title: "Missing Information",
        description: "Please provide both patient name and email.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendPatientInvitation(patientEmail, patientName);
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${patientName} (${patientEmail})`,
      });
      setPatientEmail('');
      setPatientName('');
    } catch (error: any) {
      toast({
        title: "Failed to Send Invitation",
        description: error.message || "An error occurred while sending the invitation.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Invite New Patient
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendInvitation} className="space-y-4">
          <div>
            <Label htmlFor="patient-name">Patient Name</Label>
            <Input
              id="patient-name"
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient's full name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="patient-email">Patient Email</Label>
            <Input
              id="patient-email"
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="Enter patient's email address"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> The patient will receive an invitation link that expires in 7 days. 
            They must use this link to create their account.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInvitations;
