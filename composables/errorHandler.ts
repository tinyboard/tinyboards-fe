import { useToastStore } from '@/stores/StoreToast';

export interface ApiError {
  message: string;
  statusCode?: number;
  isNetworkError?: boolean;
  isAuthError?: boolean;
  isPrivateInstance?: boolean;
}

/**
 * Global error handler for API and GraphQL errors
 */
export function useErrorHandler() {
  const toastStore = useToastStore();

  const handleError = (error: any, context?: string): ApiError => {
    let processedError: ApiError = {
      message: 'An unexpected error occurred',
      statusCode: 500,
    };

    // Handle GraphQL errors
    if (error.gqlErrors && error.gqlErrors.length > 0) {
      const gqlError = error.gqlErrors[0];
      processedError.message = gqlError.message;

      // Check for private instance error
      if (gqlError.message.includes('private instance') ||
          gqlError.message.includes('You need an account')) {
        processedError.isPrivateInstance = true;
        processedError.message = 'This is a private instance. Please log in to continue.';
      }
    }

    // Handle network errors
    else if (error.name === 'NetworkError' || error.cause?.code) {
      processedError.isNetworkError = true;
      processedError.message = 'Network connection failed. Please check your internet connection.';
    }

    // Handle HTTP errors
    else if (error.statusCode) {
      processedError.statusCode = error.statusCode;

      switch (error.statusCode) {
        case 401:
          processedError.isAuthError = true;
          processedError.message = 'Authentication required. Please log in.';
          break;
        case 403:
          processedError.message = 'Access denied. You do not have permission.';
          break;
        case 404:
          processedError.message = 'Resource not found.';
          break;
        case 429:
          processedError.message = 'Too many requests. Please try again later.';
          break;
        case 500:
          processedError.message = 'Server error. Please try again later.';
          break;
        default:
          processedError.message = error.message || 'An error occurred';
      }
    }

    // Handle other error types
    else if (error.message) {
      processedError.message = error.message;
    }

    // Log error in development
    if (process.dev) {
      console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    }

    return processedError;
  };

  const showErrorToast = (error: ApiError, title?: string) => {
    if (toastStore.hasInit) {
      toastStore.addNotification({
        header: title || 'Error',
        message: error.message,
        type: 'error',
      });
    }
  };

  const handleApiError = (error: any, context?: string, showToast = true): ApiError => {
    const processedError = handleError(error, context);

    if (showToast && !processedError.isPrivateInstance) {
      showErrorToast(processedError);
    }

    return processedError;
  };

  return {
    handleError,
    handleApiError,
    showErrorToast,
  };
}