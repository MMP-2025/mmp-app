
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
  focusVisible: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  announceToScreenReader: (message: string) => void;
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 'medium',
    reducedMotion: false,
    screenReaderAnnouncements: true,
    keyboardNavigation: true,
    voiceControl: false,
    focusVisible: true,
  });

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem('accessibility-settings', JSON.stringify({ ...settings, [key]: value }));
  };

  const announceToScreenReader = (message: string) => {
    if (!settings.screenReaderAnnouncements) return;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const toggleHighContrast = () => {
    updateSetting('highContrast', !settings.highContrast);
    announceToScreenReader(`High contrast mode ${!settings.highContrast ? 'enabled' : 'disabled'}`);
  };

  const fontSizes = ['small', 'medium', 'large', 'extra-large'] as const;
  
  const increaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(settings.fontSize);
    if (currentIndex < fontSizes.length - 1) {
      const newSize = fontSizes[currentIndex + 1];
      updateSetting('fontSize', newSize);
      announceToScreenReader(`Font size increased to ${newSize}`);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(settings.fontSize);
    if (currentIndex > 0) {
      const newSize = fontSizes[currentIndex - 1];
      updateSetting('fontSize', newSize);
      announceToScreenReader(`Font size decreased to ${newSize}`);
    }
  };

  // Keyboard shortcuts for accessibility
  useKeyboardShortcuts([
    { key: 'h', altKey: true, callback: toggleHighContrast },
    { key: '=', ctrlKey: true, callback: increaseFontSize },
    { key: '-', ctrlKey: true, callback: decreaseFontSize },
  ]);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Font size
    root.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large');
    root.classList.add(`text-${settings.fontSize}`);
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  }, [settings]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.warn('Failed to load accessibility settings:', error);
      }
    }
  }, []);

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSetting,
      announceToScreenReader,
      toggleHighContrast,
      increaseFontSize,
      decreaseFontSize,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
