<template>
  <div class="space-y-4">
    <!-- Animation Selection -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Animation Type
      </label>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="animation in animations"
          :key="animation.value"
          type="button"
          @click="selectedAnimation = animation.value"
          :class="[
            'relative p-4 rounded-lg border-2 transition-all text-left',
            selectedAnimation === animation.value
              ? 'border-primary bg-primary/10'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
          ]"
        >
          <div class="flex items-start justify-between mb-2">
            <h4 class="font-medium text-gray-900 dark:text-white">
              {{ animation.label }}
            </h4>
            <div
              v-if="selectedAnimation === animation.value"
              class="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">
            {{ animation.description }}
          </p>
          <div
            class="inline-block px-3 py-1 bg-primary text-white rounded text-sm font-medium"
            :class="animation.value !== 'none' ? `animate-flair-${animation.value}` : ''"
          >
            Preview
          </div>
        </button>
      </div>
    </div>

    <!-- Animation Duration (only if not "none") -->
    <div v-if="selectedAnimation !== 'none'">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Animation Speed: {{ animationDuration }}s
      </label>
      <input
        v-model.number="animationDuration"
        type="range"
        min="0.5"
        max="5"
        step="0.5"
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>Fast</span>
        <span>Medium</span>
        <span>Slow</span>
      </div>
    </div>

    <!-- Live Preview -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Live Preview
      </label>
      <div class="flex items-center justify-center h-24 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div
          class="px-4 py-2 bg-primary text-white font-medium rounded"
          :class="selectedAnimation !== 'none' ? `animate-flair-${selectedAnimation}` : ''"
          :style="selectedAnimation !== 'none' ? { animationDuration: `${animationDuration}s` } : {}"
        >
          Flair Animation
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnimationType } from '~/types/flair';

interface Props {
  modelValue: AnimationType;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2
});

const emit = defineEmits<{
  'update:modelValue': [animation: AnimationType];
  'update:duration': [duration: number];
}>();

// Animation options
const animations = [
  {
    value: 'none' as AnimationType,
    label: 'None',
    description: 'No animation'
  },
  {
    value: 'pulse' as AnimationType,
    label: 'Pulse Glow',
    description: 'Gentle breathing effect'
  },
  {
    value: 'shimmer' as AnimationType,
    label: 'Shimmer',
    description: 'Moving gradient shine'
  },
  {
    value: 'bounce' as AnimationType,
    label: 'Bounce',
    description: 'Subtle bounce effect'
  }
];

// Local state
const selectedAnimation = ref<AnimationType>(props.modelValue);
const animationDuration = ref(props.duration);

// Watch for changes and emit
watch(selectedAnimation, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(animationDuration, (newValue) => {
  emit('update:duration', newValue);
});

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== selectedAnimation.value) {
    selectedAnimation.value = newValue;
  }
});

watch(() => props.duration, (newValue) => {
  if (newValue !== animationDuration.value) {
    animationDuration.value = newValue;
  }
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
    left: -100%;
  }
  100% {
    left: 200%;
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
  position: relative;
  overflow: hidden;
}

.animate-flair-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: flair-shimmer 2s linear infinite;
}

.animate-flair-bounce {
  animation: flair-bounce 2s ease-in-out infinite;
}
</style>
