# TinyBoards Frontend Routing Structure

## Overview

The frontend now supports hierarchical URL routing with SEO-friendly slugs that adapt based on the `boardsEnabled` setting.

## URL Patterns

### Multi-Board Mode (`boardsEnabled: true`)

#### Posts
- `/b/:board/p/:id/:slug` - Generic post detail (all post types)
- `/b/:board/threads/:id/:slug` - Thread-specific post detail
- `/b/:board/feed/:id/:slug` - Feed-specific post detail

#### Sections
- `/b/:board` - Board homepage
- `/b/:board/threads` - Board threads listing
- `/b/:board/feed` - Board feed listing

### Single-Board Mode (`boardsEnabled: false`)

#### Posts
- `/p/:id/:slug` - Generic post detail (all post types)
- `/threads/:id/:slug` - Thread-specific post detail
- `/feed/:id/:slug` - Feed-specific post detail

#### Sections
- `/` - Homepage
- `/threads` - Threads listing
- `/feed` - Feed listing

## Page Structure

```
pages/
├── p/[id]/[[slug]].vue                     # Generic post (single-board)
├── threads/[id]/[[slug]].vue               # Thread post (single-board)
├── feed/[id]/[[slug]].vue                  # Feed post (single-board)
└── b/[board]/
    ├── index.vue                           # Board homepage
    ├── threads/
    │   ├── index.vue                       # Threads listing
    │   └── [id]/[[slug]].vue              # Thread post detail
    ├── feed/
    │   ├── index.vue                       # Feed listing
    │   └── [id]/[[slug]].vue              # Feed post detail
    └── p/[id]/[[slug]].vue                # Generic post (multi-board)
```

## Canonical URL Redirects

All detail pages implement canonical URL redirects using the `urlPath` field from GraphQL:

```javascript
if (post.urlPath && route.path !== post.urlPath) {
    await navigateTo(post.urlPath, { redirectCode: 301 });
}
```

This ensures:
- SEO-friendly URLs with proper slugs
- Automatic redirects from old URLs to new canonical URLs
- Consistent URL structure across the site

## URL Builder Composable

The `useUrlBuilder` composable provides helper functions for generating URLs:

```javascript
import { useUrlBuilder } from '@/composables/useUrlBuilder';

const { buildThreadUrl, buildFeedUrl, buildPostUrl } = useUrlBuilder();

// Example usage:
const threadUrl = buildThreadUrl(123, 'my-thread', 'programming');
// Multi-board: /b/programming/threads/123/my-thread
// Single-board: /threads/123/my-thread
```

## GraphQL Integration

All posts and comments now include:
- `slug` - SEO-friendly URL slug
- `urlPath` - Computed canonical URL path (respects boardsEnabled)

Example query:
```graphql
query GetPost($id: Int!) {
    post(id: $id) {
        id
        title
        slug
        urlPath
        # ... other fields
    }
}
```

## Breadcrumbs

The `NavigationBreadcrumbs` component automatically generates breadcrumbs based on:
- Current route
- Board context (if applicable)
- Section (threads, feed, etc.)

Usage:
```vue
<NavigationBreadcrumbs
    :board-slug="boardName"
    :board-name="board?.title"
    :current-page="post?.title"
/>
```

## Post Creation Flow

When creating a new post, the backend returns `urlPath` which is used for navigation:

```javascript
const { data } = await createPostMutation({ variables });
const post = data.createPost;

// Navigate to canonical URL
await navigateTo(post.urlPath);
```

## Migration Notes

### Backward Compatibility

- Old URLs without slugs still work (e.g., `/p/123`)
- Redirects automatically add slugs for SEO
- `titleChunk` field maintained as fallback

### Testing Checklist

- [ ] Generic post URLs work in both modes
- [ ] Thread URLs work in both modes
- [ ] Feed URLs work in both modes
- [ ] Canonical redirects work (missing slug → with slug)
- [ ] Breadcrumbs display correctly
- [ ] Share URLs use canonical format
- [ ] Meta tags (OG, Twitter) use canonical URLs
- [ ] Post creation redirects to correct URL

## See Also

- `/composables/useUrlBuilder.ts` - URL building logic
- `/components/navigation/Breadcrumbs.vue` - Breadcrumb component
- `/tests/composables/useUrlBuilder.test.ts` - URL builder tests
