
import { z } from 'zod';
import { DIFFICULTY_LEVELS, QUESTION_TYPES, FREQUENCIES } from '@/constants/provider';

export const quoteSchema = z.object({
  text: z.string().min(1, 'Quote text is required').max(500, 'Quote text must be less than 500 characters'),
  author: z.string().max(100, 'Author name must be less than 100 characters').optional(),
  category: z.string().max(50, 'Category must be less than 50 characters').optional()
});

export const journalPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt text is required').max(1000, 'Prompt must be less than 1000 characters'),
  category: z.string().max(50, 'Category must be less than 50 characters').optional(),
  difficulty: z.enum([
    DIFFICULTY_LEVELS.JOURNAL.BEGINNER,
    DIFFICULTY_LEVELS.JOURNAL.INTERMEDIATE,
    DIFFICULTY_LEVELS.JOURNAL.ADVANCED
  ] as const)
});

export const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be less than 5000 characters'),
  category: z.string().max(50, 'Category must be less than 50 characters').optional()
});

export const questionSchema = z.object({
  question: z.string().min(1, 'Question text is required').max(500, 'Question must be less than 500 characters'),
  category: z.string().max(50, 'Category must be less than 50 characters').optional(),
  type: z.enum([
    QUESTION_TYPES.REFLECTION,
    QUESTION_TYPES.ASSESSMENT,
    QUESTION_TYPES.SCREENING
  ] as const)
});

export const toolkitItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  instructions: z.string().min(1, 'Instructions are required').max(5000, 'Instructions must be less than 5000 characters'),
  category: z.string().max(50, 'Category must be less than 50 characters').optional(),
  duration: z.string().max(50, 'Duration must be less than 50 characters').optional()
});

export const reminderSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  message: z.string().min(1, 'Message is required').max(500, 'Message must be less than 500 characters'),
  frequency: z.enum([
    FREQUENCIES.DAILY,
    FREQUENCIES.WEEKLY,
    FREQUENCIES.MONTHLY
  ] as const),
  category: z.string().max(50, 'Category must be less than 50 characters').optional()
});

export const gratitudePromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt text is required').max(1000, 'Prompt must be less than 1000 characters'),
  category: z.string().max(50, 'Category must be less than 50 characters').optional(),
  difficulty: z.enum([
    DIFFICULTY_LEVELS.GRATITUDE.SIMPLE,
    DIFFICULTY_LEVELS.GRATITUDE.MODERATE,
    DIFFICULTY_LEVELS.GRATITUDE.DEEP
  ] as const)
});

export const mindfulnessPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt text is required').max(1000, 'Prompt must be less than 1000 characters'),
  category: z.string().max(50, 'Category must be less than 50 characters').optional(),
  duration: z.string().max(50, 'Duration must be less than 50 characters')
});
