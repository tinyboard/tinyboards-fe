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

// GraphQL configuration with fallback support
function getGraphQLConfig() {
  const path = require('path');
  const fs = require('fs');

  const localSchemaPath = path.resolve(__dirname, 'schema.graphql');
  const apiEndpoint = constructGraphQLEndpoint();

  if (process.env.SKIP_GQL_GENERATE === 'true') {
    // During build: use local schema file and generate types from it
    return {
      schema: localSchemaPath,
      tokenStorage: {
        name: 'token',
        mode: 'cookie'
      },
      codegen: {
        skipDocumentsValidation: true,
        respectGitIgnore: false,
        generates: {
          '.nuxt/gql/': {
            preset: 'client',
            config: {
              useTypeImports: true
            }
          }
        }
      }
    };
  }

  // At runtime: intelligent schema loading
  const config = {
    tokenStorage: {
      name: 'token',
      mode: 'cookie'
    },
    codegen: {
      skipDocumentsValidation: true,
      respectGitIgnore: false,
      generates: {
        '.nuxt/gql/': {
          preset: 'client',
          config: {
            useTypeImports: true
          }
        }
      }
    }
  };

  // Try API endpoint first, with fallback to local schema
  if (fs.existsSync(localSchemaPath)) {
    config.schema = [apiEndpoint, localSchemaPath];
  } else {
    config.schema = apiEndpoint;
  }

  return config;
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
    ...(process.env.SKIP_GQL_GENERATE === 'true' ? [] : ["nuxt-graphql-client"]),
    "@pinia/nuxt"
  ],

  /*pinia: {
    storesDirs: ['./stores/**']
  },*/

  //i18n: {},
  routeRules: {
    // Static prerendered pages (disabled during build)
    "/help/**": process.env.SKIP_GQL_GENERATE === 'true' ? {
      ssr: false
    } : {
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

    // Static homepage redirect (disabled prerender during build)
    "/": process.env.SKIP_GQL_GENERATE === 'true' ? {
      redirect: "/feed"
    } : {
      redirect: "/feed",
      prerender: true
    }
  },

  runtimeConfig: {
    public: {
      domain: validateProdEnvVar('NUXT_PUBLIC_DOMAIN', 'localhost:8536'),
      use_https: validateProdEnvVar('NUXT_PUBLIC_USE_HTTPS', 'false') === 'true',
      GQL_HOST: constructGraphQLEndpoint(),
    },
  },

  ...(process.env.SKIP_GQL_GENERATE === 'true' ? {} : { 'graphql-client': getGraphQLConfig() }),

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
      alias: process.env.SKIP_GQL_GENERATE === 'true' ? {
        '#gql/default': require('path').resolve(__dirname, 'build-mocks/default.ts'),
        '#gql': require('path').resolve(__dirname, 'build-mocks/gql.ts')
      } : {}
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
