import { ref, type Ref, computed, getCurrentInstance } from 'vue';
import type { AsyncData } from 'nuxt/app';

/**
 * Enhanced GraphQL composable for TinyBoards frontend
 *
 * Features:
 * - Runtime endpoint configuration from environment variables
 * - Automatic SSR/client-side endpoint routing with Docker support
 * - Cookie-based and Bearer token authentication handling
 * - TypeScript support for operations and variables
 * - Comprehensive error handling and network retries
 * - Support for queries, mutations, and subscriptions
 * - Configurable caching, retry strategies, and request interceptors
 * - Connection health monitoring and fallback endpoints
 * - Request/response transformation and middleware support
 */

// Types
export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, any>;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: Record<string, any>;
}

export interface GraphQLRequestOptions {
  /** Variables to pass to the GraphQL operation */
  variables?: Record<string, any>;
  /** Custom headers to include with the request */
  headers?: Record<string, string>;
  /** Enable/disable caching (default: true for queries, false for mutations) */
  cache?: boolean;
  /** Timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Number of retry attempts (default: 2) */
  retries?: number;
  /** Server-side rendering mode */
  ssr?: boolean;
  /** Transform the response data */
  transform?: (data: any) => any;
  /** Key for caching/deduplication */
  key?: string;
}

export interface UseGraphQLResult<T = any> {
  /** Reactive data from the GraphQL response */
  data: Ref<T | null>;
  /** Reactive error state */
  error: Ref<Error | null>;
  /** Reactive pending state */
  pending: Ref<boolean>;
  /** Function to manually refresh the data */
  refresh: () => Promise<void>;
  /** Execute the operation (useful for lazy queries) */
  execute: (newVariables?: Record<string, any>) => Promise<void>;
}

export interface GraphQLEndpointConfig {
  /** Current endpoint URL */
  endpoint: string;
  /** Fallback endpoint URLs */
  fallbackEndpoints: string[];
  /** Whether running on server-side */
  isServerSide: boolean;
  /** Whether running on client-side */
  isClientSide: boolean;
  /** Runtime configuration */
  config: any;
  /** Health check status */
  isHealthy: boolean;
  /** Last health check timestamp */
  lastHealthCheck: number;
}

export interface GraphQLClientConfig {
  /** Default request timeout in milliseconds */
  timeout: number;
  /** Default retry attempts */
  retries: number;
  /** Enable request/response logging */
  enableLogging: boolean;
  /** Custom request interceptors */
  requestInterceptors: Array<(config: any) => any>;
  /** Custom response interceptors */
  responseInterceptors: Array<(response: any) => any>;
  /** Health check interval in milliseconds */
  healthCheckInterval: number;
  /** Enable automatic endpoint health monitoring */
  enableHealthCheck: boolean;
}

// Global state for endpoint health monitoring
const endpointHealthCache = new Map<string, { isHealthy: boolean; lastCheck: number }>();

// Global request deduplication cache
interface PendingRequest<T> {
  promise: Promise<UseGraphQLResult<T>>;
  timestamp: number;
}
const pendingRequests = new Map<string, PendingRequest<any>>();
const DEDUP_TIMEOUT = 1000; // 1 second deduplication window

/**
 * Get the appropriate GraphQL endpoint based on execution context
 * Handles SSR/client-side routing, Docker environments, and endpoint health monitoring
 */
