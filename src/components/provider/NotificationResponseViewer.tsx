import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquareReply, Loader2, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProviderPatients } from '@/hooks/useProviderPatients';
import { format } from 'date-fns';

interface NotificationResponse {
  id: string;
  notification_id: string;
  patient_id: string;
  response: string;
  responded_at: string;
}

const NotificationResponseViewer: React.FC = () => {
  const [responses, setResponses] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { patients } = useProviderPatients();

  useEffect(() => {
    if (!user) return;
    fetchResponses();
  }, [user]);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_responses')
        .select('*')
        .order('responded_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setResponses((data || []) as unknown as NotificationResponse[]);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Unknown Patient';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareReply className="h-5 w-5" />
          Patient Responses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {responses.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <MessageSquareReply className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No responses yet.</p>
            <p className="text-xs">Patient responses to interactive notifications will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {responses.map(response => (
              <div key={response.id} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <User className="h-3 w-3" />
                    {getPatientName(response.patient_id)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(response.responded_at), 'MMM d, h:mm a')}
                  </span>
                </div>
                <Badge variant="secondary">{response.response}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationResponseViewer;
