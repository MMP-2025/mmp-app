
import { useQuoteData } from './useQuoteData';
import { useJournalPromptData } from './useJournalPromptData';
import { useResourceData } from './useResourceData';
import { useQuestionData } from './useQuestionData';

export const useContentData = () => {
  const quoteData = useQuoteData();
  const journalPromptData = useJournalPromptData();
  const resourceData = useResourceData();
  const questionData = useQuestionData();

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
    setNewQuestion: questionData.setNewQuestion
  };
};
