<template>
  <span class="inline-flex items-center justify-center" :class="sizeClass">
    <img
      v-if="emoji.isCustom && emoji.imageUrl"
      :src="emoji.imageUrl"
      :alt="emoji.shortcode"
      :title="`:${emoji.shortcode}:`"
      class="object-contain"
      :class="imageSizeClass"
    />
    <span
      v-else
      class="emoji-fallback"
      :title="emoji.shortcode"
    >
      {{ emoji.shortcode }}
    </span>
  </span>
</template>

<script setup lang="ts">
import type { FlairEmoji, FlairSize } from '~/types/flair'

interface Props {
  emoji: FlairEmoji
  size?: FlairSize
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeClass = computed(() => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  return sizeMap[props.size]
})

const imageSizeClass = computed(() => {
  const sizeMap = {
    xs: 'max-w-3 max-h-3',
    sm: 'max-w-4 max-h-4',
    md: 'max-w-5 max-h-5',
    lg: 'max-w-6 max-h-6'
  }
  return sizeMap[props.size]
})
</script>

<style scoped>
.emoji-fallback {
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
}
</style>
