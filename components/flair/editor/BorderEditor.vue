<template>
  <div class="space-y-4">
    <!-- Border Width -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Border Width: {{ borderWidth }}px
      </label>
      <input
        v-model.number="borderWidth"
        type="range"
        min="0"
        max="5"
        step="1"
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>

    <!-- Border Color (only if width > 0) -->
    <div v-if="borderWidth > 0">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Border Color
      </label>
      <div class="flex items-center gap-2">
        <input
          v-model="borderColor"
          type="color"
          class="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
        />
        <input
          v-model="borderColor"
          type="text"
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="#000000"
        />
      </div>
    </div>

    <!-- Border Radius -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Border Radius: {{ borderRadius }}px
      </label>
      <input
        v-model.number="borderRadius"
        type="range"
        min="0"
        max="20"
        step="1"
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>

    <!-- Preview -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Preview
      </label>
      <div class="flex items-center justify-center h-24 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div
          class="px-4 py-2 bg-primary text-white font-medium"
          :style="{
            borderWidth: `${borderWidth}px`,
            borderStyle: 'solid',
            borderColor: borderColor,
            borderRadius: `${borderRadius}px`
          }"
        >
          Sample Flair
        </div>
      </div>
    </div>

    <!-- Quick Presets -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Quick Styles
      </label>
      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          @click="applyPreset('none')"
          class="px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-primary transition-colors"
        >
          None
        </button>
        <button
          type="button"
          @click="applyPreset('pill')"
          class="px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-primary dark:hover:border-primary transition-colors"
        >
          Pill
        </button>
        <button
          type="button"
          @click="applyPreset('outlined')"
          class="px-3 py-2 text-sm border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors"
        >
          Outlined
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  width: number;
  color: string;
  radius: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:width': [width: number];
  'update:color': [color: string];
  'update:radius': [radius: number];
}>();

// Local state
const borderWidth = ref(props.width);
const borderColor = ref(props.color);
const borderRadius = ref(props.radius);

// Watch for changes and emit
watch(borderWidth, (newValue) => {
  emit('update:width', newValue);
});

watch(borderColor, (newValue) => {
  emit('update:color', newValue);
});

watch(borderRadius, (newValue) => {
  emit('update:radius', newValue);
});

// Watch for external changes
watch(() => props.width, (newValue) => {
  if (newValue !== borderWidth.value) {
    borderWidth.value = newValue;
  }
});

watch(() => props.color, (newValue) => {
  if (newValue !== borderColor.value) {
    borderColor.value = newValue;
  }
});

watch(() => props.radius, (newValue) => {
  if (newValue !== borderRadius.value) {
    borderRadius.value = newValue;
  }
});

// Preset methods
const applyPreset = (preset: 'none' | 'pill' | 'outlined') => {
  switch (preset) {
    case 'none':
      borderWidth.value = 0;
      borderRadius.value = 4;
      break;
    case 'pill':
      borderWidth.value = 0;
      borderRadius.value = 20;
      break;
    case 'outlined':
      borderWidth.value = 2;
      borderColor.value = '#3b82f6';
      borderRadius.value = 6;
      break;
  }
};
</script>
