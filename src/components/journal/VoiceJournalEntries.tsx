
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { StorageManager } from '@/utils/storage';
import { Mic, MicOff, Play, Pause, Save, Trash2, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceJournalEntry {
  id: string;
  date: string;
  title: string;
  transcript: string;
  audioBlob?: Blob;
  audioUrl?: string;
  duration: number;
  timestamp: number;
  tags: string[];
  isVoiceEntry: boolean;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
}

const VoiceJournalEntries: React.FC = () => {
  const [entries, setEntries] = useState<VoiceJournalEntry[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentTags, setCurrentTags] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null
  });
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadEntries();
    checkSpeechSupport();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (recordingState.audioUrl) URL.revokeObjectURL(recordingState.audioUrl);
    };
  }, []);

  const loadEntries = () => {
    const savedEntries = StorageManager.load<VoiceJournalEntry[]>('voice_journal_entries', []);
    setEntries(savedEntries);
  };

  const checkSpeechSupport = () => {
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setSpeechSupported(isSupported);
    
    if (isSupported) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setCurrentTranscript(prev => {
          const newTranscript = prev + finalTranscript;
          return newTranscript;
        });
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Speech recognition error. Please try again.');
      };
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordingState(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false
        }));
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      
      // Start speech recognition if supported
      if (speechSupported && recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0
      }));
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);
      
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    if (speechSupported && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    toast.success('Recording stopped');
  };

  const playAudio = (audioUrl: string, entryId: string) => {
    if (isPlaying === entryId) {
      audioRef.current?.pause();
      setIsPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(entryId);
      
      audioRef.current.onended = () => {
        setIsPlaying(null);
      };
    }
  };

  const saveEntry = () => {
    if (!currentTitle.trim() && !currentTranscript.trim()) {
      toast.error('Please add a title or transcript');
      return;
    }

    const newEntry: VoiceJournalEntry = {
      id: `voice_entry_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: currentTitle.trim() || 'Voice Entry',
      transcript: currentTranscript.trim(),
      duration: recordingState.duration,
      timestamp: Date.now(),
      tags: currentTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isVoiceEntry: true,
      audioUrl: recordingState.audioUrl || undefined
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    StorageManager.save('voice_journal_entries', updatedEntries);

    // Reset form
    setCurrentTitle('');
    setCurrentTranscript('');
    setCurrentTags('');
    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null
    });

    toast.success('Voice journal entry saved!');
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    StorageManager.save('voice_journal_entries', updatedEntries);
    toast.success('Entry deleted');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex items-center gap-2 mb-4">
          <Mic className="h-5 w-5" style={{color: '#737373'}} />
          <h3 className="text-xl font-semibold" style={{color: '#737373'}}>Voice Journal Entries</h3>
        </div>
        
        <p className="mb-4" style={{color: '#737373'}}>
          Record your thoughts with voice and automatically transcribe them to text
        </p>

        {!speechSupported && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Speech recognition is not supported in your browser. You can still record audio, but automatic transcription won't be available.
            </p>
          </div>
        )}

        {/* Recording Interface */}
        <Card className="p-4 mb-6 bg-mental-peach/20">
          <h4 className="font-semibold mb-4" style={{color: '#737373'}}>New Voice Entry</h4>
          
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>Title (Optional)</Label>
              <input
                type="text"
                placeholder="Give your entry a title..."
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
              {!recordingState.isRecording ? (
                <div className="text-center">
                  <Button
                    onClick={startRecording}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 mb-2"
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                  <p className="text-sm" style={{color: '#737373'}}>
                    Click to start recording
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 mb-2 animate-pulse"
                  >
                    <MicOff className="h-6 w-6" />
                  </Button>
                  <p className="text-sm font-semibold text-red-600 mb-2">
                    Recording... {formatDuration(recordingState.duration)}
                  </p>
                  <p className="text-xs" style={{color: '#737373'}}>
                    Click to stop recording
                  </p>
                </div>
              )}
            </div>

            {recordingState.audioUrl && (
              <div className="flex items-center justify-center gap-2 p-3 bg-mental-blue/20 rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => playAudio(recordingState.audioUrl!, 'preview')}
                >
                  {isPlaying === 'preview' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="text-sm" style={{color: '#737373'}}>
                  Preview Recording ({formatDuration(recordingState.duration)})
                </span>
              </div>
            )}

            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>
                Transcript {speechSupported ? '(Auto-generated)' : '(Manual)'}
              </Label>
              <Textarea
                placeholder={speechSupported ? "Transcript will appear here automatically..." : "Type your thoughts here..."}
                value={currentTranscript}
                onChange={(e) => setCurrentTranscript(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div>
              <Label className="mb-2 block" style={{color: '#737373'}}>Tags (comma-separated)</Label>
              <input
                type="text"
                placeholder="reflection, gratitude, goals..."
                value={currentTags}
                onChange={(e) => setCurrentTags(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <Button
              onClick={saveEntry}
              disabled={!currentTitle.trim() && !currentTranscript.trim()}
              className="w-full bg-mental-green hover:bg-mental-green/80"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Voice Entry
            </Button>
          </div>
        </Card>

        {/* Entries List */}
        <div>
          <h4 className="font-semibold mb-4" style={{color: '#737373'}}>Your Voice Entries</h4>
          {entries.length === 0 ? (
            <p style={{color: '#737373'}}>No voice entries yet. Start recording to create your first entry!</p>
          ) : (
            <div className="space-y-3">
              {entries.map(entry => (
                <div key={entry.id} className="border rounded-lg p-4 bg-mental-peach/10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold" style={{color: '#737373'}}>{entry.title}</h5>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatDate(entry.timestamp)}</span>
                        <Badge variant="outline" className="text-xs">
                          Voice Entry
                        </Badge>
                        {entry.duration > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {formatDuration(entry.duration)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {entry.audioUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playAudio(entry.audioUrl!, entry.id)}
                        >
                          {isPlaying === entry.id ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {entry.transcript && (
                    <div className="mb-3">
                      <p className="text-sm leading-relaxed" style={{color: '#737373'}}>
                        {entry.transcript}
                      </p>
                    </div>
                  )}

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VoiceJournalEntries;
