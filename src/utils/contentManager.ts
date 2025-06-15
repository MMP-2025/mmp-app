
import { StorageManager, STORAGE_KEYS } from './storage';

export interface ContentItem {
  id: string;
  type: 'quote' | 'journal_prompt' | 'mindfulness_exercise' | 'article' | 'tip';
  title: string;
  content: string;
  author?: string;
  category: string;
  tags: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // in minutes
  rating: number;
  ratingCount: number;
  seasonal?: string[];
  contextual?: string[];
  userGenerated: boolean;
  submittedBy?: string;
  submittedAt?: number;
  approved: boolean;
}

export interface ContentRating {
  contentId: string;
  userId: string;
  rating: number;
  feedback?: string;
  timestamp: number;
}

export interface SeasonalContent {
  season: 'spring' | 'summer' | 'fall' | 'winter';
  holidays: string[];
  themes: string[];
}

class ContentManager {
  private content: ContentItem[] = [];
  private ratings: ContentRating[] = [];
  
  constructor() {
    this.loadContent();
    this.loadRatings();
  }

  private loadContent(): void {
    const savedContent = StorageManager.load<ContentItem[]>('content_library', []);
    this.content = [...savedContent, ...this.getDefaultContent()];
  }

  private loadRatings(): void {
    this.ratings = StorageManager.load<ContentRating[]>('content_ratings', []);
  }

  private saveContent(): void {
    StorageManager.save('content_library', this.content);
  }

  private saveRatings(): void {
    StorageManager.save('content_ratings', this.ratings);
  }

  private getDefaultContent(): ContentItem[] {
    return [
      {
        id: 'quote_mindful_1',
        type: 'quote',
        title: 'Mindful Presence',
        content: 'The present moment is the only time over which we have dominion.',
        author: 'Thich Nhat Hanh',
        category: 'mindfulness',
        tags: ['presence', 'awareness', 'peace'],
        rating: 4.8,
        ratingCount: 24,
        seasonal: ['all'],
        contextual: ['stress', 'anxiety'],
        userGenerated: false,
        approved: true
      },
      {
        id: 'prompt_gratitude_1',
        type: 'journal_prompt',
        title: 'Daily Gratitude Reflection',
        content: 'Write about three things that happened today that you are grateful for, no matter how small.',
        category: 'gratitude',
        tags: ['gratitude', 'reflection', 'positivity'],
        rating: 4.6,
        ratingCount: 18,
        seasonal: ['all'],
        contextual: ['low_mood', 'stress'],
        userGenerated: false,
        approved: true
      },
      {
        id: 'exercise_breathing_1',
        type: 'mindfulness_exercise',
        title: '4-7-8 Breathing Technique',
        content: 'Inhale for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat 4 times.',
        category: 'breathing',
        tags: ['breathing', 'anxiety', 'relaxation'],
        difficulty: 'beginner',
        duration: 5,
        rating: 4.7,
        ratingCount: 32,
        seasonal: ['all'],
        contextual: ['anxiety', 'stress', 'insomnia'],
        userGenerated: false,
        approved: true
      },
      {
        id: 'tip_seasonal_winter',
        type: 'tip',
        title: 'Winter Wellness Tip',
        content: 'Combat seasonal blues by maximizing natural light exposure. Sit near windows during the day and consider a light therapy lamp.',
        category: 'seasonal_wellness',
        tags: ['winter', 'seasonal', 'light_therapy'],
        rating: 4.3,
        ratingCount: 15,
        seasonal: ['winter'],
        contextual: ['low_mood', 'seasonal_depression'],
        userGenerated: false,
        approved: true
      }
    ];
  }

  // Content retrieval methods
  getContentByType(type: ContentItem['type']): ContentItem[] {
    return this.content.filter(item => item.type === type && item.approved);
  }

  getContentByCategory(category: string): ContentItem[] {
    return this.content.filter(item => item.category === category && item.approved);
  }

  getSeasonalContent(): ContentItem[] {
    const currentSeason = this.getCurrentSeason();
    return this.content.filter(item => 
      item.seasonal?.includes(currentSeason) || item.seasonal?.includes('all')
    );
  }

  getContextualContent(context: string[]): ContentItem[] {
    return this.content.filter(item => 
      item.contextual?.some(ctx => context.includes(ctx)) && item.approved
    );
  }

  getTopRatedContent(limit: number = 10): ContentItem[] {
    return this.content
      .filter(item => item.approved)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getUserGeneratedContent(): ContentItem[] {
    return this.content.filter(item => item.userGenerated && item.approved);
  }

  // Content submission methods
  submitUserContent(content: Omit<ContentItem, 'id' | 'rating' | 'ratingCount' | 'userGenerated' | 'approved' | 'submittedAt'>): string {
    const newContent: ContentItem = {
      ...content,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      rating: 0,
      ratingCount: 0,
      userGenerated: true,
      approved: false, // Requires approval
      submittedAt: Date.now()
    };

    this.content.push(newContent);
    this.saveContent();
    return newContent.id;
  }

  // Rating methods
  rateContent(contentId: string, userId: string, rating: number, feedback?: string): void {
    // Remove existing rating from this user for this content
    this.ratings = this.ratings.filter(r => !(r.contentId === contentId && r.userId === userId));
    
    // Add new rating
    this.ratings.push({
      contentId,
      userId,
      rating,
      feedback,
      timestamp: Date.now()
    });

    // Update content rating
    this.updateContentRating(contentId);
    this.saveRatings();
  }

  private updateContentRating(contentId: string): void {
    const contentRatings = this.ratings.filter(r => r.contentId === contentId);
    const content = this.content.find(c => c.id === contentId);
    
    if (content && contentRatings.length > 0) {
      const avgRating = contentRatings.reduce((sum, r) => sum + r.rating, 0) / contentRatings.length;
      content.rating = Math.round(avgRating * 10) / 10;
      content.ratingCount = contentRatings.length;
      this.saveContent();
    }
  }

  getContentRatings(contentId: string): ContentRating[] {
    return this.ratings.filter(r => r.contentId === contentId);
  }

  // Utility methods
  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  }

  searchContent(query: string): ContentItem[] {
    const lowercaseQuery = query.toLowerCase();
    return this.content.filter(item => 
      item.approved && (
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.content.toLowerCase().includes(lowercaseQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        item.category.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  getContentRecommendations(userMoodHistory: any[], userPreferences: string[] = []): ContentItem[] {
    // Analyze recent mood patterns
    const recentMoods = userMoodHistory.slice(0, 7);
    const avgMood = recentMoods.reduce((sum: number, entry: any) => sum + entry.intensity, 0) / recentMoods.length;
    
    let context: string[] = [];
    
    if (avgMood < 5) {
      context.push('low_mood', 'stress');
    }
    if (avgMood > 7) {
      context.push('happiness', 'gratitude');
    }
    
    // Add user preferences to context
    context = [...context, ...userPreferences];
    
    // Get contextual and seasonal content
    const contextualContent = this.getContextualContent(context);
    const seasonalContent = this.getSeasonalContent();
    
    // Combine and rank
    const recommendations = [...new Set([...contextualContent, ...seasonalContent])]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
    
    return recommendations;
  }
}

export const contentManager = new ContentManager();
