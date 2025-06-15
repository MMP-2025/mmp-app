import { useToastService } from '@/hooks/useToastService';
import { useQuoteData } from './useQuoteData';
import { useJournalPromptData } from './useJournalPromptData';
import { useResourceData } from './useResourceData';
import { useQuestionData } from './useQuestionData';
import { useToolkitData } from './useToolkitData';
import { useReminderData } from './useReminderData';
import { useGratitudeData } from './useGratitudeData';
import { useMindfulnessData } from './useMindfulnessData';

export const useProviderData = () => {
  const toastService = useToastService();
  
  const quoteData = useQuoteData();
  const journalPromptData = useJournalPromptData();
  const resourceData = useResourceData();
  const questionData = useQuestionData();
  const toolkitData = useToolkitData();
  const reminderData = useReminderData();
  const gratitudeData = useGratitudeData();
  const mindfulnessData = useMindfulnessData();

  return {
    // Quote data
    quotes: quoteData.quotes,
    setQuotes: quoteData.setQuotes,
    newQuote: quoteData.newQuote,
    setNewQuote: quoteData.setNewQuote,
    
    // Journal prompt data
    journalPrompts: journalPromptData.journalPrompts,
    setJournalPrompts: journalPromptData.setJournalPrompts,
    newPrompt: journalPromptData.newPrompt,
    setNewPrompt: journalPromptData.setNewPrompt,
    
    // Resource data
    resources: resourceData.resources,
    setResources: resourceData.setResources,
    newResource: resourceData.newResource,
    setNewResource: resourceData.setNewResource,
    
    // Question data
    questions: questionData.questions,
    setQuestions: questionData.setQuestions,
    newQuestion: questionData.newQuestion,
    setNewQuestion: questionData.setNewQuestion,
    
    // Toolkit data
    toolkitItems: toolkitData.toolkitItems,
    setToolkitItems: toolkitData.setToolkitItems,
    newToolkitItem: toolkitData.newToolkitItem,
    setNewToolkitItem: toolkitData.setNewToolkitItem,
    
    // Reminder data
    reminders: reminderData.reminders,
    setReminders: reminderData.setReminders,
    newReminder: reminderData.newReminder,
    setNewReminder: reminderData.setNewReminder,
    
    // Gratitude data
    gratitudePrompts: gratitudeData.gratitudePrompts,
    setGratitudePrompts: gratitudeData.setGratitudePrompts,
    newGratitudePrompt: gratitudeData.newGratitudePrompt,
    setNewGratitudePrompt: gratitudeData.setNewGratitudePrompt,
    
    // Mindfulness data
    mindfulnessPrompts: mindfulnessData.mindfulnessPrompts,
    setMindfulnessPrompts: mindfulnessData.setMindfulnessPrompts,
    newMindfulnessPrompt: mindfulnessData.newMindfulnessPrompt,
    setNewMindfulnessPrompt: mindfulnessData.setNewMindfulnessPrompt,
    
    toast: toastService.toast,
    showSuccess: toastService.showSuccess,
    showError: toastService.showError,
    showInfo: toastService.showInfo
  };
};
