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
    <div v-else-if="filteredFlairs.length === 0 && !loading" class="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
      </svg>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        No flairs available for this board. Create some in the admin panel first.
      </p>
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
      <div v-if="selectedFlairs.length > 0 && !loading" class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p class="text-xs font-medium text-blue-900 dark:text-blue-200 mb-2">Selected Flairs:</p>
        <div class="space-y-2">
          <div v-for="flairSelection in selectedFlairsWithDetails" :key="flairSelection.templateId" class="flex items-center gap-2">
            <template v-if="getFlairTemplate(flairSelection.templateId)">
              <FlairDisplayFlairBadge
                :flair="getFlairBadgeData(flairSelection)"
                size="md"
                :removable="true"
                @remove="() => removeFlairByTemplateId(flairSelection.templateId)"
              />
              <!-- Custom text input for editable flairs -->
              <input
                v-if="isFlairEditable(flairSelection.templateId)"
                v-model="flairSelection.customText"
                type="text"
                maxlength="150"
                placeholder="Custom text (optional)"
                class="flex-1 px-3 py-1.5 text-sm border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                @input="emitSelectedFlairs"
              />
            </template>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">
              Loading flair...
            </div>
          </div>
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

interface FlairSelection {
  templateId: number;
  customText?: string;
}

interface Props {
  boardId?: number;
  flairType?: 'post' | 'user';
  maxFlairs?: number;
  modelValue?: FlairSelection[]; // Array of flair selections with optional custom text
}

const props = withDefaults(defineProps<Props>(), {
  flairType: 'post',
  maxFlairs: 5,
  modelValue: () => []
});

const emit = defineEmits<{
  'update:modelValue': [flairSelections: FlairSelection[]];
  'flairs-loaded': [hasFlairs: boolean];
}>();

const { parseBackendStyle } = useFlairStyle();

// State
const loading = ref(false);
const error = ref('');
const flairs = ref<FlairTemplate[]>([]);
const categories = ref<FlairCategory[]>([]);
const selectedCategory = ref<number | null>(null);
const selectedFlairs = ref<FlairSelection[]>(props.modelValue);

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  selectedFlairs.value = newValue || [];
}, { immediate: true, deep: true });

watch(() => props.boardId, () => {
  loadFlairs();
});

// Computed
const filteredFlairs = computed(() => {
  if (selectedCategory.value === null) {
    return flairs.value;
  }
  return flairs.value.filter(f => f.categoryId === selectedCategory.value);
});

const selectedFlairsWithDetails = computed(() => {
  return selectedFlairs.value;
});

// Methods
const loadFlairs = async () => {
  loading.value = true;
  error.value = '';

  try {
    let query, variables;

    if (props.boardId) {
      // Load board-specific flairs
      query = `
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
            flairType
            boardId
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
      variables = {
        boardId: props.boardId,
        flairType: props.flairType
      };
    } else {
      // Load site-wide flairs (for posts without a specific board)
      // Site-wide flairs are not currently implemented in the backend
      query = `
        query GetSiteFlairs($flairType: FlairType!) {
          siteFlairs(flairType: $flairType, activeOnly: true) {
            id
            textDisplay
            isEditable
            modOnly
            styleConfig
            categoryId
            requiresApproval
            isActive
          }
        }
      `;
      variables = {
        flairType: props.flairType
      };
    }

    const { data, error: queryError } = await useGraphQLQuery(query, {
      variables
    });

    if (queryError.value) {
      throw new Error(queryError.value.message || 'Failed to load flairs');
    }

    if (props.boardId) {
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
    } else {
      if (data.value?.siteFlairs) {
        flairs.value = data.value.siteFlairs;
        emit('flairs-loaded', flairs.value.length > 0);
      } else {
        flairs.value = [];
        emit('flairs-loaded', false);
      }

      if (data.value?.siteFlairCategories) {
        categories.value = data.value.siteFlairCategories.sort((a, b) =>
          (a.displayOrder || 0) - (b.displayOrder || 0)
        );
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load flairs';
    console.error('Error loading flairs:', err);
    emit('flairs-loaded', false);
  } finally {
    loading.value = false;
  }
};

const getFlairTemplate = (templateId: number): FlairTemplate | undefined => {
  const found = flairs.value.find(f => f.id === templateId);
  return found;
};

const getFlairWithStyle = (flair: FlairTemplate) => {
  // Parse styleConfig if needed
  if (flair.styleConfig && !flair.style) {
    flair.style = parseBackendStyle(flair.styleConfig);
  } else if (!flair.style) {
    flair.style = parseBackendStyle(null);
  }

  // Convert template to flair format expected by FlairBadge
  const result = {
    id: flair.id || 0,
    text: flair.textDisplay || '',
    style: flair.style,
    isUserSelectable: true,
    isModOnly: flair.modOnly || false,
    creationDate: '',
    updated: ''
  };

  return result;
};

const getFlairBadgeData = (flairSelection: FlairSelection) => {
  const template = getFlairTemplate(flairSelection.templateId);
  if (!template) {
    return { id: 0, text: '', style: parseBackendStyle(null) };
  }

  const baseData = getFlairWithStyle(template);

  // Use custom text if provided and flair is editable
  if (flairSelection.customText && template.isEditable) {
    return { ...baseData, text: flairSelection.customText };
  }

  return baseData;
};

const isFlairSelected = (flairId: number) => {
  return selectedFlairs.value.some(f => f.templateId === flairId);
};

const isFlairEditable = (templateId: number): boolean => {
  const template = getFlairTemplate(templateId);
  return template?.isEditable ?? false;
};

const toggleFlair = (flair: FlairTemplate) => {
  if (!flair.id) return;

  if (isFlairSelected(flair.id)) {
    // Remove flair
    selectedFlairs.value = selectedFlairs.value.filter(f => f.templateId !== flair.id);
  } else {
    // Add flair if under max limit
    if (selectedFlairs.value.length >= props.maxFlairs) {
      return;
    }
    selectedFlairs.value = [...selectedFlairs.value, {
      templateId: flair.id,
      customText: flair.isEditable ? flair.textDisplay : undefined
    }];
  }

  emitSelectedFlairs();
};

const removeFlairByTemplateId = (templateId: number) => {
  selectedFlairs.value = selectedFlairs.value.filter(f => f.templateId !== templateId);
  emitSelectedFlairs();
};

const emitSelectedFlairs = () => {
  emit('update:modelValue', selectedFlairs.value);
};

// Load flairs on mount and when boardId changes
onMounted(() => {
  loadFlairs();
});
</script>

<style scoped>
.flair-selector-inline {
  /* Component-specific styles if needed */
}
</style>
