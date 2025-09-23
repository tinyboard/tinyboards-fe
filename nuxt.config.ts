// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { defineNuxtConfig } from "nuxt/config";
import tsconfigPaths from 'vite-tsconfig-paths';

const tls = require("tls");

// this is to read env vars to set the base url for graphql requests
const process = require("process");
tls.DEFAULT_ECDH_CURVE = "auto";

// Environment validation and endpoint construction
function validateEnvVar(name: string, fallback?: string): string {
  const value = process.env[name];
  if (!value && !fallback) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value || fallback || '';
}

function validateProdEnvVar(name: string, fallback?: string): string {
  const value = process.env[name];

  // In production, require explicit values
  if (process.env.NODE_ENV === 'production' && !value) {
    throw new Error(`Required production environment variable ${name} is not set`);
  }

  return value || fallback || '';
}

function constructGraphQLEndpoint(): string {
  const domain = validateProdEnvVar('NUXT_PUBLIC_DOMAIN', 'localhost:8536');
  const useHttps = validateProdEnvVar('NUXT_PUBLIC_USE_HTTPS', 'false') === 'true';
  const protocol = useHttps ? 'https' : 'http';
  return `${protocol}://${domain}/api/v2/graphql`;
}

// Note: Server-side GraphQL endpoint is now configured via GQL_HOST environment variable in docker-compose

// GraphQL configuration
function getGraphQLConfig() {
  const buildTimeEndpoint = constructGraphQLEndpoint();
  const externalEndpoint = process.env.GQL_HOST || buildTimeEndpoint;
  const internalEndpoint = process.env.NUXT_INTERNAL_GQL_HOST || 'http://tinyboards:8536/api/v2/graphql';

  console.log('🔧 GraphQL Config:');
  console.log('  Build-time endpoint (schema):', buildTimeEndpoint);
  console.log('  External endpoint (client):', externalEndpoint);
  console.log('  Internal endpoint (server):', internalEndpoint);

  return {
    clients: {
      default: {
        // Schema introspection for build-time codegen
        schema: buildTimeEndpoint,
        introspectionHost: buildTimeEndpoint,
        // Primary host for server-side and fallback
        host: externalEndpoint,
      }
    },
    tokenStorage: {
      name: 'token',
      mode: 'cookie'
    },
    proxyCookies: true,
    proxyHeaders: true,
    autoImport: true,
    functionPrefix: '',
    codegen: {
      skipDocumentsValidation: true,
      respectGitIgnore: false,
      silent: false,
      verbose: true,
      generates: {
        '.nuxt/gql/': {
          preset: 'client',
          config: {
            useTypeImports: true,
            skipTypename: true,
            enumsAsTypes: true,
            documentMode: 'string'
          }
        }
      }
    }
  };
}

export default defineNuxtConfig({
  devtools: { enabled: true },

  // Reduce console noise
  nitro: {
    logLevel: process.env.NODE_ENV === 'development' ? 1 : 0,
  },

  // alias: {
  //   pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  // },

  devServer: {
    port: 3000,
    host: "localhost",
  },

  app: {
    head: {
      link: [
        {
          rel: "preload",
          href: "/_nuxt/assets/fonts/Mona-Sans.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "anonymous",
        },
      ],
    },
  },

  css: ["~/assets/css/main.css"],
  devServerHandlers: [],
  modern: true,

  modules: [
    "@nuxtjs/tailwindcss",
    //"@nuxtjs/i18n",
    "nuxt-graphql-client",
    "@pinia/nuxt"
  ],

  /*pinia: {
    storesDirs: ['./stores/**']
  },*/

  //i18n: {},
  routeRules: {
    // Static prerendered pages
    "/help/**": {
      static: true,
      prerender: true,
      headers: { 'Cache-Control': 's-maxage=86400' }
    },

    // SSR with caching for user profiles
    "/@**": {
      ssr: true,
      headers: { 'Cache-Control': 's-maxage=300' }
    },

    // Hybrid rendering for feeds
    "/feed/**": {
      ssr: true,
      headers: { 'Cache-Control': 's-maxage=300' }
    },

    // SPA for admin interfaces
    "/admin/**": {
      ssr: false,
      index: false
    },
    "/settings/**": {
      ssr: false,
      index: false
    },
    // SPA for auth pages to avoid SSR redirect issues
    "/login": {
      ssr: false
    },
    "/register": {
      ssr: false
    },

    // Board pages with SSR for SEO
    "/b/**": {
      ssr: true,
      headers: { 'Cache-Control': 's-maxage=300' }
    },

    // Static homepage redirect
    "/": {
      redirect: "/feed",
      prerender: true
    }
  },

  runtimeConfig: {
    public: {
      domain: validateProdEnvVar('NUXT_PUBLIC_DOMAIN', 'localhost:8536'),
      use_https: validateProdEnvVar('NUXT_PUBLIC_USE_HTTPS', 'false') === 'true',
      // Make GraphQL endpoint available to client-side
      GQL_HOST: process.env.NUXT_PUBLIC_GQL_HOST || process.env.GQL_HOST || constructGraphQLEndpoint(),
    },
    // GraphQL endpoint for server-side
    GQL_HOST: process.env.GQL_HOST || constructGraphQLEndpoint(),
    // Internal GraphQL endpoint for server-side requests
    NUXT_INTERNAL_GQL_HOST: process.env.NUXT_INTERNAL_GQL_HOST || 'http://tinyboards:8536/api/v2/graphql',
  },

  'graphql-client': getGraphQLConfig(),

  /*apollo: {
    clients: {
      default: {
        httpEndpoint: `${process.env.NUXT_PUBLIC_USE_HTTPS === "true" ? "https" : "http"}://${process.env.NUXT_PUBLIC_DOMAIN}/api/v2/graphql`,
        tokenName: "token",
      },
    },
  },*/

  optimizeDeps: {
    exclude: ["@vueuse/head"],
  },

  compatibilityDate: "2024-10-06",

  vite: {
    plugins: [tsconfigPaths()],
    resolve: {
      alias: {}
    },
    server: {
      allowedHosts: ["localhost", "tinyboards.test"],
      hmr: {
        port: 3000,
        clientPort: 3000,
        host: 'localhost',
        protocol: 'ws'
      }
      // fs: {
      //   cachedChecks: false,
      // },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', '@vue/runtime-core'],
            'ui-components': ['@headlessui/vue'],
            'utils': ['date-fns', 'marked']
          }
        }
      }
    }
  },
});
