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

function constructInternalGraphQLEndpoint(): string {
  // Use internal backend URL if provided (for Docker deployments)
  const internalBackend = process.env.NUXT_INTERNAL_BACKEND_URL;
  if (internalBackend) {
    return `${internalBackend}/api/v2/graphql`;
  }

  // For Docker production deployments, default to internal service name
  if (process.env.NODE_ENV === 'production') {
    return 'http://tinyboards:8536/api/v2/graphql';
  }

  // Fallback to external endpoint for development
  return constructGraphQLEndpoint();
}

// GraphQL configuration
function getGraphQLConfig() {
  // Use build-time endpoint for schema generation only
  const buildTimeEndpoint = constructGraphQLEndpoint();

  return {
    schema: buildTimeEndpoint,
    // Configure different endpoints for server vs client
    clients: {
      default: {
        host: buildTimeEndpoint,
      }
    },
    // Use runtime configuration for dynamic endpoint resolution
    options: {
      host: buildTimeEndpoint,
    },
    tokenStorage: {
      name: 'token',
      mode: 'cookie'
    },
    autoImport: true,
    functionPrefix: '',
    codegen: {
      skipDocumentsValidation: true,
      respectGitIgnore: false,
      silent: process.env.NODE_ENV === 'production',
      generates: {
        '.nuxt/gql/': {
          preset: 'client',
          config: {
            useTypeImports: true,
            skipTypename: true,
            enumsAsTypes: true
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
      // GQL_HOST for client-side requests
      GQL_HOST: constructGraphQLEndpoint(),
    },
    // Server-side GQL_HOST (will override public.GQL_HOST on server)
    GQL_HOST: constructInternalGraphQLEndpoint(),
    // Internal backend URL for Docker environments
    INTERNAL_BACKEND_URL: process.env.NUXT_INTERNAL_BACKEND_URL || null,
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
