
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Quote,
  JournalPrompt,
  JournalPromptDifficulty,
  Resource,
  Question,
  ToolkitItem,
  Reminder,
  GratitudePrompt,
  MindfulnessPrompt
} from '@/types/provider';

export const useProviderData = () => {
  // State management
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [journalPrompts, setJournalPrompts] = useState<JournalPrompt[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [toolkitItems, setToolkitItems] = useState<ToolkitItem[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [gratitudePrompts, setGratitudePrompts] = useState<GratitudePrompt[]>([]);
  const [mindfulnessPrompts, setMindfulnessPrompts] = useState<MindfulnessPrompt[]>([]);

  // Form states
  const [newQuote, setNewQuote] = useState({
    text: '',
    author: '',
    category: ''
  });
  const [newPrompt, setNewPrompt] = useState<{
    prompt: string;
    category: string;
    difficulty: JournalPromptDifficulty;
  }>({
    prompt: '',
    category: '',
    difficulty: 'beginner'
  });
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    content: '',
    category: ''
  });
  const [newQuestion, setNewQuestion] = useState<{
    question: string;
    category: string;
    type: Question['type'];
  }>({
    question: '',
    category: '',
    type: 'reflection'
  });
  const [newToolkitItem, setNewToolkitItem] = useState({
    title: '',
    description: '',
    instructions: '',
    category: '',
    duration: ''
  });
  const [newReminder, setNewReminder] = useState<{
    title: string;
    message: string;
    frequency: Reminder['frequency'];
    category: string;
  }>({
    title: '',
    message: '',
    frequency: 'daily',
    category: ''
  });
  const [newGratitudePrompt, setNewGratitudePrompt] = useState<{
    prompt: string;
    category: string;
    difficulty: GratitudePrompt['difficulty'];
  }>({
    prompt: '',
    category: '',
    difficulty: 'simple'
  });
  const [newMindfulnessPrompt, setNewMindfulnessPrompt] = useState({
    prompt: '',
    category: '',
    duration: '5 minutes'
  });

  const { toast } = useToast();

  return {
    // Data
    quotes,
    journalPrompts,
    resources,
    questions,
    toolkitItems,
    reminders,
    gratitudePrompts,
    mindfulnessPrompts,
    // Setters
    setQuotes,
    setJournalPrompts,
    setResources,
    setQuestions,
    setToolkitItems,
    setReminders,
    setGratitudePrompts,
    setMindfulnessPrompts,
    // Form states
    newQuote,
    setNewQuote,
    newPrompt,
    setNewPrompt,
    newResource,
    setNewResource,
    newQuestion,
    setNewQuestion,
    newToolkitItem,
    setNewToolkitItem,
    newReminder,
    setNewReminder,
    newGratitudePrompt,
    setNewGratitudePrompt,
    newMindfulnessPrompt,
    setNewMindfulnessPrompt,
    toast
  };
};
