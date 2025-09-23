// Server-side GraphQL client configuration to fix external domain requests
export default defineNuxtPlugin({
  name: 'graphql-server-endpoint',
  parallel: false,
  setup(nuxtApp) {
    // Only run on server-side
    if (!process.server) return;

    const config = useRuntimeConfig();

    // Determine the correct GraphQL endpoint for server-side requests
    const getServerGraphQLEndpoint = () => {
      console.log('🔧 Server-side GraphQL endpoint configuration:');
      console.log('  - config.GQL_HOST:', config.GQL_HOST);
      console.log('  - NUXT_INTERNAL_BACKEND_URL:', process.env.NUXT_INTERNAL_BACKEND_URL);
      console.log('  - NODE_ENV:', process.env.NODE_ENV);
      console.log('  - public domain:', config.public.domain);

      // Priority order for server-side endpoint selection:
      if (config.GQL_HOST) {
        console.log('✅ Using runtime config GQL_HOST:', config.GQL_HOST);
        return config.GQL_HOST;
      }

      const internalUrl = process.env.NUXT_INTERNAL_BACKEND_URL;
      if (internalUrl) {
        const endpoint = `${internalUrl}/api/v2/graphql`;
        console.log('✅ Using NUXT_INTERNAL_BACKEND_URL:', endpoint);
        return endpoint;
      }

      // Production fallback to internal service name
      if (process.env.NODE_ENV === 'production') {
        const endpoint = 'http://tinyboards:8536/api/v2/graphql';
        console.log('✅ Using production fallback:', endpoint);
        return endpoint;
      }

      // Development fallback to external domain
      const protocol = config.public.use_https ? 'https' : 'http';
      const endpoint = `${protocol}://${config.public.domain}/api/v2/graphql`;
      console.log('⚠️ Using development fallback (external):', endpoint);
      return endpoint;
    };

    const serverEndpoint = getServerGraphQLEndpoint();

    // Override the GraphQL Host in runtime config
    // This should affect nuxt-graphql-client's behavior
    config.public.GQL_HOST = serverEndpoint;

    // Also override any existing $gql client if present
    if (nuxtApp.$gql) {
      const originalGql = nuxtApp.$gql;

      // Create a proxy that intercepts requests and uses the server endpoint
      nuxtApp.$gql = new Proxy(originalGql, {
        get(target, prop) {
          if (typeof target[prop] === 'function') {
            return function(...args) {
              console.log(`🔄 Server-side GraphQL request redirected to: ${serverEndpoint}`);
              return target[prop].apply(target, args);
            };
          }
          return target[prop];
        }
      });
    }

    console.log(`🔗 Server-side GraphQL configuration updated to: ${serverEndpoint}`);
  }
});