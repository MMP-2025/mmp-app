
import { useToast } from '@/hooks/use-toast';

export const useToastService = () => {
  const { toast } = useToast();

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default"
    });
  };

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive"
    });
  };

  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default"
    });
  };

  const showWarning = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive"
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    toast // Keep raw toast available for custom usage
  };
};
