
import { Resource } from '@/types/resource';

// Pre-populated resources for patients
export const resources: Resource[] = [
  {
    id: '1',
    title: 'Anxiety Management Worksheet',
    description: 'Learn practical techniques to manage anxiety and stress in daily life.',
    category: 'worksheet',
    type: 'Worksheet',
    downloadUrl: '/resources/anxiety-management-worksheet.pdf'
  },
  {
    id: '2',
    title: 'Depression Coping Strategies Guide',
    description: 'Evidence-based strategies for managing depression symptoms.',
    category: 'guide',
    type: 'Guide',
    downloadUrl: '/resources/depression-coping-strategies-guide.pdf'
  },
  {
    id: '3',
    title: 'Mindfulness Daily Practice Template',
    description: 'A structured template to help you build a consistent mindfulness practice.',
    category: 'template',
    type: 'PDF',
    downloadUrl: '/resources/mindfulness-daily-practice-template.pdf'
  },
  {
    id: '4',
    title: 'Crisis Prevention Plan',
    description: 'Template to create your personal crisis prevention and management plan.',
    category: 'template',
    type: 'Worksheet',
    downloadUrl: '/resources/crisis-prevention-plan.pdf'
  },
  {
    id: '5',
    title: 'Understanding Mental Health Conditions',
    description: 'Comprehensive reference material about common mental health conditions.',
    category: 'reference',
    type: 'Article',
    downloadUrl: '/resources/understanding-mental-health-conditions.pdf'
  },
  {
    id: '6',
    title: 'Cognitive Behavioral Therapy Techniques',
    description: 'Learn CBT techniques you can practice at home.',
    category: 'guide',
    type: 'Guide',
    downloadUrl: '/resources/cbt-techniques-guide.pdf'
  },
  {
    id: '7',
    title: 'Sleep Hygiene Checklist',
    description: 'Improve your sleep quality with this comprehensive checklist.',
    category: 'worksheet',
    type: 'Worksheet',
    downloadUrl: '/resources/sleep-hygiene-checklist.pdf'
  },
  {
    id: '8',
    title: 'Building Healthy Relationships',
    description: 'Guide to developing and maintaining healthy relationships.',
    category: 'guide',
    type: 'Article',
    downloadUrl: '/resources/building-healthy-relationships.pdf'
  }
];
