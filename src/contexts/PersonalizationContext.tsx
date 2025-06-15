
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  notificationsEnabled: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'custom';
  favoriteFeatures: string[];
  onboardingCompleted: boolean;
  preferredMoodTrackingTime: string;
  journalPromptFrequency: 'daily' | 'weekly' | 'never';
  mindfulnessGoalMinutes: number;
}

export interface PersonalizationContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
  getRecommendations: () => string[];
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  reducedMotion: false,
  notificationsEnabled: true,
  reminderFrequency: 'daily',
  favoriteFeatures: [],
  onboardingCompleted: false,
  preferredMoodTrackingTime: '18:00',
  journalPromptFrequency: 'daily',
  mindfulnessGoalMinutes: 10
};

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export const PersonalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    // Load preferences from storage on mount
    const savedPreferences = StorageManager.load(STORAGE_KEYS.USER_PREFERENCES, defaultPreferences);
    setPreferences(savedPreferences);
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    StorageManager.save(STORAGE_KEYS.USER_PREFERENCES, newPreferences);
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    StorageManager.save(STORAGE_KEYS.USER_PREFERENCES, defaultPreferences);
  };

  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if (!preferences.onboardingCompleted) {
      recommendations.push('Complete your profile setup to get personalized recommendations');
    }
    
    if (preferences.favoriteFeatures.length === 0) {
      recommendations.push('Try exploring different features to discover what works best for you');
    }
    
    if (preferences.mindfulnessGoalMinutes < 5) {
      recommendations.push('Consider setting a mindfulness goal of at least 5 minutes per day');
    }
    
    if (preferences.journalPromptFrequency === 'never') {
      recommendations.push('Regular journaling with prompts can help with self-reflection');
    }
    
    return recommendations;
  };

  const contextValue: PersonalizationContextType = {
    preferences,
    updatePreference,
    resetPreferences,
    getRecommendations
  };

  return (
    <PersonalizationContext.Provider value={contextValue}>
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = (): PersonalizationContextType => {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};