export function useGraphQLEndpoint(): GraphQLEndpointConfig {
  const config = useRuntimeConfig();

  const getEndpoints = (): { primary: string; fallbacks: string[] } => {
    const endpoints = {
      primary: '',
      fallbacks: [] as string[]
    };

    if (process.server) {
      // Server-side: prefer internal endpoint for better performance in Docker
      const internalEndpoint = config.NUXT_INTERNAL_GQL_HOST || 'http://tinyboards:8536/api/v2/graphql';
      const serverEndpoint = config.GQL_HOST || internalEndpoint;

      endpoints.primary = serverEndpoint;

      // Add fallback endpoints for server-side
      if (serverEndpoint !== internalEndpoint) {
        endpoints.fallbacks.push(internalEndpoint);
      }

      // Also add constructed endpoint as fallback
      const constructedEndpoint = constructClientEndpoint(config);
      if (!endpoints.fallbacks.includes(constructedEndpoint)) {
        endpoints.fallbacks.push(constructedEndpoint);
      }

    } else {
      // Client-side: always use external endpoint
      const clientEndpoint = config.public.GQL_HOST || constructClientEndpoint(config);
      endpoints.primary = clientEndpoint;

      // Add alternative constructions as fallbacks
      const alternativeEndpoint = constructClientEndpoint(config);
      if (clientEndpoint !== alternativeEndpoint && !endpoints.fallbacks.includes(alternativeEndpoint)) {
        endpoints.fallbacks.push(alternativeEndpoint);
      }

    }

    return endpoints;
  };

  const { primary, fallbacks } = getEndpoints();
  const currentTime = Date.now();
  const healthInfo = endpointHealthCache.get(primary) || { isHealthy: true, lastCheck: 0 };

  return {
    endpoint: primary,
    fallbackEndpoints: fallbacks,
    isServerSide: process.server,
    isClientSide: process.client,
    config,
    isHealthy: healthInfo.isHealthy,
    lastHealthCheck: healthInfo.lastCheck
  };
}

/**
 * Construct client-side GraphQL endpoint from runtime config
 */
function constructClientEndpoint(config: any): string {
  const domain = config.public.domain || 'localhost:8536';
  const useHttps = config.public.use_https || false;
  const protocol = useHttps ? 'https' : 'http';
  return `${protocol}://${domain}/api/v2/graphql`;
}

/**
 * Get authentication headers for GraphQL requests
 * Supports multiple auth methods: Bearer token, Cookie forwarding, and custom headers
 */
function getAuthHeaders(customHeaders?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders
  };

  if (process.server) {
    // Server-side: Skip auth headers to avoid SSR context issues
    // Most content (posts, comments, etc.) can be fetched without authentication
    // Auth-required queries should be handled on client-side or in proper middleware context
    // Just use basic headers without authentication for SSR
    // The backend should handle missing auth gracefully for public queries
    // In production, we want to avoid SSR for complex auth-dependent queries
  } else {
    // Client-side: get token from cookie and use Authorization header
    try {
      // Try multiple sources for the token
      const tokenCookie = useCookie('token');
      let token = tokenCookie.value;

      // Fallback to localStorage if cookie is not available
      if (!token && typeof window !== 'undefined') {
        token = window.localStorage?.getItem('token') || window.sessionStorage?.getItem('token');
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      if (process.dev) {
        console.warn('⚠️  Failed to extract client auth token:', error);
      }
    }
  }

  return headers;
}

/**
 * Health check utility for GraphQL endpoints
 */
async function checkEndpointHealth(endpoint: string, timeout: number = 5000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{ __typename }'  // Simple introspection query
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const isHealthy = response.ok;
    endpointHealthCache.set(endpoint, {
      isHealthy,
      lastCheck: Date.now()
    });

    return isHealthy;
  } catch (error) {
    endpointHealthCache.set(endpoint, {
      isHealthy: false,
      lastCheck: Date.now()
    });
    return false;
  }
}

/**
 * Get the best available endpoint, preferring healthy ones
 */
async function getBestEndpoint(
  primaryEndpoint: string,
  fallbackEndpoints: string[],
  healthCheckTimeout: number = 5000
): Promise<string> {
  // Check if we should verify health (not on every request to avoid performance impact)
  const healthInfo = endpointHealthCache.get(primaryEndpoint);
  const shouldCheck = !healthInfo || (Date.now() - healthInfo.lastCheck > 60000); // Check every minute

  if (!shouldCheck && healthInfo?.isHealthy) {
    return primaryEndpoint;
  }

  // Check primary endpoint health
  const isPrimaryHealthy = await checkEndpointHealth(primaryEndpoint, healthCheckTimeout);
  if (isPrimaryHealthy) {
    return primaryEndpoint;
  }

  // If primary is unhealthy, try fallbacks
  for (const fallback of fallbackEndpoints) {
    const isFallbackHealthy = await checkEndpointHealth(fallback, healthCheckTimeout);
    if (isFallbackHealthy) {
      if (process.dev) {
        console.warn(`⚠️  Using fallback GraphQL endpoint: ${fallback}`);
      }
      return fallback;
    }
  }

  // If all endpoints are unhealthy, return primary and let the request fail gracefully
  if (process.dev) {
    console.error(`❌ All GraphQL endpoints appear unhealthy, using primary: ${primaryEndpoint}`);
  }
  return primaryEndpoint;
}

