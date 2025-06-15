
import { useToastService } from '@/hooks/useToastService';
import { useContentData } from './useContentData';
import { useWellnessData } from './useWellnessData';
import { useToolsData } from './useToolsData';

export const useProviderData = () => {
  const toastService = useToastService();
  const contentData = useContentData();
  const wellnessData = useWellnessData();
  const toolsData = useToolsData();

  return {
    // Content data (quotes, prompts, resources, questions)
    ...contentData,
    
    // Wellness data (gratitude, mindfulness)
    ...wellnessData,
    
    // Tools data (toolkit, reminders)
    ...toolsData,
    
    // Toast services
    toast: toastService.toast,
    showSuccess: toastService.showSuccess,
    showError: toastService.showError,
    showInfo: toastService.showInfo
  };
};
