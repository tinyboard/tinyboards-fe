<template>
  <div class="space-y-4">
    <!-- Gradient Type Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Gradient Type
      </label>
      <div class="flex gap-2">
        <button
          type="button"
          @click="localGradient.type = 'linear'"
          :class="[
            'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            localGradient.type === 'linear'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          Linear
        </button>
        <button
          type="button"
          @click="localGradient.type = 'radial'"
          :class="[
            'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            localGradient.type === 'radial'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          Radial
        </button>
      </div>
    </div>

    <!-- Angle Slider (for linear gradients) -->
    <div v-if="localGradient.type === 'linear'">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Angle: {{ localGradient.angle || 0 }}°
      </label>
      <input
        v-model.number="localGradient.angle"
        type="range"
        min="0"
        max="360"
        step="1"
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>

    <!-- Live Preview -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Preview
      </label>
      <div
        class="h-16 rounded-lg border border-gray-300 dark:border-gray-600"
        :style="{ background: gradientCSS }"
      ></div>
    </div>

    <!-- Color Stops -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Color Stops
        </label>
        <button
          type="button"
          @click="addColorStop"
          class="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          + Add Stop
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="(stop, index) in localGradient.stops"
          :key="index"
          class="flex items-center gap-2"
        >
          <!-- Color Picker -->
          <div class="relative">
            <input
              v-model="stop.color"
              type="color"
              class="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              :aria-label="`Color stop ${index + 1}`"
            />
          </div>

          <!-- Position Slider -->
          <div class="flex-1">
            <input
              v-model.number="stop.position"
              type="range"
              min="0"
              max="100"
              step="1"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              :aria-label="`Position for stop ${index + 1}`"
            />
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ stop.position }}%
            </div>
          </div>

          <!-- Remove Button -->
          <button
            v-if="localGradient.stops.length > 2"
            type="button"
            @click="removeColorStop(index)"
            class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            :aria-label="`Remove stop ${index + 1}`"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div v-else class="w-8"></div>
        </div>
      </div>
    </div>

    <!-- Presets -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Presets
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="preset in GRADIENT_PRESETS"
          :key="preset.name"
          type="button"
          @click="applyPreset(preset)"
          class="group relative h-12 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-colors"
          :style="{ background: gradientToCSS(preset.gradient) }"
        >
          <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span class="text-xs font-medium text-white">{{ preset.name }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Gradient } from '~/types/flair';
import { GRADIENT_PRESETS, gradientToCSS } from '~/types/flair';

interface Props {
  modelValue: Gradient;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [gradient: Gradient];
}>();

// Local gradient state
const localGradient = ref<Gradient>({
  type: props.modelValue.type || 'linear',
  angle: props.modelValue.angle || 90,
  stops: props.modelValue.stops?.length > 0
    ? [...props.modelValue.stops]
    : [
        { color: '#667eea', position: 0 },
        { color: '#764ba2', position: 100 }
      ]
});

// Computed gradient CSS
const gradientCSS = computed(() => gradientToCSS(localGradient.value));

// Watch for changes and emit
watch(
  localGradient,
  (newValue) => {
    emit('update:modelValue', { ...newValue });
  },
  { deep: true }
);

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(localGradient.value)) {
      localGradient.value = {
        type: newValue.type || 'linear',
        angle: newValue.angle || 90,
        stops: newValue.stops?.length > 0
          ? [...newValue.stops]
          : [
              { color: '#667eea', position: 0 },
              { color: '#764ba2', position: 100 }
            ]
      };
    }
  },
  { deep: true }
);

// Methods
const addColorStop = () => {
  const positions = localGradient.value.stops.map(s => s.position).sort((a, b) => a - b);
  const newPosition = positions.length > 0
    ? Math.min(100, positions[positions.length - 1] + 10)
    : 50;

  localGradient.value.stops.push({
    color: '#ffffff',
    position: newPosition
  });

  // Sort stops by position
  localGradient.value.stops.sort((a, b) => a.position - b.position);
};

const removeColorStop = (index: number) => {
  if (localGradient.value.stops.length > 2) {
    localGradient.value.stops.splice(index, 1);
  }
};

const applyPreset = (preset: typeof GRADIENT_PRESETS[0]) => {
  localGradient.value = {
    type: preset.gradient.type,
    angle: preset.gradient.angle,
    stops: [...preset.gradient.stops]
  };
};
</script>