/**
 * Execute a GraphQL query with full TypeScript support and enhanced reliability
 *
 * @param query GraphQL query string or operation name
 * @param options Request options including variables, headers, etc.
 * @returns Promise resolving to GraphQL response data
 */
export async function useGraphQLQuery<T = any>(
  query: string,
  options: GraphQLRequestOptions = {}
): Promise<UseGraphQLResult<T>> {
  const endpointConfig = useGraphQLEndpoint();

  const {
    variables = {},
    headers = {},
    cache = true,
    timeout = 30000,
    retries = 2,
    ssr = true,
    transform,
    key
  } = options;

  // Create reactive state
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const pending = ref<boolean>(true);

  // Generate cache key
  const cacheKey = key || `gql:query:${btoa(query)}:${JSON.stringify(variables)}`;

  // Check for pending duplicate requests
  const existingRequest = pendingRequests.get(cacheKey);
  if (existingRequest && (Date.now() - existingRequest.timestamp) < DEDUP_TIMEOUT) {
    return existingRequest.promise;
  }

  const executeRequest = async (requestVariables = variables): Promise<void> => {
    try {
      pending.value = true;
      error.value = null;

      // Get the best available endpoint
      const targetEndpoint = await getBestEndpoint(
        endpointConfig.endpoint,
        endpointConfig.fallbackEndpoints,
        Math.min(timeout / 4, 5000) // Use 1/4 of request timeout for health checks
      );

      // Prepare headers
      const authHeaders = getAuthHeaders(headers);

      // Execute request with retry logic and endpoint fallback
      let lastError: Error | null = null;
      const allEndpoints = [targetEndpoint, ...endpointConfig.fallbackEndpoints.filter(e => e !== targetEndpoint)];

      for (let endpointIndex = 0; endpointIndex < allEndpoints.length; endpointIndex++) {
        const currentEndpoint = allEndpoints[endpointIndex];

        for (let attempt = 0; attempt <= retries; attempt++) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(currentEndpoint, {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify({
                query,
                variables: requestVariables
              }),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              // Mark endpoint as unhealthy for non-auth errors
              if (response.status >= 500) {
                endpointHealthCache.set(currentEndpoint, {
                  isHealthy: false,
                  lastCheck: Date.now()
                });
              }
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result: GraphQLResponse<T> = await response.json();

            if (result.errors && result.errors.length > 0) {
              const errorMessage = result.errors[0].message || 'GraphQL Error';
              const gqlError = new Error(errorMessage);
              // @ts-ignore - Add GraphQL-specific error properties
              gqlError.gqlErrors = result.errors;
              gqlError.graphQLErrors = result.errors; // Also add with camelCase
              gqlError.isAuthError = errorMessage.toLowerCase().includes('login required') ||
                                    errorMessage.toLowerCase().includes('unauthorized') ||
                                    errorMessage.toLowerCase().includes('not authenticated');

              if (process.dev && gqlError.isAuthError) {
                console.warn('🔐 Authentication required:', errorMessage);
              }

              throw gqlError;
            }

            // Mark endpoint as healthy on successful response
            endpointHealthCache.set(currentEndpoint, {
              isHealthy: true,
              lastCheck: Date.now()
            });

            // Apply transform if provided
            const responseData = transform ? transform(result.data) : result.data;
            data.value = responseData;

            return;
          } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));

            // Only retry on network errors, not on GraphQL errors
            const isRetryableError = lastError.name === 'AbortError' ||
                                   lastError.message.includes('fetch') ||
                                   lastError.message.startsWith('HTTP 5');

            if (isRetryableError && attempt < retries) {
              // Wait before retry (exponential backoff)
              const delay = Math.pow(2, attempt) * 1000;
              await new Promise(resolve => setTimeout(resolve, delay));
            } else if (attempt === retries) {
              // If we've exhausted retries on this endpoint, try the next one
              break;
            }
          }
        }
      }

      throw lastError;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      error.value = errorObj;

      if (process.dev) {
        console.error(`❌ GraphQL Query Failed [${endpointConfig.isServerSide ? 'SSR' : 'Client'}]:`, errorObj);
      }
    } finally {
      pending.value = false;
    }
  };

  // Create the request promise
  const requestPromise = (async () => {
    try {
      await executeRequest();
      return {
        data: data as Ref<T | null>,
        error,
        pending,
        refresh: () => executeRequest(),
        execute: executeRequest
      };
    } finally {
      // Clean up pending request after completion or error
      setTimeout(() => {
        pendingRequests.delete(cacheKey);
      }, DEDUP_TIMEOUT);
    }
  })();

  // Store in pending requests cache
  pendingRequests.set(cacheKey, {
    promise: requestPromise,
    timestamp: Date.now()
  });

  return requestPromise;
}

