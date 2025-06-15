import { useQuoteHandlers } from './useQuoteHandlers';
import { useJournalPromptHandlers } from './useJournalPromptHandlers';
import { useResourceHandlers } from './useResourceHandlers';
import { useQuestionHandlers } from './useQuestionHandlers';
import { useToolkitHandlers } from './useToolkitHandlers';
import { useReminderHandlers } from './useReminderHandlers';
import { useGratitudeHandlers } from './useGratitudeHandlers';
import { useMindfulnessHandlers } from './useMindfulnessHandlers';
import {
  Quote,
  JournalPrompt,
  Resource,
  Question,
  ToolkitItem,
  Reminder,
  GratitudePrompt,
  MindfulnessPrompt
} from '@/types/provider';

interface UseProviderHandlersProps {
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  journalPrompts: JournalPrompt[];
  setJournalPrompts: React.Dispatch<React.SetStateAction<JournalPrompt[]>>;
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  toolkitItems: ToolkitItem[];
  setToolkitItems: React.Dispatch<React.SetStateAction<ToolkitItem[]>>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  gratitudePrompts: GratitudePrompt[];
  setGratitudePrompts: React.Dispatch<React.SetStateAction<GratitudePrompt[]>>;
  mindfulnessPrompts: MindfulnessPrompt[];
  setMindfulnessPrompts: React.Dispatch<React.SetStateAction<MindfulnessPrompt[]>>;
  newQuote: { text: string; author: string; category: string };
  setNewQuote: React.Dispatch<React.SetStateAction<{ text: string; author: string; category: string }>>;
  newPrompt: { prompt: string; category: string; difficulty: JournalPrompt['difficulty'] };
  setNewPrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; difficulty: JournalPrompt['difficulty'] }>>;
  newResource: { title: string; description: string; content: string; category: string };
  setNewResource: React.Dispatch<React.SetStateAction<{ title: string; description: string; content: string; category: string }>>;
  newQuestion: { question: string; category: string; type: Question['type'] };
  setNewQuestion: React.Dispatch<React.SetStateAction<{ question: string; category: string; type: Question['type'] }>>;
  newToolkitItem: { title: string; description: string; instructions: string; category: string; duration: string };
  setNewToolkitItem: React.Dispatch<React.SetStateAction<{ title: string; description: string; instructions: string; category: string; duration: string }>>;
  newReminder: { title: string; message: string; frequency: Reminder['frequency']; category: string };
  setNewReminder: React.Dispatch<React.SetStateAction<{ title: string; message: string; frequency: Reminder['frequency']; category: string }>>;
  newGratitudePrompt: { prompt: string; category: string; difficulty: GratitudePrompt['difficulty'] };
  setNewGratitudePrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; difficulty: GratitudePrompt['difficulty'] }>>;
  newMindfulnessPrompt: { prompt: string; category: string; duration: string };
  setNewMindfulnessPrompt: React.Dispatch<React.SetStateAction<{ prompt: string; category: string; duration: string }>>;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
  showInfo: (title: string, description?: string) => void;
}

