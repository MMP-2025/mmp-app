
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Timer, Play, Pause, RotateCcw, Bell, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TimerPage = () => {
  // Pomodoro timer
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [isPomodoroPaused, setIsPomodoroPaused] = useState(true);
  
  // Countdown timer
  const [countdownMinutes, setCountdownMinutes] = useState<number>(5);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);
  const [countdownTotalSeconds, setCountdownTotalSeconds] = useState<number>(300);
  const [isCountdownPaused, setIsCountdownPaused] = useState(true);
  
  // Stopwatch
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchPaused, setIsStopwatchPaused] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Pomodoro timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isPomodoroPaused) {
      interval = setInterval(() => {
        if (pomodoroSeconds === 0) {
          if (pomodoroMinutes === 0) {
            clearInterval(interval);
            setIsPomodoroPaused(true);
            if (audioRef.current) {
              audioRef.current.play();
            }
            toast.success('Pomodoro completed!');
          } else {
            setPomodoroMinutes(pomodoroMinutes - 1);
            setPomodoroSeconds(59);
          }
        } else {
          setPomodoroSeconds(pomodoroSeconds - 1);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPomodoroPaused, pomodoroMinutes, pomodoroSeconds]);
  
  // Countdown timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isCountdownPaused) {
      interval = setInterval(() => {
        if (countdownTotalSeconds <= 1) {
          clearInterval(interval);
          setCountdownTotalSeconds(0);
          setCountdownMinutes(0);
          setCountdownSeconds(0);
          setIsCountdownPaused(true);
          if (audioRef.current) {
            audioRef.current.play();
          }
          toast.success('Countdown completed!');
        } else {
          setCountdownTotalSeconds(prev => prev - 1);
          const mins = Math.floor((countdownTotalSeconds - 1) / 60);
          const secs = (countdownTotalSeconds - 1) % 60;
          setCountdownMinutes(mins);
          setCountdownSeconds(secs);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isCountdownPaused, countdownTotalSeconds]);
  
  // Stopwatch logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isStopwatchPaused) {
      interval = setInterval(() => {
        setStopwatchTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isStopwatchPaused]);
  
  // Reset pomodoro timer
  const resetPomodoro = () => {
    setPomodoroMinutes(25);
    setPomodoroSeconds(0);
    setIsPomodoroPaused(true);
  };
  
  // Reset countdown timer
  const resetCountdown = () => {
    setCountdownMinutes(5);
    setCountdownSeconds(0);
    setCountdownTotalSeconds(300);
    setIsCountdownPaused(true);
  };
  
  // Set custom countdown time
  const setCustomCountdown = (mins: number) => {
    setCountdownMinutes(mins);
    setCountdownSeconds(0);
    setCountdownTotalSeconds(mins * 60);
    setIsCountdownPaused(true);
  };
  
  // Reset stopwatch
  const resetStopwatch = () => {
    setStopwatchTime(0);
    setIsStopwatchPaused(true);
  };
  
  // Format time functions
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const formatStopwatchTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Timer</h1>
        <p className="text-muted-foreground">Track time for productivity and mindfulness</p>
      </div>
      
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" />
      
      <Tabs defaultValue="pomodoro" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="countdown">Countdown</TabsTrigger>
          <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
        </TabsList>
        
        {/* Pomodoro Timer Tab */}
        <TabsContent value="pomodoro">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Timer className="mr-2 h-5 w-5" />
                Pomodoro Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold font-mono">
                  {formatTime(pomodoroMinutes, pomodoroSeconds)}
                </div>
                <p className="text-muted-foreground mt-2">
                  Focus for 25 minutes, then take a short break
                </p>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant={isPomodoroPaused ? "default" : "outline"}
                  onClick={() => setIsPomodoroPaused(!isPomodoroPaused)}
                >
                  {isPomodoroPaused ? (
                    <><Play className="mr-2 h-4 w-4" /> Start</>
                  ) : (
                    <><Pause className="mr-2 h-4 w-4" /> Pause</>
                  )}
                </Button>
                <Button variant="outline" onClick={resetPomodoro}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
              
              <div className="p-4 bg-mental-green/10 rounded-md mt-6">
                <h3 className="font-medium mb-2">Pomodoro Technique</h3>
                <p className="text-sm text-muted-foreground">
                  The Pomodoro Technique is a time management method that uses a timer to break work into intervals, 
                  traditionally 25 minutes in length, separated by short breaks. Each interval is known as a pomodoro.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Countdown Timer Tab */}
        <TabsContent value="countdown">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Countdown Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold font-mono">
                  {formatTime(countdownMinutes, countdownSeconds)}
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCustomCountdown(1)}
                  className="text-sm"
                >
                  1 min
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCustomCountdown(5)}
                  className="text-sm"
                >
                  5 min
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCustomCountdown(10)}
                  className="text-sm"
                >
                  10 min
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCustomCountdown(15)}
                  className="text-sm"
                >
                  15 min
                </Button>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label>Custom Time (minutes):</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[countdownMinutes]}
                    min={1}
                    max={60}
                    step={1}
                    onValueChange={(value) => {
                      if (isCountdownPaused) {
                        setCustomCountdown(value[0]);
                      }
                    }}
                  />
                  <span className="min-w-[40px] text-center">{countdownMinutes}</span>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant={isCountdownPaused ? "default" : "outline"}
                  onClick={() => setIsCountdownPaused(!isCountdownPaused)}
                >
                  {isCountdownPaused ? (
                    <><Play className="mr-2 h-4 w-4" /> Start</>
                  ) : (
                    <><Pause className="mr-2 h-4 w-4" /> Pause</>
                  )}
                </Button>
                <Button variant="outline" onClick={resetCountdown}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Stopwatch Tab */}
        <TabsContent value="stopwatch">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Stopwatch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold font-mono">
                  {formatStopwatchTime(stopwatchTime)}
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant={isStopwatchPaused ? "default" : "outline"}
                  onClick={() => setIsStopwatchPaused(!isStopwatchPaused)}
                >
                  {isStopwatchPaused ? (
                    <><Play className="mr-2 h-4 w-4" /> Start</>
                  ) : (
                    <><Pause className="mr-2 h-4 w-4" /> Pause</>
                  )}
                </Button>
                <Button variant="outline" onClick={resetStopwatch}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimerPage;
