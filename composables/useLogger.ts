/**
 * Development logging utility
 * Only logs in development mode to prevent console pollution in production
 */
export const useLogger = (componentName: string = 'app') => {
  const isDev = process.dev;

  return {
    log: (...args: any[]) => {
      if (isDev) {
        console.log(`[${componentName}]`, ...args);
      }
    },
    warn: (...args: any[]) => {
      if (isDev) {
        console.warn(`[${componentName}]`, ...args);
      }
    },
    error: (...args: any[]) => {
      if (isDev) {
        console.error(`[${componentName}]`, ...args);
      }
    },
    info: (...args: any[]) => {
      if (isDev) {
        console.info(`[${componentName}]`, ...args);
      }
    }
  };
};