<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Post Flairs
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Current Flairs -->
          <div v-if="currentFlairIds.length > 0" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Current Flairs
            </label>
            <div class="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <FlairDisplayFlairBadge
                v-for="flair in currentFlairsWithStyle"
                :key="flair.id"
                :flair="flair"
                size="md"
                :removable="true"
                @remove="removeFlair"
              />
            </div>
          </div>

          <!-- Flair Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ currentFlairIds.length > 0 ? 'Add More Flairs' : 'Add Flairs' }}
            </label>

            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center p-8">
              <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading flairs...</p>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
            </div>

            <!-- Flair Grid -->
            <div v-else>
              <!-- Category Filters -->
              <div v-if="categories.length > 0" class="mb-4">
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="selectedCategory = null"
                    :class="[
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
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
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    ]"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>

              <!-- Available Flairs -->
              <div v-if="filteredFlairs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  v-for="flair in filteredFlairs"
                  :key="flair.id"
                  type="button"
                  @click="addFlair(flair)"
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
              <div v-else class="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  No flairs available
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t dark:border-gray-700 p-4 flex gap-3">
          <button
            @click="closeModal"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            @click="saveFlairs"
            :disabled="saving || !hasChanges"
            class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { FlairTemplate, FlairCategory } from '~/types/flair';

interface Props {
  show: boolean;
  postId: number;
  boardId: number;
  initialFlairIds?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  initialFlairIds: () => []
});

const emit = defineEmits<{
  'close': [];
  'updated': [flairIds: number[]];
}>();

const { parseBackendStyle } = useFlairStyle();
const toast = useToastStore();

// State
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const flairs = ref<FlairTemplate[]>([]);
const categories = ref<FlairCategory[]>([]);
const selectedCategory = ref<number | null>(null);
const currentFlairIds = ref<number[]>([...props.initialFlairIds]);

// Watch for prop changes
watch(() => props.initialFlairIds, (newIds) => {
  currentFlairIds.value = [...newIds];
});

watch(() => props.show, (isShowing) => {
  if (isShowing) {
    loadFlairs();
    currentFlairIds.value = [...props.initialFlairIds];
  }
});

// Computed
const filteredFlairs = computed(() => {
  if (selectedCategory.value === null) {
    return flairs.value;
  }
  return flairs.value.filter(f => f.categoryId === selectedCategory.value);
});

const currentFlairsWithStyle = computed(() => {
  return currentFlairIds.value
    .map(id => flairs.value.find(f => f.id === id))
    .filter(Boolean)
    .map(flair => getFlairWithStyle(flair!));
});

const hasChanges = computed(() => {
  const initial = [...props.initialFlairIds].sort();
  const current = [...currentFlairIds.value].sort();
  return JSON.stringify(initial) !== JSON.stringify(current);
});

// Methods
const loadFlairs = async () => {
  loading.value = true;
  error.value = '';

  try {
    const query = `
      query GetBoardFlairs($boardId: Int!) {
        boardFlairs(boardId: $boardId, flairType: post, activeOnly: true) {
          id
          textDisplay
          isEditable
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
      variables: { boardId: props.boardId }
    });

    if (queryError.value) {
      throw new Error(queryError.value.message || 'Failed to load flairs');
    }

    if (data.value?.boardFlairs) {
      flairs.value = data.value.boardFlairs;
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
  const parsedStyle = flair.styleConfig
    ? parseBackendStyle(flair.styleConfig)
    : parseBackendStyle(null);

  return {
    id: flair.id || 0,
    text: flair.textDisplay || '',
    style: parsedStyle,
    isUserSelectable: true,
    isModOnly: flair.modOnly || false,
    creationDate: '',
    updated: ''
  };
};

const isFlairSelected = (flairId: number) => {
  return currentFlairIds.value.includes(flairId);
};

const addFlair = (flair: FlairTemplate) => {
  if (!flair.id || isFlairSelected(flair.id)) return;
  currentFlairIds.value = [...currentFlairIds.value, flair.id];
};

const removeFlair = (flair: any) => {
  currentFlairIds.value = currentFlairIds.value.filter(id => id !== flair.id);
};

const saveFlairs = async () => {
  saving.value = true;
  error.value = '';

  try {
    const mutation = `
      mutation UpdatePostFlairs($postId: Int!, $flairIds: [Int!]!) {
        updatePostFlairs(postId: $postId, flairIds: $flairIds) {
          id
          postId
          templateId
          textDisplay
        }
      }
    `;

    const { data, error: mutationError } = await useGraphQLMutation(mutation, {
      variables: {
        postId: props.postId,
        flairIds: currentFlairIds.value
      }
    });

    if (mutationError.value) {
      throw new Error(mutationError.value.message || 'Failed to update flairs');
    }

    toast.addNotification({
      header: 'Success',
      message: 'Post flairs updated successfully',
      type: 'success'
    });

    emit('updated', currentFlairIds.value);
    closeModal();
  } catch (err: any) {
    error.value = err.message || 'Failed to update flairs';
    toast.addNotification({
      header: 'Error',
      message: error.value,
      type: 'error'
    });
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
/* Component-specific styles if needed */
</style>
