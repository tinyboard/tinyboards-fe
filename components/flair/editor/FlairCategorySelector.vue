<template>
  <div class="space-y-3">
    <!-- Category Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Category
      </label>
      <div class="flex gap-2">
        <select
          v-model="selectedCategoryId"
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option :value="null">No Category</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>

        <button
          type="button"
          @click="showCreateModal = true"
          class="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1 whitespace-nowrap"
          title="Create new category"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden sm:inline">New</span>
        </button>
      </div>
    </div>

    <!-- Selected Category Info -->
    <div v-if="selectedCategory" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2">
        <div
          v-if="selectedCategory.color"
          class="w-4 h-4 rounded-full flex-shrink-0"
          :style="{ backgroundColor: selectedCategory.color }"
        ></div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ selectedCategory.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ selectedCategory.siteWide ? 'Site-wide category' : 'Board category' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Create Category Modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showCreateModal = false"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Create Category
            </h3>
            <button
              @click="showCreateModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="createCategory" class="space-y-4">
            <!-- Category Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                v-model="newCategory.name"
                type="text"
                required
                maxlength="50"
                placeholder="e.g., Moderator, VIP, Verified"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- Category Color -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color (Optional)
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model="newCategory.color"
                  type="color"
                  class="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  v-model="newCategory.color"
                  type="text"
                  placeholder="#3b82f6"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-2">
              <button
                type="button"
                @click="showCreateModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating || !newCategory.name"
                class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ creating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>

          <!-- Error Message -->
          <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { FlairCategory } from '~/types/flair';
import { useGraphQLQuery, useGraphQLMutation } from '~/composables/useGraphQL';

interface Props {
  modelValue: number | null | undefined;
  boardId?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [categoryId: number | null];
}>();

// State
const selectedCategoryId = ref<number | null>(props.modelValue || null);
const categories = ref<FlairCategory[]>([]);
const loading = ref(false);
const showCreateModal = ref(false);
const creating = ref(false);
const error = ref('');

const newCategory = ref({
  name: '',
  color: '#3b82f6'
});

// Computed
const selectedCategory = computed(() => {
  if (!selectedCategoryId.value) return null;
  return categories.value.find(c => c.id === selectedCategoryId.value);
});

// Watch for changes
watch(selectedCategoryId, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
  if (newValue !== selectedCategoryId.value) {
    selectedCategoryId.value = newValue || null;
  }
});

// Methods
const loadCategories = async () => {
  loading.value = true;
  error.value = '';

  try {
    const query = `
      query GetFlairCategories($boardId: Int) {
        flairCategories(boardId: $boardId) {
          id
          name
          color
          boardId
          siteWide
          createdAt
          updatedAt
        }
      }
    `;

    const { data, error: queryError } = await useGraphQLQuery(query, {
      variables: { boardId: props.boardId }
    });

    if (queryError.value) {
      throw new Error(queryError.value.message || 'Failed to load categories');
    }

    if (data.value?.flairCategories) {
      categories.value = data.value.flairCategories;
    } else {
      // Fallback to empty array if no categories exist yet
      categories.value = [];
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load categories';
    // Use empty array on error to allow UI to still function
    categories.value = [];
  } finally {
    loading.value = false;
  }
};

const createCategory = async () => {
  if (!newCategory.value.name) return;

  creating.value = true;
  error.value = '';

  try {
    const mutation = `
      mutation CreateFlairCategory($input: CreateFlairCategoryInput!) {
        createFlairCategory(input: $input) {
          id
          name
          color
          boardId
          siteWide
          createdAt
          updatedAt
        }
      }
    `;

    const { data, error: mutationError } = await useGraphQLMutation(mutation, {
      variables: {
        input: {
          name: newCategory.value.name,
          color: newCategory.value.color || null,
          boardId: props.boardId,
          siteWide: !props.boardId
        }
      }
    });

    if (mutationError.value) {
      throw new Error(mutationError.value.message || 'Failed to create category');
    }

    if (data.value?.createFlairCategory) {
      const newCat = data.value.createFlairCategory;
      categories.value.push(newCat);
      selectedCategoryId.value = newCat.id;

      // Reset form
      newCategory.value = {
        name: '',
        color: '#3b82f6'
      };

      showCreateModal.value = false;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to create category';
  } finally {
    creating.value = false;
  }
};

// Load categories on mount
onMounted(() => {
  loadCategories();
});
</script>