export const useProviderHandlers = (props: UseProviderHandlersProps) => {
  const quoteHandlers = useQuoteHandlers({
    quotes: props.quotes,
    setQuotes: props.setQuotes,
    newQuote: props.newQuote,
    setNewQuote: props.setNewQuote,
    showSuccess: props.showSuccess,
    showError: props.showError
  });

  const journalPromptHandlers = useJournalPromptHandlers({
    journalPrompts: props.journalPrompts,
    setJournalPrompts: props.setJournalPrompts,
    newPrompt: props.newPrompt,
    setNewPrompt: props.setNewPrompt,
    showSuccess: props.showSuccess,
    showError: props.showError
  });

  const resourceHandlers = useResourceHandlers({
    resources: props.resources,
    setResources: props.setResources,
    newResource: props.newResource,
    setNewResource: props.setNewResource,
    showSuccess: props.showSuccess,
    showError: props.showError
  });

  const questionHandlers = useQuestionHandlers({
    questions: props.questions,
    setQuestions: props.setQuestions,
    newQuestion: props.newQuestion,
    setNewQuestion: props.setNewQuestion,
    showSuccess: props.showSuccess,
    showError: props.showError
  });

  const toolkitHandlers = useToolkitHandlers({
    toolkitItems: props.toolkitItems,
    setToolkitItems: props.setToolkitItems,
    newToolkitItem: props.newToolkitItem,
    setNewToolkitItem: props.setNewToolkitItem,
    showSuccess: props.showSuccess,
    showError: props.showError
  });

  const reminderHandlers = useReminderHandlers({
    reminders: props.reminders,
    setReminders: props.setReminders,
    newReminder: props.newReminder,
    setNewReminder: props.setNewReminder,
    showSuccess: props.showSuccess,
    showError: props.showError
  });

  const gratitudeHandlers = useGratitudeHandlers({
    gratitudePrompts: props.gratitudePrompts,
    setGratitudePrompts: props.setGratitudePrompts,
    newGratitudePrompt: props.newGratitudePrompt,
    setNewGratitudePrompt: props.setNewGratitudePrompt,
    showSuccess: props.showSuccess,
    showError: props.showError
  });

  const mindfulnessHandlers = useMindfulnessHandlers({
    mindfulnessPrompts: props.mindfulnessPrompts,
    setMindfulnessPrompts: props.setMindfulnessPrompts,
    newMindfulnessPrompt: props.newMindfulnessPrompt,
    setNewMindfulnessPrompt: props.setNewMindfulnessPrompt,
    showSuccess: props.showSuccess,
    showError: props.showError
  });

  return {
    // Quote handlers with loading state
    handleAddQuote: quoteHandlers.handleAddQuote,
    handleDeleteQuote: quoteHandlers.handleDeleteQuote,
    handleBulkImportQuotes: quoteHandlers.handleBulkImportQuotes,
    isLoading: quoteHandlers.isLoading,
    
    // Journal prompt handlers
    handleAddPrompt: journalPromptHandlers.handleAddPrompt,
    handleDeletePrompt: journalPromptHandlers.handleDeletePrompt,
    handleBulkImportPrompts: journalPromptHandlers.handleBulkImportPrompts,
    
    // Resource handlers
    handleAddResource: resourceHandlers.handleAddResource,
    handleDeleteResource: resourceHandlers.handleDeleteResource,
    
    // Question handlers
    handleAddQuestion: questionHandlers.handleAddQuestion,
    handleDeleteQuestion: questionHandlers.handleDeleteQuestion,
    handleBulkImportQuestions: questionHandlers.handleBulkImportQuestions,
    
    // Toolkit handlers
    handleAddToolkitItem: toolkitHandlers.handleAddToolkitItem,
    handleDeleteToolkitItem: toolkitHandlers.handleDeleteToolkitItem,
    handleBulkImportToolkitItems: toolkitHandlers.handleBulkImportToolkitItems,
    
    // Reminder handlers
    handleAddReminder: reminderHandlers.handleAddReminder,
    handleDeleteReminder: reminderHandlers.handleDeleteReminder,
    handleBulkImportReminders: reminderHandlers.handleBulkImportReminders,
    
    // Gratitude handlers
    handleAddGratitudePrompt: gratitudeHandlers.handleAddGratitudePrompt,
    handleDeleteGratitudePrompt: gratitudeHandlers.handleDeleteGratitudePrompt,
    handleBulkImportGratitudePrompts: gratitudeHandlers.handleBulkImportGratitudePrompts,
    
    // Mindfulness handlers
    handleAddMindfulnessPrompt: mindfulnessHandlers.handleAddMindfulnessPrompt,
    handleDeleteMindfulnessPrompt: mindfulnessHandlers.handleDeleteMindfulnessPrompt,
    handleBulkImportMindfulnessPrompts: mindfulnessHandlers.handleBulkImportMindfulnessPrompts
  };
};
