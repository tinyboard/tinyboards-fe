<template>
  <div class="space-y-4">
    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-4" aria-label="Styling tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          :class="[
            'pb-3 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="py-2">
      <!-- Background Tab -->
      <div v-if="activeTab === 'background'" class="space-y-4">
        <!-- Background Type Toggle -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background Type
          </label>
          <div class="flex gap-2">
            <button
              type="button"
              @click="localStyle.useGradient = false"
              :class="[
                'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                !localStyle.useGradient
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              Solid Color
            </button>
            <button
              type="button"
              @click="localStyle.useGradient = true"
              :class="[
                'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                localStyle.useGradient
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              Gradient
            </button>
          </div>
        </div>

        <!-- Solid Color Picker -->
        <div v-if="!localStyle.useGradient">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background Color
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model="localStyle.backgroundColor"
              type="color"
              class="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              v-model="localStyle.backgroundColor"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <!-- Gradient Picker -->
        <GradientPicker
          v-else
          v-model="localGradient"
        />
      </div>

      <!-- Text Tab -->
      <div v-if="activeTab === 'text'" class="space-y-4">
        <!-- Text Color -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Color
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model="localStyle.textColor"
              type="color"
              class="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              v-model="localStyle.textColor"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <!-- Font Weight -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Font Weight
          </label>
          <select
            v-model="localStyle.fontWeight"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="semibold">Semibold</option>
            <option value="bold">Bold</option>
          </select>
        </div>

        <!-- Text Transform -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Transform
          </label>
          <select
            v-model="localStyle.textTransform"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="none">None</option>
            <option value="uppercase">UPPERCASE</option>
            <option value="lowercase">lowercase</option>
            <option value="capitalize">Capitalize</option>
          </select>
        </div>

        <!-- Text Shadow -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Text Shadow
          </label>
          <ShadowEditor v-model="localShadow" />
        </div>
      </div>

      <!-- Border Tab -->
      <div v-if="activeTab === 'border'">
        <BorderEditor
          :width="localStyle.borderWidth"
          :color="localStyle.borderColor"
          :radius="localStyle.borderRadius"
          @update:width="localStyle.borderWidth = $event"
          @update:color="localStyle.borderColor = $event"
          @update:radius="localStyle.borderRadius = $event"
        />
      </div>

      <!-- Effects Tab -->
      <div v-if="activeTab === 'effects'">
        <AnimationPicker
          v-model="localStyle.animation"
          :duration="localStyle.animationDuration"
          @update:duration="localStyle.animationDuration = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlairStyle, Gradient, TextShadow } from '~/types/flair';
import { DEFAULT_FLAIR_STYLE } from '~/types/flair';
import GradientPicker from './GradientPicker.vue';
import ShadowEditor from './ShadowEditor.vue';
import BorderEditor from './BorderEditor.vue';
import AnimationPicker from './AnimationPicker.vue';

interface Props {
  modelValue: FlairStyle;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [style: FlairStyle];
}>();

// Tabs
const tabs = [
  { id: 'background', label: 'Background' },
  { id: 'text', label: 'Text' },
  { id: 'border', label: 'Border' },
  { id: 'effects', label: 'Effects' }
];

const activeTab = ref<'background' | 'text' | 'border' | 'effects'>('background');

// Local style state
const localStyle = ref<FlairStyle>({
  ...DEFAULT_FLAIR_STYLE,
  ...props.modelValue
});

// Separate reactive refs for nested objects to handle v-model properly
const localGradient = ref<Gradient>(
  props.modelValue.gradient || {
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 }
    ]
  }
);

const localShadow = ref<TextShadow | null>(
  props.modelValue.textShadow || null
);

// Watch for gradient changes
watch(localGradient, (newValue) => {
  localStyle.value.gradient = { ...newValue };
}, { deep: true });

// Watch for shadow changes
watch(localShadow, (newValue) => {
  localStyle.value.textShadow = newValue ? { ...newValue } : undefined;
}, { deep: true });

// Watch for changes and emit
watch(
  localStyle,
  (newValue) => {
    emit('update:modelValue', { ...newValue });
  },
  { deep: true }
);

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(localStyle.value)) {
      localStyle.value = {
        ...DEFAULT_FLAIR_STYLE,
        ...newValue
      };

      if (newValue.gradient) {
        localGradient.value = { ...newValue.gradient };
      }

      if (newValue.textShadow) {
        localShadow.value = { ...newValue.textShadow };
      } else {
        localShadow.value = null;
      }
    }
  },
  { deep: true }
);
</script>
