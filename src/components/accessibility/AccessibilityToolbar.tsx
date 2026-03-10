
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
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 z-40 bg-mental-blue hover:bg-mental-blue/80 p-3 rounded-full shadow-lg"
        aria-label="Open accessibility options"
      >
        <Accessibility className="h-5 w-5" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-40 p-4 w-80 max-h-[70vh] overflow-y-auto bg-mental-peach shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">High Contrast</span>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={toggleHighContrast}
                aria-label="Toggle high contrast mode"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Font Size</span>
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

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reduced Motion</span>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                aria-label="Toggle reduced motion"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Screen Reader</span>
              </div>
              <Switch
                checked={settings.screenReaderAnnouncements}
                onCheckedChange={(checked) => updateSetting('screenReaderAnnouncements', checked)}
                aria-label="Toggle screen reader announcements"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Keyboard Navigation</span>
              </div>
              <Switch
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                aria-label="Toggle keyboard navigation"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Voice Control</span>
              </div>
              <Switch
                checked={settings.voiceControl}
                onCheckedChange={(checked) => updateSetting('voiceControl', checked)}
                aria-label="Toggle voice control"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2 text-foreground">Keyboard Shortcuts</h4>
            <div className="text-xs space-y-1 text-muted-foreground">
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