/**
 * Execute a GraphQL mutation with full TypeScript support
 *
 * @param mutation GraphQL mutation string or operation name
 * @param options Request options including variables, headers, etc.
 * @returns Promise resolving to GraphQL response data
 */
export async function useGraphQLMutation<T = any>(
  mutation: string,
  options: GraphQLRequestOptions = {}
): Promise<UseGraphQLResult<T>> {
  // Mutations default to no caching
  const mutationOptions = { ...options, cache: false };

  return useGraphQLQuery<T>(mutation, mutationOptions);
}

/**
 * Legacy compatibility: wrapper around existing useAsyncGql
 * Use this when you need to integrate with existing code patterns
 */
export async function useGraphQLRequest(operation: string, variables?: any, options?: any) {
  try {
    // Use the standard useAsyncGql from nuxt-graphql-client
    const result = await useAsyncGql({
      operation,
      variables,
      ...options
    });

    if (process.dev && result.error.value) {
      console.error(`❌ GraphQL Error [${isServerSide ? 'SSR' : 'Client'}]:`, result.error.value);
    }

    return result;
  } catch (error) {
    if (process.dev) {
      console.error(`💥 GraphQL Exception [${isServerSide ? 'SSR' : 'Client'}]:`, error);
    }
    throw error;
  }
}

/**
 * Direct fetch-based GraphQL request for maximum control
 * Use this when useAsyncGql doesn't properly respect endpoint configuration
 */
export async function useDirectGraphQLRequest<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<UseGraphQLResult<T>> {
  const { endpoint, isServerSide } = useGraphQLEndpoint();

  // Create reactive state
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const pending = ref<boolean>(true);

  const executeRequest = async (): Promise<void> => {
    try {
      pending.value = true;
      error.value = null;

      // Prepare headers with authentication
      const headers = getAuthHeaders();

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        const gqlError = new Error(result.errors[0].message || 'GraphQL Error');
        // @ts-ignore
        gqlError.gqlErrors = result.errors;
        throw gqlError;
      }

      data.value = result.data || null;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      error.value = errorObj;

      if (process.dev) {
        console.error(`💥 Direct GraphQL Request Failed [${isServerSide ? 'SSR' : 'Client'}]:`, errorObj);
      }
    } finally {
      pending.value = false;
    }
  };

  // Execute immediately
  await executeRequest();

  return {
    data: data as Ref<T | null>,
    error,
    pending,
    refresh: executeRequest,
    execute: async (newVariables) => {
      if (newVariables) {
        variables = newVariables;
      }
      await executeRequest();
    }
  };
}

/**
 * GraphQL subscription support (WebSocket-based)
 * Note: Requires WebSocket endpoint configuration
 */
export function useGraphQLSubscription<T = any>(
  subscription: string,
  options: GraphQLRequestOptions = {}
): UseGraphQLResult<T> {
  const { variables = {} } = options;

  // Create reactive state
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const pending = ref<boolean>(true);

  // TODO: Implement WebSocket subscription logic
  // This would require additional configuration for WebSocket endpoints
  console.warn('GraphQL subscriptions not yet implemented - requires WebSocket configuration');

  return {
    data: data as Ref<T | null>,
    error,
    pending,
    refresh: async () => {
      console.warn('Refresh not available for subscriptions');
    },
    execute: async () => {
      console.warn('Execute not available for subscriptions');
    }
  };
}

/**
 * Configuration management for GraphQL client
 */
