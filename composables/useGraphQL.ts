/**
 * Enhanced GraphQL composable with proper SSR/client-side endpoint routing
 * This wrapper ensures server-side requests use internal endpoints while
 * client-side requests use external endpoints in Docker environments.
 */

export function useGraphQLEndpoint() {
  const config = useRuntimeConfig();

  const getEndpoint = () => {
    if (process.server) {
      // Server-side: prefer internal endpoint
      if (config.GQL_HOST) {
        if (process.dev) {
          console.log(`🔍 Server GraphQL endpoint: ${config.GQL_HOST}`);
        }
        return config.GQL_HOST;
      }

      const internalUrl = config.INTERNAL_BACKEND_URL;
      if (internalUrl) {
        const endpoint = `${internalUrl}/api/v2/graphql`;
        if (process.dev) {
          console.log(`🔍 Server GraphQL endpoint (from env): ${endpoint}`);
        }
        return endpoint;
      }

      // Production fallback
      if (process.env.NODE_ENV === 'production') {
        const endpoint = 'http://tinyboards:8536/api/v2/graphql';
        if (process.dev) {
          console.log(`🔍 Server GraphQL endpoint (production fallback): ${endpoint}`);
        }
        return endpoint;
      }
    }

    // Client-side: use external endpoint
    const endpoint = config.public.GQL_HOST;
    if (process.dev && process.client) {
      console.log(`🔍 Client GraphQL endpoint: ${endpoint}`);
    }
    return endpoint;
  };

  return {
    endpoint: getEndpoint(),
    isServerSide: process.server,
    isClientSide: process.client
  };
}

/**
 * Custom GraphQL request function that ensures proper endpoint routing
 */
export async function useGraphQLRequest(operation: string, variables?: any, options?: any) {
  const { endpoint, isServerSide } = useGraphQLEndpoint();

  if (process.dev) {
    console.log(`🔧 GraphQL Request [${isServerSide ? 'SSR' : 'Client'}] to: ${endpoint}`);
    console.log(`📝 Operation: ${operation}`);
    if (variables) {
      console.log(`📋 Variables:`, variables);
    }
  }

  try {
    // Use the standard useAsyncGql with endpoint override
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
export async function useDirectGraphQLRequest(query: string, variables?: any) {
  const { endpoint, isServerSide } = useGraphQLEndpoint();
  const config = useRuntimeConfig();

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Handle authentication
  if (process.server) {
    // Server-side: get cookie from SSR context
    const cookieHeader = useNuxtApp().ssrContext?.event.req.headers['cookie'];
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
  } else {
    // Client-side: get token from cookie
    const tokenCookie = useCookie('token');
    if (tokenCookie.value) {
      headers['Authorization'] = `Bearer ${tokenCookie.value}`;
    }
  }

  if (process.dev) {
    console.log(`🚀 Direct GraphQL Request [${isServerSide ? 'SSR' : 'Client'}] to: ${endpoint}`);
  }

  try {
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

    const result = await response.json();

    if (result.errors) {
      const error = new Error(result.errors[0]?.message || 'GraphQL Error');
      // @ts-ignore
      error.gqlErrors = result.errors;
      throw error;
    }

    return {
      data: ref(result.data),
      error: ref(null),
      pending: ref(false)
    };
  } catch (error) {
    if (process.dev) {
      console.error(`💥 Direct GraphQL Request Failed [${isServerSide ? 'SSR' : 'Client'}]:`, error);
    }

    return {
      data: ref(null),
      error: ref(error),
      pending: ref(false)
    };
  }
}