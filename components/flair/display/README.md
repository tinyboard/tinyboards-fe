# Flair Display Components

This directory contains Vue 3 components for displaying flairs in TinyBoards. All components use the Composition API with TypeScript and are fully responsive with dark mode support.

## Components

### FlairBadge.vue

Core component for rendering individual flair badges with full visual styling support.

**Props:**
- `flair: Flair` - The flair object to render (required)
- `size?: FlairSize` - Badge size: 'xs', 'sm', 'md', 'lg' (default: 'md')
- `clickable?: boolean` - Enable click interaction (default: false)
- `removable?: boolean` - Show remove button (default: false)
- `truncated?: boolean` - Truncate long text (default: false)
- `maxLength?: number` - Max text length when truncated (default: 50)
- `className?: string` - Additional CSS classes (default: '')

**Events:**
- `@click` - Emitted when badge is clicked (if clickable)
- `@remove` - Emitted when remove button is clicked (if removable)

**Features:**
- Solid colors or gradients (linear/radial)
- Text shadows and glows
- Border styling
- Animations (pulse, shimmer, bounce)
- Custom emoji rendering
- Auto-contrast text color calculation
- Accessibility attributes

**Example:**
```vue
<template>
  <FlairDisplayFlairBadge
    :flair="myFlair"
    size="md"
    clickable
    @click="handleFlairClick"
  />
</template>

<script setup lang="ts">
const myFlair = {
  id: 1,
  text: 'Moderator',
  style: {
    backgroundColor: '#059669',
    textColor: '#ffffff',
    borderRadius: 4,
    fontWeight: 'semibold'
  }
}

const handleFlairClick = (flair) => {
  console.log('Clicked flair:', flair)
}
</script>
```

### FlairStack.vue

Component for displaying multiple flairs with overflow handling.

**Props:**
- `flairs: Flair[]` - Array of flairs to display (required)
- `size?: FlairSize` - Size for all badges (default: 'md')
- `clickable?: boolean` - Enable click on badges (default: false)
- `removable?: boolean` - Show remove buttons (default: false)
- `layout?: FlairLayout` - 'horizontal' or 'vertical' (default: 'horizontal')
- `maxVisible?: number` - Max flairs before overflow (default: 5)
- `collapsible?: boolean` - Enable expand/collapse (default: true)

**Events:**
- `@flair-click` - Emitted when a flair is clicked
- `@flair-remove` - Emitted when a flair is removed

**Features:**
- Horizontal or vertical layout
- Expandable overflow (+N more button)
- Responsive wrapping
- Auto-collapse on data change

**Example:**
```vue
<template>
  <FlairDisplayFlairStack
    :flairs="flairList"
    size="sm"
    clickable
    layout="horizontal"
    :max-visible="3"
    @flair-click="handleClick"
  />
</template>

<script setup lang="ts">
const flairList = ref([
  { id: 1, text: 'Bug', style: { backgroundColor: '#dc2626' } },
  { id: 2, text: 'Feature', style: { backgroundColor: '#059669' } },
  { id: 3, text: 'Help', style: { backgroundColor: '#2563eb' } }
])
</script>
```

### PostFlair.vue

Wrapper component for displaying flairs on posts with edit functionality.

**Props:**
- `post: Post` - Post object with flairs (required)
- `size?: FlairSize` - Badge size (default: 'md')
- `clickable?: boolean` - Navigate to flair filter on click (default: true)
- `editable?: boolean` - Show edit button for authorized users (default: false)

**Events:**
- `@edit-flair` - Emitted when edit button is clicked
- `@flair-click` - Emitted when flair is clicked (passes flairId)

**Features:**
- Displays post flairs from post.flairs
- Edit button for post author/moderator/admin
- Click to navigate to board flair filter
- Automatic permission checking

