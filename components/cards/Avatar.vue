<template>
  <div :class="containerClass">
    <img
      v-if="imageSrc"
      loading="lazy"
      :src="imageSrc"
      :alt="alt"
      :class="imageClass"
      @error="handleError"
    />
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="svgClass"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/StoreSite';

const props = defineProps({
  src: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: 'avatar'
  },
  size: {
    type: String,
    default: 'md', // xs, sm, md, lg
    validator: (value: string) => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  rounded: {
    type: Boolean,
    default: true
  }
});

const site = useSiteStore();

// Use src prop, fallback to site default avatar, or show SVG icon
const imageSrc = computed(() => props.src || site.defaultAvatar);
const showFallback = computed(() => !imageSrc.value);

const handleError = () => {
  // If image fails to load, component will show SVG fallback via v-else
};

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  return sizes[props.size as keyof typeof sizes] || sizes.md;
});

const containerClass = computed(() => [
  'flex-shrink-0 flex items-center justify-center overflow-hidden',
  sizeClasses.value,
  props.rounded ? 'rounded' : '',
  showFallback.value ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''
]);

const imageClass = computed(() => [
  'w-full h-full object-cover',
  props.rounded ? 'rounded' : ''
]);

const svgClass = computed(() => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };
  return sizes[props.size as keyof typeof sizes] || sizes.md;
});
</script>
