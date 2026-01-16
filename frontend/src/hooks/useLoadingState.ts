import { useState } from 'react';

interface LoadingState {
  isLoading: boolean;
  operation: string;
  progress?: number;
  timestamp: Date;
}

export const useLoadingState = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    operation: '',
    timestamp: new Date(),
  });

  const startLoading = (operation: string, progress?: number) => {
    setLoadingState({
      isLoading: true,
      operation,
      progress,
      timestamp: new Date(),
    });
  };

  const stopLoading = () => {
    setLoadingState({
      isLoading: false,
      operation: '',
      timestamp: new Date(),
    });
  };

  const updateProgress = (progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress,
    }));
  };

  return { loadingState, startLoading, stopLoading, updateProgress };
};