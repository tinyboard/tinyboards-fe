#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Runtime GraphQL schema generation script
 * This runs when the container starts to generate real GraphQL types
 */

async function generateGraphQLTypes() {
  console.log('🔄 Generating GraphQL types from backend...');

  const domain = process.env.NUXT_PUBLIC_DOMAIN;
  const useHttps = process.env.NUXT_PUBLIC_USE_HTTPS === 'true';

  if (!domain) {
    console.error('❌ NUXT_PUBLIC_DOMAIN environment variable is required');
    process.exit(1);
  }

  const protocol = useHttps ? 'https' : 'http';
  const endpoint = `${protocol}://${domain}/api/v2/graphql`;

  console.log(`📡 Connecting to: ${endpoint}`);

  try {
    // Test if backend is accessible
    const testCommand = `curl -f -s -o /dev/null "${endpoint}" || curl -f -s -X POST -H "Content-Type: application/json" -d '{"query":"query{__schema{queryType{name}}}"}' "${endpoint}"`;
    execSync(testCommand, { stdio: 'pipe' });

    // Remove SKIP_GQL_GENERATE temporarily and regenerate
    const originalSkip = process.env.SKIP_GQL_GENERATE;
    delete process.env.SKIP_GQL_GENERATE;

    // Run nuxt prepare to regenerate GraphQL types
    console.log('🔧 Regenerating GraphQL client types...');
    execSync('npx nuxt prepare --no-generate', {
      stdio: 'inherit',
      env: {
        ...process.env,
        NUXT_PUBLIC_DOMAIN: domain,
        NUXT_PUBLIC_USE_HTTPS: useHttps ? 'true' : 'false'
      }
    });

    // Restore original environment
    if (originalSkip) {
      process.env.SKIP_GQL_GENERATE = originalSkip;
    }

    console.log('✅ GraphQL types generated successfully');

  } catch (error) {
    console.warn('⚠️  Could not connect to backend, using fallback schema');
    console.warn(`Backend endpoint: ${endpoint}`);
    console.warn('Make sure your backend is running and accessible');

    // Continue with existing schema - don't fail the startup
    return false;
  }

  return true;
}

// Only run if called directly
if (require.main === module) {
  generateGraphQLTypes()
    .then(success => {
      if (!success) {
        console.log('📋 Using build-time schema - some features may be limited');
      }
    })
    .catch(error => {
      console.error('💥 Failed to generate GraphQL types:', error.message);
      console.log('📋 Continuing with build-time schema...');
    });
}

module.exports = { generateGraphQLTypes };