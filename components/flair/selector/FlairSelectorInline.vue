<template>
  <div class="flair-selector-inline">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-4">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <p class="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading flairs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Empty State - No flairs available -->
    <div v-else-if="filteredFlairs.length === 0 && !loading" class="hidden">
      <!-- Hidden when no flairs available -->
    </div>

    <!-- Flair Grid -->
    <div v-else class="space-y-4">
      <!-- Category Filters -->
      <div v-if="categories.length > 0" class="flex flex-wrap gap-2">
        <button
          type="button"
          @click="selectedCategory = null"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            selectedCategory === null
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          All
        </button>
        <button
          type="button"
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            selectedCategory === category.id
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Selected Flairs Display -->
      <div v-if="selectedFlairs.length > 0" class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p class="text-xs font-medium text-blue-900 dark:text-blue-200 mb-2">Selected Flairs:</p>
        <div class="flex flex-wrap gap-2">
          <FlairDisplayFlairBadge
            v-for="flair in selectedFlairsWithStyle"
            :key="flair.id"
            :flair="flair"
            size="md"
            :removable="true"
            @remove="removeFlair"
          />
        </div>
      </div>

      <!-- Flair Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <button
          type="button"
          v-for="flair in filteredFlairs"
          :key="flair.id"
          @click="toggleFlair(flair)"
          :disabled="!isFlairSelected(flair.id) && selectedFlairs.length >= maxFlairs"
          :class="[
            'p-2 rounded-lg border-2 text-left transition-all',
            isFlairSelected(flair.id)
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500 ring-opacity-50'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700/50',
            !isFlairSelected(flair.id) && selectedFlairs.length >= maxFlairs
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          ]"
        >
          <div class="flex items-center justify-between">
            <FlairDisplayFlairBadge
              :flair="getFlairWithStyle(flair)"
              size="sm"
              :clickable="false"
            />
            <div v-if="isFlairSelected(flair.id)" class="ml-2">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <p v-if="flair.modOnly" class="mt-1 text-xs text-orange-600 dark:text-orange-400">
            🛡️ Moderator only
          </p>
        </button>
      </div>

      <!-- Max flairs warning -->
      <p v-if="selectedFlairs.length >= maxFlairs" class="text-xs text-amber-600 dark:text-amber-400">
        Maximum {{ maxFlairs }} flairs selected
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlairTemplate, FlairCategory } from '~/types/flair';

interface Props {
  boardId?: number;
  flairType?: 'post' | 'user';
  maxFlairs?: number;
  modelValue?: number[]; // Array of selected flair IDs
}

const props = withDefaults(defineProps<Props>(), {
  flairType: 'post',
  maxFlairs: 5,
  modelValue: () => []
});

const emit = defineEmits<{
  'update:modelValue': [flairIds: number[]];
  'flairs-loaded': [hasFlairs: boolean];
}>();

const { parseBackendStyle } = useFlairStyle();

// State
const loading = ref(false);
const error = ref('');
const flairs = ref<FlairTemplate[]>([]);
const categories = ref<FlairCategory[]>([]);
const selectedCategory = ref<number | null>(null);
const selectedFlairs = ref<number[]>(props.modelValue);

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  selectedFlairs.value = newValue;
});

watch(() => props.boardId, () => {
  if (props.boardId) {
    loadFlairs();
  } else {
    flairs.value = [];
    categories.value = [];
    emit('flairs-loaded', false);
  }
});

// Computed
const filteredFlairs = computed(() => {
  if (selectedCategory.value === null) {
    return flairs.value;
  }
  return flairs.value.filter(f => f.categoryId === selectedCategory.value);
});

const selectedFlairsWithStyle = computed(() => {
  return selectedFlairs.value
    .map(id => flairs.value.find(f => f.id === id))
    .filter(Boolean)
    .map(flair => getFlairWithStyle(flair!));
});

// Methods
const loadFlairs = async () => {
  if (!props.boardId) return;

  loading.value = true;
  error.value = '';

  try {
    const query = `
      query GetBoardFlairs($boardId: Int!, $flairType: FlairType!) {
        boardFlairs(boardId: $boardId, flairType: $flairType, activeOnly: true) {
          id
          textDisplay
          isEditable
          modOnly
          styleConfig
          categoryId
          requiresApproval
          isActive
        }
        flairCategories(boardId: $boardId) {
          id
          name
          description
          color
          displayOrder
        }
      }
    `;

    const { data, error: queryError } = await useGraphQLQuery(query, {
      variables: {
        boardId: props.boardId,
        flairType: props.flairType
      }
    });

    if (queryError.value) {
      throw new Error(queryError.value.message || 'Failed to load flairs');
    }

    if (data.value?.boardFlairs) {
      flairs.value = data.value.boardFlairs;
      emit('flairs-loaded', flairs.value.length > 0);
    } else {
      flairs.value = [];
      emit('flairs-loaded', false);
    }

    if (data.value?.flairCategories) {
      categories.value = data.value.flairCategories.sort((a, b) =>
        (a.displayOrder || 0) - (b.displayOrder || 0)
      );
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load flairs';
    console.error('Error loading flairs:', err);
    emit('flairs-loaded', false);
  } finally {
    loading.value = false;
  }
};

const getFlairWithStyle = (flair: FlairTemplate) => {
  // Parse styleConfig if needed
  if (flair.styleConfig && !flair.style) {
    flair.style = parseBackendStyle(flair.styleConfig);
  } else if (!flair.style) {
    flair.style = parseBackendStyle(null);
  }

  // Convert template to flair format expected by FlairBadge
  return {
    id: flair.id || 0,
    text: flair.textDisplay || '',
    style: flair.style,
    isUserSelectable: true,
    isModOnly: flair.modOnly || false,
    creationDate: '',
    updated: ''
  };
};

const isFlairSelected = (flairId: number) => {
  return selectedFlairs.value.includes(flairId);
};

const toggleFlair = (flair: FlairTemplate) => {
  if (!flair.id) return;

  if (isFlairSelected(flair.id)) {
    // Remove flair
    selectedFlairs.value = selectedFlairs.value.filter(id => id !== flair.id);
  } else {
    // Add flair if under max limit
    if (selectedFlairs.value.length >= props.maxFlairs) {
      return;
    }
    selectedFlairs.value = [...selectedFlairs.value, flair.id];
  }

  emit('update:modelValue', selectedFlairs.value);
};

const removeFlair = (flair: any) => {
  selectedFlairs.value = selectedFlairs.value.filter(id => id !== flair.id);
  emit('update:modelValue', selectedFlairs.value);
};

// Load flairs on mount
onMounted(() => {
  if (props.boardId) {
    loadFlairs();
  }
});
</script>

<style scoped>
.flair-selector-inline {
  /* Component-specific styles if needed */
}
</style>
