// Runtime GraphQL client initialization and schema management
export default defineNuxtPlugin(async (nuxtApp) => {
  // Skip if nuxt-graphql-client module is already loaded
  if (nuxtApp.$gql) return;

  const config = useRuntimeConfig();

  // Construct GraphQL endpoint from runtime config
  const protocol = config.public.use_https ? 'https' : 'http';
  const gqlEndpoint = `${protocol}://${config.public.domain}/api/v2/graphql`;

  // Create a basic GraphQL client for runtime when module wasn't loaded during build
  const createGraphQLClient = () => {
    const client = {
      async request(query: string, variables?: any) {
        try {
          const response = await fetch(gqlEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(process.client && document.cookie.includes('token') ? {
                'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
              } : {})
            },
            body: JSON.stringify({ query, variables })
          });

          if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status}`);
          }

          const result = await response.json();

          if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL error');
          }

          return result.data;
        } catch (error) {
          console.warn('GraphQL request failed:', error);
          throw error;
        }
      }
    };

    return client;
  };

  // Function to check if backend is available
  const checkBackendAvailability = async () => {
    try {
      const response = await fetch(gqlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'query { __schema { queryType { name } } }' })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data?.__schema) {
          console.log('✅ GraphQL backend is available');
          return true;
        }
      }
    } catch (error) {
      console.log('⚠️ GraphQL backend not yet available, will retry...');
    }
    return false;
  };

  // Initialize the client
  const gqlClient = createGraphQLClient();

  // Make it available globally
  nuxtApp.provide('gql', gqlClient);

  // Check backend availability on startup
  if (process.client) {
    setTimeout(async () => {
      await checkBackendAvailability();
    }, 1000);
  }
});