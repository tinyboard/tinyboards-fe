# TinyBoards Frontend - Local Only

A local-only Nuxt.js frontend for TinyBoards, designed to work with the local-only backend.

## Features

- **Local-only operation** - No federation or ActivityPub functionality
- **Vue 3 + Nuxt 3** - Modern frontend framework
- **TailwindCSS** - Utility-first CSS framework
- **Pinia** - State management
- **TypeScript** - Type safety

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your local backend URL:
   ```env
   NUXT_PUBLIC_DOMAIN=localhost:8080
   NUXT_PUBLIC_USE_HTTPS=false
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## Configuration

The frontend is configured to work with a local TinyBoards backend by default:

- **Backend URL**: `http://localhost:8080/api/v1`  
- **HTTPS**: Disabled for local development
- **Federation**: Completely removed

## Local-Only Changes

This version has been modified to remove all federation functionality:

- Removed federation settings from admin panel
- Removed ActivityPub/federation API calls  
- Simplified configuration for local development
- Updated search to work with local-only backend

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build
- `npm run start` - Start production server

### Project Structure

```
components/     # Vue components
composables/    # Vue composables
layouts/        # Nuxt layouts  
pages/          # Vue pages
plugins/        # Nuxt plugins
stores/         # Pinia stores
utils/          # Utility functions
```

## Backend Integration

This frontend is designed to work with the local-only TinyBoards backend. Make sure your backend is:

1. Running on the configured domain (default: `localhost:8080`)
2. Has federation capabilities disabled
3. Serving the expected API endpoints at `/api/v1`

## License

Same license as TinyBoards project.