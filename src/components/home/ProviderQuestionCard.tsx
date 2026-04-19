import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { usePatientNotifications } from '@/hooks/usePatientNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProviderQuestionCard: React.FC = () => {
  const { notifications, loading, markAsRead, unreadCount } = usePatientNotifications();
  const { user, isGuest } = useAuth();
  const { toast } = useToast();

  // Get the latest unanswered notification with action options
  const pendingQuestion = notifications.find(
    n => n.status === 'sent' && (n.action_option_1 || n.action_option_2)
  );

  const latestQuestion = pendingQuestion || notifications.find(
    n => (n.action_option_1 || n.action_option_2)
  );

  const handleResponse = async (notificationId: string, response: string) => {
    if (isGuest || !user) {
      toast({
        title: "Guest mode",
        description: "Sign in to respond to provider questions.",
      });
      return;
    }

    try {
      await supabase.from('notification_responses').insert([{
        notification_id: notificationId,
        patient_id: user.id,
        response,
      }]);
      
      await markAsRead(notificationId);
      
      toast({
        title: "Response sent",
        description: "Your provider will see your response.",
      });
    } catch (error) {
      console.error('Error responding:', error);
      toast({
        title: "Error",
        description: "Could not send response. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-sage-light to-teal-light border-border/50 animate-pulse">
        <div className="h-20" />
      </Card>
    );
  }

  if (!latestQuestion) {
    return (
      <Card className="p-6 bg-gradient-to-br from-sage-light to-teal-light border-border/50">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-primary/10 shrink-0">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-merriweather font-semibold text-foreground mb-1">
              Provider Check-in
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No new questions from your provider. Check back later or explore the tools below.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const isAnswered = latestQuestion.status === 'read';

  return (
    <Card className="p-6 bg-gradient-to-br from-sage-light to-teal-light border-border/50 card-hero relative overflow-hidden">
      {unreadCount > 0 && (
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </div>
      )}
      
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2.5 rounded-full bg-primary/10 shrink-0">
          {isAnswered ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <MessageCircle className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-merriweather font-semibold text-foreground">
              {isAnswered ? 'Latest Check-in' : 'Your Provider Asks'}
            </h3>
            {!isAnswered && (
              <span className="flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                <Clock className="h-3 w-3" /> New
              </span>
            )}
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {latestQuestion.message}
          </p>
        </div>
      </div>

      {!isAnswered && (latestQuestion.action_option_1 || latestQuestion.action_option_2) && (
        <div className="flex gap-3 ml-12">
          {latestQuestion.action_option_1 && (
            <Button
              onClick={() => handleResponse(latestQuestion.id, latestQuestion.action_option_1!)}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              size="sm"
            >
              {latestQuestion.action_option_1}
            </Button>
          )}
          {latestQuestion.action_option_2 && (
            <Button
              onClick={() => handleResponse(latestQuestion.id, latestQuestion.action_option_2!)}
              variant="outline"
              className="flex-1 rounded-xl"
              size="sm"
            >
              {latestQuestion.action_option_2}
            </Button>
          )}
        </div>
      )}

      {isAnswered && (
        <p className="text-xs text-muted-foreground ml-12 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> You responded to this
        </p>
      )}
    </Card>
  );
};

export default ProviderQuestionCard;
