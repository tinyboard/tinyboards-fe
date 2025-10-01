<template>
  <div :class="containerClass">
    <img
      v-if="src"
      loading="lazy"
      :src="src"
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

const imageSrc = ref(props.src);
const showFallback = ref(!props.src);

const handleError = () => {
  showFallback.value = true;
  imageSrc.value = null;
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
  !imageSrc.value ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500' : ''
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
