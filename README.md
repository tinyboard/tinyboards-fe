# TinyBoards Frontend 🎨

> Modern, responsive web interface for TinyBoards built with Nuxt.js 3 and Vue.js 3

[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-3.x-00DC82.svg)](https://nuxt.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC.svg)](https://tailwindcss.com/)

## About

This is the official frontend application for TinyBoards, providing a modern, responsive web interface for the TinyBoards social media platform. Built with cutting-edge web technologies, it offers a smooth user experience with real-time updates, dark mode support, and mobile-first design.

### Key Features

- 🌐 **Universal Rendering** - Server-side rendering (SSR) with client-side hydration
- 📱 **Mobile-First Design** - Responsive design that works on all devices
- 🌙 **Dark Mode Support** - Toggle between light and dark themes
- ⚡ **Real-time Updates** - Live notifications and content updates
- 🔐 **Secure Authentication** - JWT-based authentication with HTTP-only cookies
- 🎨 **Modern UI Components** - Beautiful, accessible components with Headless UI
- 🚀 **Performance Optimized** - Fast loading with code splitting and lazy loading
- 🌍 **Internationalization** - Multi-language support (i18n)
- 📊 **GraphQL Integration** - Efficient data fetching with GraphQL client

## Technology Stack

### Core Framework
- **[Nuxt.js 3](https://nuxt.com/)** - Vue.js meta-framework with SSR/SPA capabilities
- **[Vue.js 3](https://vuejs.org/)** - Progressive JavaScript framework with Composition API
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms)** - Form styling plugin
- **[@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)** - Typography plugin
- **[@headlessui/vue](https://headlessui.com/)** - Unstyled, accessible UI components

### State Management & Data
- **[Pinia](https://pinia.vuejs.org/)** - Intuitive state management for Vue
- **[nuxt-graphql-client](https://github.com/diizzayy/nuxt-graphql-client)** - GraphQL client integration
- **[GraphQL](https://graphql.org/)** - Query language for APIs

### Additional Features
- **[@nuxtjs/i18n](https://i18n.nuxtjs.org/)** - Internationalization support
- **[date-fns](https://date-fns.org/)** - Date utility library
- **[marked](https://marked.js.org/)** - Markdown parser and compiler
- **[vue-advanced-cropper](https://advanced-cropper.github.io/vue-advanced-cropper/)** - Image cropping component

## Quick Start

### Prerequisites

Before setting up the frontend, ensure you have:

- **Node.js** (18+ recommended) - [Install from nodejs.org](https://nodejs.org/)
- **npm** or **yarn** package manager
- **TinyBoards Backend** running on `localhost:8536`

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd tinyboards-fe
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

Configure your `.env` file:
```bash
# Backend API Configuration
NUXT_PUBLIC_DOMAIN=localhost:8536
NUXT_PUBLIC_USE_HTTPS=false

# GraphQL Configuration is automatic

# Development settings
NODE_ENV=development
```

#### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

#### 5. Access the Application
- **Frontend**: `http://localhost:3000`
- **Hot reload**: Changes automatically reflected

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start

# Or generate static site
npm run generate
```

## Project Structure

```
tinyboards-fe/
├── components/          # Vue components
│   ├── cards/          # Card components (PostCard, BoardCard)
│   ├── containers/     # Layout containers
│   ├── dialogs/        # Modal dialogs
│   ├── inputs/         # Form input components
│   ├── lists/          # List components
│   ├── menus/          # Menu components
│   ├── navigation/     # Navigation components
│   ├── pages/          # Page-specific components
│   ├── popovers/       # Popover components
│   ├── renderless/     # Logic-only components
│   └── tables/         # Table components
├── pages/              # File-based routing
│   ├── admin/          # Admin pages
│   ├── b/              # Board pages (/b/[boardname])
│   ├── boards/         # Board listing and management
│   ├── feed/           # User feed pages
│   ├── inbox/          # Message inbox
│   ├── p/              # Post pages (/p/[postid])
│   ├── settings/       # User settings
│   ├── @[username]/    # User profile pages
│   ├── login.vue       # Login page
│   ├── register.vue    # Registration page
│   ├── search.vue      # Search page
│   └── submit.vue      # Post submission page
├── stores/             # Pinia state stores
├── composables/        # Vue composables
├── middleware/         # Route middleware
├── plugins/            # Nuxt plugins
├── layouts/            # Layout components
├── graphql/            # GraphQL queries and mutations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── assets/             # Static assets
├── public/             # Public files
└── server/             # Server-side code
```

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Building
npm run build            # Build for production
npm run generate         # Generate static site
npm run preview          # Preview production build locally

# Utilities
npm run postinstall      # Prepare Nuxt (automatically run after install)
```

### Component Development

#### Creating New Components
```bash
# Create a new component
touch components/cards/MyNewCard.vue
```

```vue
<!-- components/cards/MyNewCard.vue -->
<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <h3 class="font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
    <p class="text-gray-600 dark:text-gray-300 mt-2">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>()
</script>
```

#### Using Components
```vue
<template>
  <div>
    <MyNewCard
      title="Example Title"
      description="This is an example description"
    />
  </div>
</template>
```

### GraphQL Integration

#### Adding New Queries
```bash
# Create GraphQL query file
touch graphql/queries/GetMyData.gql
```

```graphql
# graphql/queries/GetMyData.gql
query GetMyData($id: Int!) {
  myData(id: $id) {
    id
    name
    description
    createdAt
  }
}
```

#### Using Queries in Components
```vue
<script setup lang="ts">
const { data, pending, error } = await useAsyncGql('GetMyData', { id: 1 })
</script>

<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <h1>{{ data.myData.name }}</h1>
      <p>{{ data.myData.description }}</p>
    </div>
  </div>
</template>
```

### State Management with Pinia

#### Creating Stores
```typescript
// stores/myFeature.ts
export const useMyFeatureStore = defineStore('myFeature', () => {
  const items = ref<MyItem[]>([])
  const loading = ref(false)

  const fetchItems = async () => {
    loading.value = true
    try {
      const { data } = await $gql.default.request(GetItemsDocument)
      items.value = data.items
    } finally {
      loading.value = false
    }
  }

  return {
    items: readonly(items),
    loading: readonly(loading),
    fetchItems
  }
})
```

#### Using Stores
```vue
<script setup lang="ts">
const store = useMyFeatureStore()

onMounted(() => {
  store.fetchItems()
})
</script>

<template>
  <div>
    <div v-if="store.loading">Loading...</div>
    <div v-for="item in store.items" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>
```

### Styling Guidelines

#### Tailwind CSS Usage
```vue
<template>
  <!-- Light/Dark mode support -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

    <!-- Responsive design -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      <!-- Interactive states -->
      <button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 rounded">
        Click me
      </button>
    </div>
  </div>
</template>
```

#### Custom CSS (when needed)
```vue
<style scoped>
.custom-component {
  /* Use @apply for Tailwind utilities */
  @apply flex items-center justify-between p-4 rounded-lg;

  /* Custom CSS for complex styling */
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}
</style>
```

## Configuration

### Environment Variables

```bash
# .env
# Backend connection
NUXT_PUBLIC_DOMAIN=localhost:8536              # Backend domain
NUXT_PUBLIC_USE_HTTPS=false                    # Use HTTPS (true/false)

# Development settings
NODE_ENV=development                           # Environment mode

# Optional: Custom GraphQL endpoint
NUXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8536/api/v2/graphql
```

### Nuxt Configuration

Key configuration options in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-graphql-client',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  // GraphQL client configuration
  'graphql-client': {
    schema: constructGraphQLEndpoint(),
    tokenStorage: {
      name: 'token',
      mode: 'cookie'
    }
  },

  // CSS frameworks
  css: ['~/assets/css/main.css'],

  // TypeScript configuration
  typescript: {
    strict: true
  }
})
```

## Deployment

### Docker Deployment

#### Using Docker
```bash
# Build Docker image
docker build -t tinyboards-fe .

# Run container
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_DOMAIN=your-backend-domain.com \
  -e NUXT_PUBLIC_USE_HTTPS=true \
  tinyboards-fe
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NUXT_PUBLIC_DOMAIN=your-backend-domain.com
      - NUXT_PUBLIC_USE_HTTPS=true
    depends_on:
      - backend
```

### Static Site Generation

```bash
# Generate static site
npm run generate

# Deploy the .output/public directory to your static host
# (Netlify, Vercel, GitHub Pages, etc.)
```

### Server-Side Rendering

```bash
# Build for SSR
npm run build

# Start production server
npm run start

# Or use PM2 for production
pm2 start ecosystem.config.js
```

## Backend Integration

### GraphQL API Connection

The frontend connects to the TinyBoards backend GraphQL API:

- **Development**: `http://localhost:8536/api/v2/graphql`
- **Production**: Configure via `NUXT_PUBLIC_DOMAIN` environment variable

### Authentication Flow

1. User logs in via login page
2. JWT token received from backend
3. Token stored in HTTP-only cookie
4. Cookie automatically sent with all requests
5. User state managed in Pinia store

### Real-time Features

- Reactive state management with Pinia
- Optimistic UI updates for better UX
- GraphQL client-side caching
- Live notifications (when implemented)

## Testing

### Running Tests
```bash
# Unit tests (when configured)
npm run test

# E2E tests (when configured)
npm run test:e2e

# Type checking
npx vue-tsc --noEmit
```

### Development Testing
```bash
# Start backend (clone from GitHub if needed)
git clone https://github.com/tinyboard/tinyboards
cd tinyboards && cargo run

# Start frontend (in tinyboards-fe directory)
npm run dev

# Test the full stack
open http://localhost:3000
```

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Install dependencies**: `npm install`
4. **Start development server**: `npm run dev`
5. **Make your changes** following the coding standards
6. **Test your changes** thoroughly
7. **Build the project**: `npm run build`
8. **Commit your changes**: `git commit -m 'Add amazing feature'`
9. **Push to the branch**: `git push origin feature/amazing-feature`
10. **Open a Pull Request**

### Code Style Guidelines

- **Vue.js**: Follow Vue 3 Composition API patterns
- **TypeScript**: Use proper typing for all props and functions
- **Tailwind CSS**: Use utility classes, avoid custom CSS when possible
- **Components**: Keep components small and focused
- **Naming**: Use PascalCase for components, camelCase for variables
- **Accessibility**: Ensure all components are accessible

### Component Guidelines

```vue
<!-- Good: Clear, typed, accessible component -->
<template>
  <button
    :disabled="loading"
    :aria-label="ariaLabel"
    class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded focus:ring-2"
    @click="handleClick"
  >
    <Icon v-if="icon" :name="icon" class="mr-2" />
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
  icon?: string
  ariaLabel?: string
}

interface Emits {
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  if (!props.loading) {
    emit('click', event)
  }
}
</script>
```

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Nuxt cache
rm -rf .nuxt

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx vue-tsc --noEmit
```

#### GraphQL Connection Issues
```bash
# Check backend is running
curl http://localhost:8536/api/v2/graphql

# Verify environment variables
echo $NUXT_PUBLIC_DOMAIN

# Check GraphQL schema generation
npm run generate
```

#### Hot Reload Not Working
```bash
# Check file permissions
ls -la pages/

# Restart development server
npm run dev

# Check for syntax errors in components
```

### Development Tips

- **Use Vue DevTools** - Install the Vue.js DevTools browser extension
- **GraphQL Playground** - Use `http://localhost:8536/graphql` for API testing
- **Tailwind IntelliSense** - Install Tailwind CSS IntelliSense VS Code extension
- **Type Safety** - Enable TypeScript strict mode for better development experience

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](../LICENSE) file for details.

## Related Projects

- **[TinyBoards Backend](https://github.com/tinyboard/tinyboards)** - Rust/GraphQL backend API
- **[TinyBoards API Documentation](https://github.com/tinyboard/tinyboards/tree/master/docs)** - Complete API reference

## Support

- 📚 **Backend Documentation**: Check the [TinyBoards docs](https://github.com/tinyboard/tinyboards/tree/master/docs) directory
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💬 **Discussions**: Use GitHub Discussions for questions
- 📧 **Security Issues**: Email security concerns privately

---

**Built with ❤️ using Vue.js 3, Nuxt.js 3, and TypeScript**