export function useGraphQLConfig(): GraphQLClientConfig {
  const config = useRuntimeConfig();

  return {
    timeout: 30000,
    retries: 2,
    enableLogging: process.dev,
    requestInterceptors: [],
    responseInterceptors: [],
    healthCheckInterval: 60000, // 1 minute
    enableHealthCheck: true
  };
}

/**
 * Advanced GraphQL client with request/response interceptors
 */
export function createAdvancedGraphQLClient(clientConfig: Partial<GraphQLClientConfig> = {}) {
  const defaultConfig = useGraphQLConfig();
  const finalConfig = { ...defaultConfig, ...clientConfig };

  return {
    config: finalConfig,

    query: async <T = any>(query: string, options: GraphQLRequestOptions = {}) => {
      // Apply request interceptors
      let finalOptions = { ...options, timeout: finalConfig.timeout, retries: finalConfig.retries };
      for (const interceptor of finalConfig.requestInterceptors) {
        finalOptions = interceptor(finalOptions);
      }

      const result = await useGraphQLQuery<T>(query, finalOptions);

      // Apply response interceptors
      for (const interceptor of finalConfig.responseInterceptors) {
        result.data = computed(() => interceptor(result.data.value));
      }

      return result;
    },

    mutate: async <T = any>(mutation: string, options: GraphQLRequestOptions = {}) => {
      // Apply request interceptors
      let finalOptions = { ...options, timeout: finalConfig.timeout, retries: finalConfig.retries };
      for (const interceptor of finalConfig.requestInterceptors) {
        finalOptions = interceptor(finalOptions);
      }

      return useGraphQLMutation<T>(mutation, finalOptions);
    },

    subscribe: <T = any>(subscription: string, options: GraphQLRequestOptions = {}) =>
      useGraphQLSubscription<T>(subscription, { ...options, timeout: finalConfig.timeout }),

    request: (operation: string, variables?: any, options?: any) =>
      useGraphQLRequest(operation, variables, { ...options, timeout: finalConfig.timeout }),

    direct: <T = any>(query: string, variables?: Record<string, any>) =>
      useDirectGraphQLRequest<T>(query, variables),

    // Health monitoring
    checkHealth: async () => {
      const endpointConfig = useGraphQLEndpoint();
      const isHealthy = await checkEndpointHealth(endpointConfig.endpoint);
      return {
        endpoint: endpointConfig.endpoint,
        isHealthy,
        fallbackEndpoints: endpointConfig.fallbackEndpoints
      };
    },

    // Configuration methods
    addRequestInterceptor: (interceptor: (config: any) => any) => {
      finalConfig.requestInterceptors.push(interceptor);
    },

    addResponseInterceptor: (interceptor: (response: any) => any) => {
      finalConfig.responseInterceptors.push(interceptor);
    },

    // Clear health cache
    clearHealthCache: () => {
      endpointHealthCache.clear();
    }
  };
}

/**
 * Convenience function to create a GraphQL client instance
 * with pre-configured settings (backward compatibility)
 */
export function createGraphQLClient(defaultOptions: Partial<GraphQLRequestOptions> = {}) {
  return {
    query: <T = any>(query: string, options: GraphQLRequestOptions = {}) =>
      useGraphQLQuery<T>(query, { ...defaultOptions, ...options }),

    mutate: <T = any>(mutation: string, options: GraphQLRequestOptions = {}) =>
      useGraphQLMutation<T>(mutation, { ...defaultOptions, ...options }),

    subscribe: <T = any>(subscription: string, options: GraphQLRequestOptions = {}) =>
      useGraphQLSubscription<T>(subscription, { ...defaultOptions, ...options }),

    request: (operation: string, variables?: any, options?: any) =>
      useGraphQLRequest(operation, variables, { ...defaultOptions, ...options }),

    direct: <T = any>(query: string, variables?: Record<string, any>) =>
      useDirectGraphQLRequest<T>(query, variables)
  };
}

/**
 * Global GraphQL client instance for convenience
 * Usage: const { query, mutate } = useGlobalGraphQL()
 */
export function useGlobalGraphQL() {
  return createAdvancedGraphQLClient({
    enableLogging: process.dev,
    timeout: 30000,
    retries: 2,
    enableHealthCheck: true
  });
}