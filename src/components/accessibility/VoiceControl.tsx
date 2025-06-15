
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { toast } from 'sonner';

interface VoiceCommand {
  phrase: string;
  action: () => void;
  description: string;
}

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { settings, announceToScreenReader, toggleHighContrast, increaseFontSize, decreaseFontSize } = useAccessibility();

  const commands: VoiceCommand[] = [
    {
      phrase: 'toggle high contrast',
      action: toggleHighContrast,
      description: 'Toggle high contrast mode'
    },
    {
      phrase: 'increase font size',
      action: increaseFontSize,
      description: 'Make text larger'
    },
    {
      phrase: 'decrease font size',
      action: decreaseFontSize,
      description: 'Make text smaller'
    },
    {
      phrase: 'navigate home',
      action: () => window.location.href = '/',
      description: 'Go to home page'
    },
    {
      phrase: 'navigate mood tracker',
      action: () => window.location.href = '/mood',
      description: 'Go to mood tracker'
    },
    {
      phrase: 'navigate journal',
      action: () => window.location.href = '/journal',
      description: 'Go to journal'
    },
    {
      phrase: 'navigate community',
      action: () => window.location.href = '/community',
      description: 'Go to community'
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSupported(true);
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript.toLowerCase().trim());
          processCommand(finalTranscript.toLowerCase().trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processCommand = (spokenText: string) => {
    const matchedCommand = commands.find(command => 
      spokenText.includes(command.phrase)
    );

    if (matchedCommand) {
      matchedCommand.action();
      announceToScreenReader(`Command executed: ${matchedCommand.description}`);
      toast.success(`Voice command: ${matchedCommand.description}`);
      setTranscript('');
    }
  };

  const startListening = () => {
    if (recognitionRef.current && settings.voiceControl) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
      announceToScreenReader('Voice control activated. Listening for commands.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      announceToScreenReader('Voice control stopped.');
    }
  };

  if (!settings.voiceControl || !isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        {/* Transcript Display */}
        {transcript && (
          <Badge variant="secondary" className="max-w-xs p-2 text-xs">
            "{transcript}"
          </Badge>
        )}
        
        {/* Voice Control Button */}
        <Button
          onClick={isListening ? stopListening : startListening}
          className={`p-3 rounded-full shadow-lg ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-mental-blue hover:bg-mental-blue/80'
          }`}
          aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        
        {/* Status Indicator */}
        {isListening && (
          <div className="flex items-center gap-1 text-xs bg-mental-peach px-2 py-1 rounded">
            <Volume2 className="h-3 w-3" />
            <span style={{color: '#737373'}}>Listening...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceControl;
