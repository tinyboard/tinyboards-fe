# TinyBoards Frontend Tests

This directory contains unit tests for the TinyBoards frontend application.

## Setup

The test suite uses [Vitest](https://vitest.dev/), a fast unit test framework for Vite projects.

### Install Test Dependencies

```bash
npm install -D vitest @vue/test-utils @vitest/ui happy-dom
```

### Configure Vitest

Add a `vitest.config.ts` file to the project root:

```typescript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

### Add Test Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Running Tests

### Run all tests in watch mode:
```bash
npm test
```

### Run tests once (CI mode):
```bash
npm run test:run
```

### Run tests with UI:
```bash
npm run test:ui
```

### Run tests with coverage:
```bash
npm run test:coverage
```

## Test Structure

```
tests/
├── composables/          # Tests for Vue composables
│   └── useUrlBuilder.test.ts
├── components/           # Tests for Vue components (future)
├── stores/              # Tests for Pinia stores (future)
└── utils/               # Tests for utility functions (future)
```

## Writing Tests

### Example Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { myFunction } from '@/composables/myComposable';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

### Mocking Stores

```typescript
import { vi } from 'vitest';
import { useSiteStore } from '@/stores/StoreSite';

vi.mock('@/stores/StoreSite', () => ({
  useSiteStore: vi.fn()
}));

// In your test:
vi.mocked(useSiteStore).mockReturnValue({
  enableBoards: true
} as any);
```

## Current Test Coverage

- ✅ `composables/useUrlBuilder.ts` - URL building logic

## Future Tests

- [ ] Component tests for Post, Comment, etc.
- [ ] Store tests for Pinia stores
- [ ] Integration tests for key user flows
- [ ] E2E tests with Playwright

## CI/CD Integration

To run tests in CI/CD pipelines, add this to your workflow:

```yaml
- name: Run tests
  run: npm run test:run
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
