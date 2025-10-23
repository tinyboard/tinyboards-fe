<template>
  <span
    :class="[
      'inline-flex items-center gap-1 font-medium',
      sizeClasses[size],
      style.animation !== 'none' ? `animate-flair-${style.animation}` : ''
    ]"
    :style="flairStyles"
  >
    <span v-if="flair.emoji" class="flex-shrink-0">{{ flair.emoji }}</span>
    <span>{{ flair.text }}</span>
  </span>
</template>

<script setup lang="ts">
import type { FlairTemplate } from '~/types/flair';
import { flairStyleToCSS } from '~/types/flair';

interface Props {
  flair: FlairTemplate;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
});

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5'
};

const style = computed(() => props.flair.style);

const flairStyles = computed(() => {
  const css = flairStyleToCSS(style.value);

  // Add animation duration if animation is active
  if (style.value.animation !== 'none' && style.value.animationDuration) {
    css.animationDuration = `${style.value.animationDuration}s`;
  }

  return css;
});
</script>

<style scoped>
/* Flair Animations */
@keyframes flair-pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    opacity: 0.85;
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
}

@keyframes flair-shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes flair-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-flair-pulse {
  animation: flair-pulse 2s ease-in-out infinite;
}

.animate-flair-shimmer {
  background-size: 200% 100% !important;
  animation: flair-shimmer 2s linear infinite;
}

.animate-flair-bounce {
  animation: flair-bounce 2s ease-in-out infinite;
}
</style>