**Example:**
```vue
<template>
  <FlairDisplayPostFlair
    :post="post"
    size="md"
    clickable
    editable
    @edit-flair="openFlairEditor"
    @flair-click="handleFlairFilter"
  />
</template>

<script setup lang="ts">
const post = ref({
  id: 123,
  title: 'My Post',
  creator: { id: 1 },
  board: { id: 5 },
  flairs: [
    {
      id: 1,
      flairId: 10,
      flair: {
        id: 10,
        text: 'Discussion',
        style: { backgroundColor: '#3b82f6' }
      }
    }
  ]
})

const openFlairEditor = () => {
  // Open flair selection modal
}

const handleFlairFilter = (flairId) => {
  // Navigate to /+board?flair=flairId
}
</script>
```

### UserFlair.vue

Wrapper component for displaying user flairs with context-aware filtering.

**Props:**
- `user: User` - User object with flairs (required)
- `boardId?: number` - Current board ID for context filtering
- `size?: FlairSize` - Badge size (default: 'sm')

**Features:**
- Displays user's assigned flairs
- Context-aware filtering:
  - With boardId: shows board-specific + site-wide flairs
  - Without boardId: shows only site-wide flairs
- Automatic sorting (site-wide first, then board-specific)

**Example:**
```vue
<template>
  <!-- In board context: shows board + site-wide flairs -->
  <FlairDisplayUserFlair
    :user="user"
    :board-id="currentBoardId"
    size="sm"
  />

  <!-- Outside board context: shows only site-wide flairs -->
  <FlairDisplayUserFlair
    :user="user"
    size="sm"
  />
</template>

<script setup lang="ts">
const user = ref({
  id: 1,
  flairs: [
    {
      id: 1,
      flairId: 5,
      flair: {
        id: 5,
        text: 'Verified',
        boardId: null, // Site-wide flair
        style: { backgroundColor: '#059669' }
      }
    },
    {
      id: 2,
      flairId: 10,
      flair: {
        id: 10,
        text: 'Expert',
        boardId: 3, // Board-specific flair
        style: { backgroundColor: '#7c3aed' }
      }
    }
  ]
})

const currentBoardId = ref(3)
</script>
```

### EmojiRenderer.vue

Component for rendering emojis within flairs (custom or standard).

**Props:**
- `emoji: FlairEmoji` - Emoji object (required)
- `size?: FlairSize` - Emoji size (default: 'md')

**Features:**
- Custom uploaded emoji images
- Standard emoji fallback
- Proper sizing and aspect ratio
- Accessibility with alt text and title

**Example:**
```vue
<template>
  <!-- Custom emoji -->
  <FlairDisplayEmojiRenderer
    :emoji="{
      id: 1,
      shortcode: 'custom_emoji',
      imageUrl: '/media/emoji/custom.png',
      isCustom: true
    }"
    size="md"
  />

  <!-- Standard emoji -->
  <FlairDisplayEmojiRenderer
    :emoji="{
      id: 2,
      shortcode: '🎉',
      isCustom: false
    }"
    size="sm"
  />
</template>
```

## Types

All TypeScript types are defined in `/types/flair.ts`:

```typescript
export interface Flair {
  id: number
  text: string
  emoji?: FlairEmoji
  style: FlairStyle
  category?: FlairCategory
  categoryId?: number
  boardId?: number
  isUserSelectable: boolean
  isModOnly: boolean
  createdAt: string
  updatedAt: string
}

export interface FlairStyle {
  backgroundColor?: string
  gradient?: FlairGradient
  textColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  textShadow?: FlairTextShadow
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  animation?: 'pulse' | 'shimmer' | 'bounce' | 'none'
  glow?: boolean
  glowColor?: string
}

export interface FlairGradient {
  type: 'linear' | 'radial'
  colors: string[]
  angle?: number
  stops?: number[]
}

export interface FlairTextShadow {
  offsetX: number
  offsetY: number
  blur: number
  color: string
}

export interface FlairEmoji {
  id: number
  shortcode: string
  imageUrl?: string
  category?: string
  isCustom: boolean
}

export type FlairSize = 'xs' | 'sm' | 'md' | 'lg'
export type FlairLayout = 'horizontal' | 'vertical'
```

## Composable

