
export const CATEGORIES = {
  GENERAL: 'General',
  MOTIVATION: 'Motivation',
  HEALING: 'Healing',
  SELF_REFLECTION: 'Self-reflection',
  GOALS: 'Goals',
  MENTAL_HEALTH: 'Mental Health',
  WELLNESS: 'Wellness',
  BREATHING: 'Breathing',
  GROUNDING: 'Grounding',
  SELF_CARE: 'Self-care',
  MEDICATION: 'Medication',
  DAILY: 'Daily',
  RELATIONSHIPS: 'Relationships',
  BODY_SCAN: 'Body Scan'
} as const;

export const DIFFICULTY_LEVELS = {
  JOURNAL: {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
  },
  GRATITUDE: {
    SIMPLE: 'simple',
    MODERATE: 'moderate',
    DEEP: 'deep'
  }
} as const;

export const QUESTION_TYPES = {
  REFLECTION: 'reflection',
  ASSESSMENT: 'assessment',
  SCREENING: 'screening'
} as const;

export const FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
} as const;

export const DURATIONS = {
  FIVE_MINUTES: '5 minutes',
  TEN_MINUTES: '10 minutes',
  FIFTEEN_MINUTES: '15 minutes',
  THIRTY_MINUTES: '30 minutes'
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  QUOTE_TEXT_REQUIRED: 'Quote text is required',
  PROMPT_TEXT_REQUIRED: 'Prompt text is required',
  QUESTION_TEXT_REQUIRED: 'Question text is required',
  TITLE_AND_CONTENT_REQUIRED: 'Title and content are required',
  TITLE_AND_INSTRUCTIONS_REQUIRED: 'Title and instructions are required',
  TITLE_AND_MESSAGE_REQUIRED: 'Title and message are required',
  NO_ITEMS_TO_IMPORT: 'No valid items found to import'
} as const;
