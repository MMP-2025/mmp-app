
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Accessibility, 
  Eye, 
  Type, 
  Volume2, 
  Keyboard, 
  Mic,
  Settings,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const AccessibilityToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    settings, 
    updateSetting, 
    toggleHighContrast, 
    increaseFontSize, 
    decreaseFontSize 
  } = useAccessibility();

  const fontSizeLabels = {
    small: 'Small',
    medium: 'Medium', 
    large: 'Large',
    'extra-large': 'Extra Large'
  };

  return (
    <>
      {/* Accessibility Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-mental-blue hover:bg-mental-blue/80 p-3 rounded-full shadow-lg"
        aria-label="Open accessibility options"
      >
        <Accessibility className="h-5 w-5" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <Card className="fixed top-16 right-4 z-50 p-4 w-80 bg-mental-peach shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{color: '#737373'}}>
              <Settings className="h-5 w-5" />
              Accessibility Options
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close accessibility options"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" style={{color: '#737373'}} />
                <span className="text-sm" style={{color: '#737373'}}>High Contrast</span>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={toggleHighContrast}
                aria-label="Toggle high contrast mode"
              />
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" style={{color: '#737373'}} />
                <span className="text-sm" style={{color: '#737373'}}>Font Size</span>
                <Badge variant="secondary" className="text-xs">
                  {fontSizeLabels[settings.fontSize]}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={decreaseFontSize}
                  disabled={settings.fontSize === 'small'}
                  aria-label="Decrease font size"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={increaseFontSize}
                  disabled={settings.fontSize === 'extra-large'}
                  aria-label="Increase font size"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{color: '#737373'}}>Reduced Motion</span>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                aria-label="Toggle reduced motion"
              />
            </div>

            {/* Screen Reader Announcements */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" style={{color: '#737373'}} />
                <span className="text-sm" style={{color: '#737373'}}>Screen Reader</span>
              </div>
              <Switch
                checked={settings.screenReaderAnnouncements}
                onCheckedChange={(checked) => updateSetting('screenReaderAnnouncements', checked)}
                aria-label="Toggle screen reader announcements"
              />
            </div>

            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" style={{color: '#737373'}} />
                <span className="text-sm" style={{color: '#737373'}}>Keyboard Navigation</span>
              </div>
              <Switch
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                aria-label="Toggle keyboard navigation"
              />
            </div>

            {/* Voice Control */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" style={{color: '#737373'}} />
                <span className="text-sm" style={{color: '#737373'}}>Voice Control</span>
              </div>
              <Switch
                checked={settings.voiceControl}
                onCheckedChange={(checked) => updateSetting('voiceControl', checked)}
                aria-label="Toggle voice control"
              />
            </div>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-2" style={{color: '#737373'}}>Keyboard Shortcuts</h4>
            <div className="text-xs space-y-1" style={{color: '#737373'}}>
              <div>Alt + H: Toggle high contrast</div>
              <div>Ctrl + +: Increase font size</div>
              <div>Ctrl + -: Decrease font size</div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AccessibilityToolbar;