The `useFlairStyle()` composable provides utility functions for building flair styles:

```typescript
const {
  buildGradient,      // Generate CSS gradient string
  buildTextShadow,    // Generate CSS text-shadow
  buildFlairStyle,    // Generate complete style object
  getContrastColor,   // Calculate contrasting text color
  getAnimationClass,  // Get animation class name
  getSizeClasses      // Get size-specific classes
} = useFlairStyle()
```

## Styling Examples

### Solid Color Flair
```typescript
{
  style: {
    backgroundColor: '#059669',
    textColor: '#ffffff',
    borderRadius: 4,
    fontWeight: 'semibold'
  }
}
```

### Gradient Flair
```typescript
{
  style: {
    gradient: {
      type: 'linear',
      colors: ['#667eea', '#764ba2'],
      angle: 90
    },
    textColor: '#ffffff',
    fontWeight: 'bold'
  }
}
```

### Animated Flair with Glow
```typescript
{
  style: {
    backgroundColor: '#7c3aed',
    textColor: '#ffffff',
    animation: 'pulse',
    glow: true,
    glowColor: '#a78bfa',
    borderRadius: 6
  }
}
```

### Flair with Text Shadow
```typescript
{
  style: {
    backgroundColor: '#dc2626',
    textColor: '#ffffff',
    textShadow: {
      offsetX: 2,
      offsetY: 2,
      blur: 4,
      color: 'rgba(0, 0, 0, 0.3)'
    },
    borderRadius: 4
  }
}
```

### Flair with Custom Border
```typescript
{
  style: {
    backgroundColor: 'transparent',
    textColor: '#2563eb',
    borderColor: '#2563eb',
    borderWidth: 2,
    borderRadius: 4,
    fontWeight: 'semibold'
  }
}
```

## Accessibility

All components include proper accessibility features:
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader support
- Alt text for images

## Dark Mode

All components are fully compatible with dark mode using Tailwind's dark mode classes. Colors automatically adjust based on the color scheme.

## Performance

- Efficient reactive updates
- Minimal re-renders
- Lazy loading for images
- Optimized CSS animations
- No unnecessary watchers

## Browser Support

Components support all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Integration Example

Here's a complete example showing how to use these components together:

```vue
<template>
  <div class="post-card">
    <!-- Post header with user flair -->
    <div class="flex items-center gap-2">
      <img :src="post.creator.avatar" class="w-8 h-8 rounded-full" />
      <span class="font-medium">{{ post.creator.username }}</span>
      <FlairDisplayUserFlair
        :user="post.creator"
        :board-id="post.board.id"
        size="sm"
      />
    </div>

    <!-- Post title and flair -->
    <div class="flex items-center gap-3 mt-2">
      <h2 class="text-xl font-bold">{{ post.title }}</h2>
      <FlairDisplayPostFlair
        :post="post"
        size="md"
        clickable
        editable
        @edit-flair="openFlairSelector"
      />
    </div>

    <!-- Post content -->
    <p class="mt-2 text-gray-600 dark:text-gray-300">
      {{ post.body }}
    </p>
  </div>
</template>

<script setup lang="ts">
const post = ref({
  id: 1,
  title: 'My Awesome Post',
  body: 'This is the post content...',
  creator: {
    id: 1,
    username: 'johndoe',
    avatar: '/avatar.jpg',
    flairs: [
      {
        id: 1,
        flairId: 5,
        flair: {
          id: 5,
          text: 'Moderator',
          style: {
            backgroundColor: '#059669',
            textColor: '#ffffff'
          }
        }
      }
    ]
  },
  board: { id: 3 },
  flairs: [
    {
      id: 1,
      flairId: 10,
      flair: {
        id: 10,
        text: 'Discussion',
        emoji: {
          id: 1,
          shortcode: '💬',
          isCustom: false
        },
        style: {
          gradient: {
            type: 'linear',
            colors: ['#667eea', '#764ba2']
          },
          textColor: '#ffffff'
        }
      }
    }
  ]
})
</script>
```
