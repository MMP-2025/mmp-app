
import { ImportType } from '@/components/provider/BulkImportModal';
import { bulkPrompts } from '@/data/bulkPrompts';

export const parseTextareaData = (
  text: string, 
  type: ImportType, 
  delimiter: string = '\n',
  defaultCategory: string = 'General'
) => {
  const lines = text.split(delimiter).filter(line => line.trim());
  
  return lines.map((line, index) => {
    const id = Date.now().toString() + index;
    
    switch (type) {
      case 'quotes':
        const [quotePart, author] = line.split(' - ');
        return {
          id,
          text: quotePart.trim(),
          author: author?.trim() || 'Anonymous',
          category: defaultCategory || 'General'
        };
      
      case 'journalPrompts':
        return {
          id,
          prompt: line.trim(),
          category: defaultCategory || 'General',
          difficulty: 'beginner' as const
        };
      
      case 'questions':
        return {
          id,
          question: line.trim(),
          category: defaultCategory || 'General',
          type: 'reflection' as const
        };
      
      case 'toolkitItems':
        return {
          id,
          title: line.trim(),
          description: '',
          instructions: line.trim(),
          category: defaultCategory || 'General',
          duration: '5 minutes'
        };
      
      case 'reminders':
        return {
          id,
          title: line.trim(),
          message: line.trim(),
          frequency: 'daily' as const,
          category: defaultCategory || 'General'
        };
      
      case 'gratitudePrompts':
        return {
          id,
          prompt: line.trim(),
          category: defaultCategory || 'General',
          difficulty: 'simple' as const
        };
      
      case 'mindfulnessPrompts':
        return {
          id,
          prompt: line.trim(),
          category: defaultCategory || 'General',
          duration: '5 minutes'
        };
      
      default:
        return { id, content: line.trim() };
    }
  });
};

export const parseJSONData = (jsonText: string, type: ImportType) => {
  const data = JSON.parse(jsonText);
  
  if (!Array.isArray(data)) {
    throw new Error('JSON data must be an array');
  }
  
  return data.map((item, index) => ({
    id: Date.now().toString() + index,
    ...item
  }));
};

export const parseCSVData = (csvText: string, type: ImportType) => {
  // Remove BOM if present and normalize line endings
  let cleanText = csvText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  console.log('Clean CSV text (first 500 chars):', cleanText.substring(0, 500));
  
  const lines = cleanText.split('\n').filter(line => line.trim());
  
  console.log('CSV lines:', lines);
  
  if (lines.length < 2) {
    throw new Error('CSV must have a header row and at least one data row');
  }
  
  // Parse CSV properly handling quoted values
  const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        // Remove surrounding quotes and trim
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    // Push the last value, removing quotes
    values.push(current.trim().replace(/^"|"$/g, ''));
    return values;
  };
  
  // Parse headers and normalize them (lowercase, trim, remove quotes)
  const rawHeaders = parseCSVLine(lines[0]);
  console.log('Raw headers:', rawHeaders);
  
  const headers = rawHeaders.map(h => h.toLowerCase().trim());
  console.log('Normalized headers:', headers);
  
  const rows = lines.slice(1);
  
  return rows.map((row, index) => {
    const values = parseCSVLine(row);
    console.log(`Row ${index} values:`, values);
    
    const item: any = { id: Date.now().toString() + index };
    
    headers.forEach((header, i) => {
      if (header) {
        item[header] = values[i] || '';
      }
    });
    
    return item;
  });
};

