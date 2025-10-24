
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { questions as fallbackQuestions } from "@/data/homePageContent";

const DailyQuestion = () => {
  const [question, setQuestion] = useState(fallbackQuestions[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomQuestion = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        if (data && data.length > 0) {
          const today = new Date().toDateString();
          const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const index = seed % data.length;
          setQuestion(data[index].question);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomQuestion();
  }, []);

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover-card-subtle">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="rounded-full bg-primary/10 p-3 h-14 w-14" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-primary/10 rounded w-32" />
              <div className="h-3 bg-primary/10 rounded w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover-card-subtle">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Daily Question</h3>
            <p className="text-muted-foreground">{question}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyQuestion;
