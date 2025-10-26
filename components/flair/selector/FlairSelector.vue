<template>
  <div class="flair-selector">
    <!-- Selected Flairs Display -->
    <div v-if="selectedFlairs.length > 0" class="mb-3">
      <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
        Selected Flairs
      </label>
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

    <!-- Flair Selection Button -->
    <div>
      <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
        Add Flair
      </label>
      <button
        type="button"
        @click="showFlairPicker = true"
        class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        :disabled="loading || !boardId"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
        <span>{{ selectedFlairs.length > 0 ? 'Add Another Flair' : 'Choose Flair' }}</span>
      </button>
      <p v-if="!boardId" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Select a board first to choose flairs
      </p>
    </div>

    <!-- Flair Picker Modal -->
    <Teleport to="body">
      <div
        v-if="showFlairPicker"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showFlairPicker = false"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Choose Flair
            </h3>
            <button
              @click="showFlairPicker = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex-1 flex items-center justify-center p-8">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading flairs...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="flex-1 flex items-center justify-center p-8">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="mt-2 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
            </div>
          </div>

          <!-- Flair List -->
          <div v-else class="flex-1 overflow-y-auto p-4">
            <!-- Category Filters -->
            <div v-if="categories.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-2">
                <button
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
            </div>

            <!-- Flair Grid -->
            <div v-if="filteredFlairs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                v-for="flair in filteredFlairs"
                :key="flair.id"
                type="button"
                @click="selectFlair(flair)"
                :disabled="isFlairSelected(flair.id)"
                :class="[
                  'p-3 rounded-lg border-2 text-left transition-all',
                  isFlairSelected(flair.id)
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700/50'
                ]"
              >
                <FlairDisplayFlairBadge
                  :flair="getFlairWithStyle(flair)"
                  size="md"
                  :clickable="false"
                />
                <p v-if="isFlairSelected(flair.id)" class="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
                  ✓ Selected
                </p>
              </button>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                No flairs available for this board
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t dark:border-gray-700 p-4">
            <button
              @click="showFlairPicker = false"
              class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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
}>();

const { parseBackendStyle } = useFlairStyle();

// State
const showFlairPicker = ref(false);
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
      query GetBoardFlairs($boardId: Int!, $flairType: String!) {
        flairTemplates(boardId: $boardId, flairType: $flairType, isActive: true) {
          id
          textDisplay
          textEditable
          styleConfig
          categoryId
          requiresApproval
          isActive
          modOnly
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

    if (data.value?.flairTemplates) {
      flairs.value = data.value.flairTemplates;
    }

    if (data.value?.flairCategories) {
      categories.value = data.value.flairCategories.sort((a, b) =>
        (a.displayOrder || 0) - (b.displayOrder || 0)
      );
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load flairs';
    console.error('Error loading flairs:', err);
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

const selectFlair = (flair: FlairTemplate) => {
  if (!flair.id) return;

  if (isFlairSelected(flair.id)) {
    return; // Already selected
  }

  if (selectedFlairs.value.length >= props.maxFlairs) {
    error.value = `Maximum ${props.maxFlairs} flairs allowed`;
    setTimeout(() => error.value = '', 3000);
    return;
  }

  selectedFlairs.value = [...selectedFlairs.value, flair.id];
  emit('update:modelValue', selectedFlairs.value);
};

const removeFlair = (flair: any) => {
  selectedFlairs.value = selectedFlairs.value.filter(id => id !== flair.id);
  emit('update:modelValue', selectedFlairs.value);
};

// Load flairs on mount if boardId is provided
onMounted(() => {
  if (props.boardId) {
    loadFlairs();
  }
});
</script>

<style scoped>
.flair-selector {
  /* Component-specific styles if needed */
}
</style>