export const generateJSONTemplate = (type: ImportType) => {
  switch (type) {
    case 'quotes':
      return [
        {
          text: "Example inspirational quote",
          author: "Author Name",
          category: "Motivation"
        }
      ];
    
    case 'journalPrompts':
      return [
        {
          prompt: "What are three things you're grateful for today?",
          category: "Gratitude",
          difficulty: "beginner"
        }
      ];
    
    case 'questions':
      return [
        {
          question: "How are you feeling today?",
          category: "Check-in",
          type: "reflection"
        }
      ];
    
    case 'toolkitItems':
      return [
        {
          title: "Deep Breathing Exercise",
          description: "A simple breathing technique for relaxation",
          instructions: "Breathe in for 4 counts, hold for 4, exhale for 4",
          category: "Breathing",
          duration: "5 minutes"
        }
      ];
    
    case 'reminders':
      return [
        {
          title: "Daily Check-in",
          message: "Take a moment to check in with yourself",
          frequency: "daily",
          category: "Self-care"
        }
      ];
    
    case 'gratitudePrompts':
      return [
        {
          prompt: "Name three things that brought you joy today",
          category: "Daily",
          difficulty: "simple"
        }
      ];
    
    case 'mindfulnessPrompts':
      return [
        {
          prompt: "Take five deep breaths and notice the sensations",
          category: "Breathing",
          duration: "5 minutes"
        }
      ];
    
    default:
      return [];
  }
};

export const generateCSVTemplate = (type: ImportType) => {
  switch (type) {
    case 'quotes':
      return 'text,author,category\n"Example quote","Author Name","Motivation"';
    
    case 'journalPrompts':
      return 'prompt,category,difficulty\n"What are you grateful for?","Gratitude","beginner"';
    
    case 'questions':
      return 'question,category,type\n"How are you feeling?","Check-in","reflection"';
    
    case 'toolkitItems':
      return 'title,description,instructions,category,duration\n"Breathing Exercise","Simple relaxation","Breathe deeply","Breathing","5 minutes"';
    
    case 'reminders':
      return 'title,message,frequency,category\n"Daily Check-in","Check in with yourself","daily","Self-care"';
    
    case 'gratitudePrompts':
      return 'prompt,category,difficulty\n"Three things you\'re grateful for","Daily","simple"';
    
    case 'mindfulnessPrompts':
      return 'prompt,category,duration\n"Focus on your breath","Breathing","5"';
    
    default:
      return '';
  }
};

export const getBulkData = (type: ImportType) => {
  switch (type) {
    case 'journalPrompts':
      return [
        {
          id: 'journal-basic',
          name: 'Basic Journal Prompts',
          description: 'Essential daily reflection prompts',
          items: bulkPrompts.filter(p => p.category === 'journal').map(p => ({
            id: p.id,
            prompt: p.text,
            category: 'General',
            difficulty: 'beginner' as const
          }))
        }
      ];
    
    case 'gratitudePrompts':
      return [
        {
          id: 'gratitude-basic',
          name: 'Basic Gratitude Prompts', 
          description: 'Simple gratitude reflection prompts',
          items: bulkPrompts.filter(p => p.category === 'gratitude').map(p => ({
            id: p.id,
            prompt: p.text,
            category: 'Daily',
            difficulty: 'simple' as const
          }))
        }
      ];
    
    case 'questions':
      return [
        {
          id: 'mindfulness-questions',
          name: 'Mindfulness Questions',
          description: 'Questions for mindful reflection',
          items: bulkPrompts.filter(p => p.category === 'mindfulness').map(p => ({
            id: p.id,
            question: p.text,
            category: 'Mindfulness',
            type: 'reflection' as const
          }))
        }
      ];
    
    case 'mindfulnessPrompts':
      return [
        {
          id: 'mindfulness-basic',
          name: 'Basic Mindfulness Prompts',
          description: 'Simple mindfulness exercises and prompts',
          items: bulkPrompts.filter(p => p.category === 'mindfulness').map(p => ({
            id: p.id,
            prompt: p.text,
            category: 'Mindfulness',
            duration: '5 minutes'
          }))
        }
      ];
    
    case 'quotes':
      return [
        {
          id: 'motivational-quotes',
          name: 'Motivational Quotes',
          description: 'Inspiring quotes for daily motivation',
          items: [
            {
              id: '1',
              text: "The only way to do great work is to love what you do.",
              author: "Steve Jobs",
              category: "Motivation"
            },
            {
              id: '2', 
              text: "Believe you can and you're halfway there.",
              author: "Theodore Roosevelt",
              category: "Motivation"
            },
            {
              id: '3',
              text: "It is during our darkest moments that we must focus to see the light.",
              author: "Aristotle",
              category: "Hope"
            }
          ]
        }
      ];
    
    default:
      return [];
  }
};
