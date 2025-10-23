<template>
  <div class="space-y-4">
    <!-- Presets -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Presets
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="preset in SHADOW_PRESETS"
          :key="preset.name"
          type="button"
          @click="applyPreset(preset)"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors',
            isActivePreset(preset)
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
          ]"
        >
          <span :style="preset.shadow ? { textShadow: shadowToCSS(preset.shadow) } : {}">
            {{ preset.name }}
          </span>
        </button>
      </div>
    </div>

    <!-- Custom Shadow Controls (only if not "None") -->
    <div v-if="localShadow" class="space-y-4">
      <!-- Offset X -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Offset X: {{ localShadow.offsetX }}px
        </label>
        <input
          v-model.number="localShadow.offsetX"
          type="range"
          min="-20"
          max="20"
          step="1"
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <!-- Offset Y -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Offset Y: {{ localShadow.offsetY }}px
        </label>
        <input
          v-model.number="localShadow.offsetY"
          type="range"
          min="-20"
          max="20"
          step="1"
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <!-- Blur Radius -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Blur Radius: {{ localShadow.blur }}px
        </label>
        <input
          v-model.number="localShadow.blur"
          type="range"
          min="0"
          max="30"
          step="1"
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <!-- Shadow Color -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Shadow Color
        </label>
        <div class="flex items-center gap-2">
          <input
            v-model="shadowColor"
            type="color"
            class="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
          />
          <input
            v-model="shadowOpacity"
            type="range"
            min="0"
            max="100"
            step="1"
            class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span class="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
            {{ shadowOpacity }}%
          </span>
        </div>
      </div>

      <!-- Glow Spread (for multi-layer glow effect) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Glow Spread: {{ localShadow.spread || 0 }}
        </label>
        <input
          v-model.number="localShadow.spread"
          type="range"
          min="0"
          max="5"
          step="1"
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Higher values create a stronger glow effect
        </p>
      </div>
    </div>

    <!-- Preview -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Preview
      </label>
      <div class="flex items-center justify-center h-24 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <span
          class="text-2xl font-bold text-gray-900 dark:text-white"
          :style="{ textShadow: previewShadow }"
        >
          Flair Text
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TextShadow } from '~/types/flair';
import { SHADOW_PRESETS } from '~/types/flair';

interface Props {
  modelValue: TextShadow | null | undefined;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [shadow: TextShadow | null];
}>();

// Local shadow state
const localShadow = ref<TextShadow | null>(
  props.modelValue
    ? { ...props.modelValue }
    : null
);

// Color and opacity management
const shadowColor = ref('#000000');
const shadowOpacity = ref(30);

// Initialize color and opacity from existing shadow
onMounted(() => {
  if (localShadow.value?.color) {
    const parsed = parseColor(localShadow.value.color);
    shadowColor.value = parsed.hex;
    shadowOpacity.value = parsed.opacity;
  }
});

// Watch color/opacity changes and update shadow
watch([shadowColor, shadowOpacity], ([color, opacity]) => {
  if (localShadow.value) {
    localShadow.value.color = hexToRgba(color, opacity / 100);
  }
});

// Computed preview shadow
const previewShadow = computed(() => {
  if (!localShadow.value) return 'none';
  return shadowToCSS(localShadow.value);
});

// Watch for changes and emit
watch(
  localShadow,
  (newValue) => {
    emit('update:modelValue', newValue ? { ...newValue } : null);
  },
  { deep: true }
);

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(localShadow.value)) {
      localShadow.value = newValue ? { ...newValue } : null;
      if (newValue?.color) {
        const parsed = parseColor(newValue.color);
        shadowColor.value = parsed.hex;
        shadowOpacity.value = parsed.opacity;
      }
    }
  },
  { deep: true }
);

// Methods
const applyPreset = (preset: typeof SHADOW_PRESETS[0]) => {
  if (preset.shadow === null) {
    localShadow.value = null;
  } else {
    localShadow.value = { ...preset.shadow };
    if (preset.shadow.color) {
      const parsed = parseColor(preset.shadow.color);
      shadowColor.value = parsed.hex;
      shadowOpacity.value = parsed.opacity;
    }
  }
};

const isActivePreset = (preset: typeof SHADOW_PRESETS[0]) => {
  if (preset.shadow === null && localShadow.value === null) return true;
  if (preset.shadow === null || localShadow.value === null) return false;

  return (
    preset.shadow.offsetX === localShadow.value.offsetX &&
    preset.shadow.offsetY === localShadow.value.offsetY &&
    preset.shadow.blur === localShadow.value.blur &&
    (preset.shadow.spread || 0) === (localShadow.value.spread || 0)
  );
};

const shadowToCSS = (shadow: TextShadow): string => {
  const { offsetX, offsetY, blur, color, spread } = shadow;
  if (spread && spread > 0) {
    // Multi-layer shadow for glow effect
    const shadows = [];
    for (let i = 1; i <= spread; i++) {
      shadows.push(`0 0 ${blur * i}px ${color}`);
    }
    shadows.push(`${offsetX}px ${offsetY}px ${blur}px ${color}`);
    return shadows.join(', ');
  }
  return `${offsetX}px ${offsetY}px ${blur}px ${color}`;
};

const parseColor = (color: string): { hex: string; opacity: number } => {
  // Parse rgba(r, g, b, a) format
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

    const hex = '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    return { hex, opacity: Math.round(a * 100) };
  }

  // Assume hex color with full opacity
  return { hex: color, opacity: 100 };
};

const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
</script>
