/**
 * Client-side plugin to ensure GraphQL requests use the correct runtime endpoint
 * This overrides any build-time configuration with runtime environment variables
 */

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  // Get the correct GraphQL endpoint for client-side requests
  const clientEndpoint = config.public.GQL_HOST

  if (process.client && clientEndpoint) {
    console.log('🔧 [GraphQL Runtime Config] Setting client endpoint to:', clientEndpoint)

    // Override the GraphQL client configuration
    const { $gql } = useNuxtApp()

    if ($gql && $gql.default) {
      // Update the GraphQL client host if possible
      if ($gql.default.host) {
        $gql.default.host = clientEndpoint
        console.log('✅ [GraphQL Runtime Config] Updated GraphQL client host to:', clientEndpoint)
      }
    }
  }
})