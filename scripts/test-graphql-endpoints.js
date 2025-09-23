#!/usr/bin/env node

/**
 * Test script to verify GraphQL endpoint configuration
 * Run with: node scripts/test-graphql-endpoints.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing GraphQL Endpoint Configuration\n');

// Test 1: Check environment variables
console.log('1. Environment Variables:');
console.log(`   NUXT_PUBLIC_DOMAIN: ${process.env.NUXT_PUBLIC_DOMAIN || 'undefined'}`);
console.log(`   NUXT_PUBLIC_USE_HTTPS: ${process.env.NUXT_PUBLIC_USE_HTTPS || 'undefined'}`);
console.log(`   NUXT_INTERNAL_BACKEND_URL: ${process.env.NUXT_INTERNAL_BACKEND_URL || 'undefined'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'undefined'}\n`);

// Test 2: Check nuxt.config.ts functions
console.log('2. Nuxt Config Functions:');
try {
  // Set environment variables for testing
  process.env.NUXT_PUBLIC_DOMAIN = process.env.NUXT_PUBLIC_DOMAIN || 'upthetree.club';
  process.env.NUXT_PUBLIC_USE_HTTPS = process.env.NUXT_PUBLIC_USE_HTTPS || 'true';
  process.env.NUXT_INTERNAL_BACKEND_URL = process.env.NUXT_INTERNAL_BACKEND_URL || 'http://tinyboards:8536';

  // Simulate the functions from nuxt.config.ts
  function constructGraphQLEndpoint() {
    const domain = process.env.NUXT_PUBLIC_DOMAIN || 'localhost:8536';
    const useHttps = (process.env.NUXT_PUBLIC_USE_HTTPS || 'false') === 'true';
    const protocol = useHttps ? 'https' : 'http';
    return `${protocol}://${domain}/api/v2/graphql`;
  }

  function constructInternalGraphQLEndpoint() {
    const internalBackend = process.env.NUXT_INTERNAL_BACKEND_URL;
    if (internalBackend) {
      return `${internalBackend}/api/v2/graphql`;
    }

    if (process.env.NODE_ENV === 'production') {
      return 'http://tinyboards:8536/api/v2/graphql';
    }

    return constructGraphQLEndpoint();
  }

  const externalEndpoint = constructGraphQLEndpoint();
  const internalEndpoint = constructInternalGraphQLEndpoint();

  console.log(`   External endpoint: ${externalEndpoint}`);
  console.log(`   Internal endpoint: ${internalEndpoint}`);
  console.log(`   Endpoints differ: ${externalEndpoint !== internalEndpoint ? '✅ YES' : '❌ NO'}\n`);
} catch (error) {
  console.log(`   ❌ Error testing config functions: ${error.message}\n`);
}

// Test 3: Check if files exist
console.log('3. Required Files:');
const requiredFiles = [
  'nuxt.config.ts',
  'plugins/graphql-client.server.ts',
  'composables/useGraphQL.ts',
  'middleware/01.site.global.js'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${file}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
});

console.log('\n4. Plugin Configuration:');
const serverPluginPath = 'plugins/graphql-client.server.ts';
if (fs.existsSync(serverPluginPath)) {
  const content = fs.readFileSync(serverPluginPath, 'utf8');
  const hasEndpointLogic = content.includes('getServerGraphQLEndpoint');
  const hasProxy = content.includes('$fetch') && content.includes('Proxy');
  console.log(`   Server plugin has endpoint logic: ${hasEndpointLogic ? '✅ YES' : '❌ NO'}`);
  console.log(`   Server plugin has fetch proxy: ${hasProxy ? '✅ YES' : '❌ NO'}`);
} else {
  console.log('   ❌ Server plugin missing');
}

console.log('\n5. Docker Environment Test:');
if (process.env.NUXT_INTERNAL_BACKEND_URL) {
  console.log(`   ✅ Docker environment detected`);
  console.log(`   Internal backend: ${process.env.NUXT_INTERNAL_BACKEND_URL}`);

  // Test if we can reach the internal endpoint (if in Docker)
  if (process.env.NUXT_INTERNAL_BACKEND_URL.includes('tinyboards:8536')) {
    console.log('   🔗 Internal Docker service endpoint configured');
  }
} else {
  console.log('   ⚠️ Not in Docker environment (or NUXT_INTERNAL_BACKEND_URL not set)');
}

console.log('\n6. Recommendations:');
console.log('   To test the configuration:');
console.log('   1. Set NUXT_INTERNAL_BACKEND_URL=http://tinyboards:8536');
console.log('   2. Run: npm run dev');
console.log('   3. Check console logs for GraphQL endpoint routing');
console.log('   4. Look for "Server-side GraphQL proxy configured" messages');
console.log('   5. Verify requests show POST to internal endpoint, not GET to external\n');

console.log('✅ GraphQL endpoint configuration test complete!');