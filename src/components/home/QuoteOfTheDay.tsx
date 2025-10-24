
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { quotes as fallbackQuotes } from "@/data/homePageContent";

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState(fallbackQuotes[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomQuote = async () => {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        if (data && data.length > 0) {
          const today = new Date().toDateString();
          const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const index = seed % data.length;
          setQuote({ text: data[index].text, author: data[index].author });
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomQuote();
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
              <div className="h-3 bg-primary/10 rounded w-24" />
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
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Quote of the Day</h3>
            <blockquote className="italic text-muted-foreground mb-2">
              "{quote.text}"
            </blockquote>
            <cite className="text-sm text-muted-foreground not-italic">
              — {quote.author}
            </cite>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteOfTheDay;
