
import { UserBehavior, PersonalizedContent } from '@/types/personalization';

const quotes = [
  {
    quote: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
    author: "Alan Watts",
    category: "mindfulness",
    keywords: ["change", "mindfulness", "acceptance"]
  },
  {
    quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "motivation",
    keywords: ["strength", "inner peace", "resilience"]
  },
  {
    quote: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "inner peace",
    keywords: ["peace", "meditation", "self-discovery"]
  },
  {
    quote: "The present moment is the only time over which we have dominion.",
    author: "Thich Nhat Hanh",
    category: "mindfulness",
    keywords: ["present", "mindfulness", "awareness"]
  },
  {
    quote: "You have been assigned this mountain to show others it can be moved.",
    author: "Mel Robbins",
    category: "motivation",
    keywords: ["challenge", "strength", "inspiration"]
  }
];

export const getPersonalizedQuote = (userBehavior: UserBehavior | null): PersonalizedContent => {
  if (!userBehavior) {
    return { ...quotes[0], relevanceScore: 0.5 };
  }

  // Score quotes based on user behavior
  const scoredQuotes = quotes.map(quote => {
    let score = 0.5; // Base score

    // Boost based on most used features
    if (userBehavior.mostUsedFeatures.includes('mindfulness') && quote.category === 'mindfulness') {
      score += 0.3;
    }
    if (userBehavior.mostUsedFeatures.includes('mood') && quote.category === 'motivation') {
      score += 0.2;
    }

    // Boost based on recent mood patterns
    const recentMoods = userBehavior.moodPatterns.slice(-5);
    const hasStrugglingMoods = recentMoods.some(p => ['Sad', 'Angry'].includes(p.mood));
    if (hasStrugglingMoods && quote.category === 'motivation') {
      score += 0.4;
    }

    return { ...quote, relevanceScore: Math.min(score, 1.0) };
  });

  // Return highest scoring quote
  const bestQuote = scoredQuotes.sort((a, b) => b.relevanceScore - a.relevanceScore)[0];
  return bestQuote;
};
