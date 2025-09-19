import { ref, computed, type Ref } from 'vue';

export interface LoadingState {
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  hasError: Ref<boolean>;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Composable for managing loading states with error handling
 */
export function useLoadingState(initialLoading = false): LoadingState {
  const isLoading = ref(initialLoading);
  const error = ref<string | null>(null);

  const hasError = computed(() => error.value !== null);

  const startLoading = () => {
    isLoading.value = true;
    error.value = null;
  };

  const stopLoading = () => {
    isLoading.value = false;
  };

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage;
    isLoading.value = false;
  };

  const clearError = () => {
    error.value = null;
  };

  const reset = () => {
    isLoading.value = false;
    error.value = null;
  };

  return {
    isLoading,
    error,
    hasError,
    startLoading,
    stopLoading,
    setError,
    clearError,
    reset,
  };
}

/**
 * Higher-order function for wrapping async operations with loading state
 */
export function withLoadingState<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  loadingState: LoadingState
) {
  return async (...args: T): Promise<R | null> => {
    try {
      loadingState.startLoading();
      const result = await fn(...args);
      loadingState.stopLoading();
      return result;
    } catch (error) {
      loadingState.setError(error instanceof Error ? error.message : 'An error occurred');
      return null;
    }
  };
}