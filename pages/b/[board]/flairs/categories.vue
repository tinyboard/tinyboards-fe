<template>
  <NuxtLayout name="settings">
    <div class="flex flex-col space-y-6">
      <!-- Breadcrumb -->
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <NuxtLink :to="`/b/${boardName}`" class="text-gray-700 dark:text-gray-300 hover:text-primary">
              {{ boardName }}
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <NuxtLink :to="`/b/${boardName}/flairs`" class="ml-1 text-gray-700 dark:text-gray-300 hover:text-primary">
                Flairs
              </NuxtLink>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-gray-500 dark:text-gray-400">Categories</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Flair Categories</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Organize flairs into categories for {{ boardName }}
        </p>
      </div>

      <!-- Category Manager -->
      <FlairCategoryManager
        :categories="categories"
        @create="createCategory"
        @update="updateCategory"
        @delete="deleteCategory"
        @reorder="reorderCategories"
      />

      <!-- Assign Flairs Section -->
      <div class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm">
        <div class="p-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Assign Flairs to Categories</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Drag and drop flairs to organize them
          </p>
        </div>

        <div class="p-4">
          <!-- Uncategorized Flairs -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Uncategorized Flairs ({{ uncategorizedFlairs.length }})
            </h4>
            <div v-if="uncategorizedFlairs.length === 0" class="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border dark:border-gray-800 border-dashed">
              All flairs are categorized
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="flair in uncategorizedFlairs"
                :key="flair.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-800 rounded-md"
              >
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: flair.backgroundColor || '#9ca3af' }"
                  />
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {{ flair.textDisplay }}
                  </span>
                </div>
                <select
                  @change="assignFlairToCategory(flair.id, $event.target.value)"
                  class="form-select gray text-sm ml-2"
                >
                  <option value="">Assign to...</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Categorized Flairs -->
          <div v-for="category in categoriesWithFlairs" :key="category.id" class="mb-6 last:mb-0">
            <div class="flex items-center gap-2 mb-3">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: category.color || '#9ca3af' }"
              />
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ category.name }} ({{ category.flairs.length }})
              </h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="flair in category.flairs"
                :key="flair.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-800 rounded-md"
              >
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: flair.backgroundColor || '#9ca3af' }"
                  />
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {{ flair.textDisplay }}
                  </span>
                </div>
                <button
                  @click="removeFlairFromCategory(flair.id)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  title="Remove from category"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery, useGraphQLMutation } from '@/composables/useGraphQL';
import { requireModPermission } from '@/composables/mod';
import FlairCategoryManager from '@/components/flair/management/FlairCategoryManager.vue';

const route = useRoute();
const toast = useToastStore();

const boardName = route.params.board;

definePageMeta({
  hasAuthRequired: true,
  isLeftNavbarDisabled: true
});

useHead({
  title: `Flair Categories - ${boardName}`
});

// Fetch board data
const { data: boardData, error, refresh } = await useGraphQLQuery(`
  query GetBoardFlairCategories($boardName: String!) {
    board(name: $boardName) {
      id
      name
      myModPermissions
      flairCategories {
        id
        boardId
        name
        description
        color
        displayOrder
        flairCount
        creationDate
        updated
      }
      flairs {
        id
        textDisplay
        backgroundColor
        textColor
        categoryId
      }
    }
  }
`, {
  variables: {
    boardName
  }
});

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to load board data',
    fatal: true
  });
}

const board = computed(() => boardData.value?.board);
const categories = computed(() => board.value?.flairCategories || []);
const allFlairs = computed(() => board.value?.flairs || []);

// Check permissions
const hasConfigPermission = computed(() => {
  const perms = board.value?.myModPermissions;
  if (!perms) return false;

  return requireModPermission(perms, 'config');
});

// Check permissions after data loads
watch(hasConfigPermission, (hasPerms) => {
  if (hasPerms === false && board.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to manage flair categories',
      fatal: true
    });
  }
});

const uncategorizedFlairs = computed(() => {
  return allFlairs.value.filter(f => !f.categoryId);
});

const categoriesWithFlairs = computed(() => {
  return categories.value.map(cat => ({
    ...cat,
    flairs: allFlairs.value.filter(f => f.categoryId === cat.id)
  }));
});

// Create category
const createCategory = async (categoryData) => {
  try {
    const mutation = `
      mutation CreateFlairCategory($input: CreateFlairCategoryInput!) {
        createFlairCategory(input: $input) {
          id
          name
        }
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        input: {
          boardId: board.value.id,
          ...categoryData
        }
      }
    });

    if (result.value?.createFlairCategory) {
      toast.addNotification({
        header: 'Category created',
        message: `The category "${categoryData.name}" has been created.`,
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error creating category:', error);
    toast.addNotification({
      header: 'Create failed',
      message: error.message || 'Failed to create category.',
      type: 'error'
    });
  }
};

// Update category
const updateCategory = async (categoryData) => {
  try {
    const mutation = `
      mutation UpdateFlairCategory($input: UpdateFlairCategoryInput!) {
        updateFlairCategory(input: $input) {
          id
          name
        }
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        input: categoryData
      }
    });

    if (result.value?.updateFlairCategory) {
      toast.addNotification({
        header: 'Category updated',
        message: 'The category has been updated.',
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error updating category:', error);
    toast.addNotification({
      header: 'Update failed',
      message: error.message || 'Failed to update category.',
      type: 'error'
    });
  }
};

// Delete category
const deleteCategory = async (category) => {
  try {
    const mutation = `
      mutation DeleteFlairCategory($categoryId: Int!) {
        deleteFlairCategory(categoryId: $categoryId)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        categoryId: category.id
      }
    });

    if (result.value?.deleteFlairCategory) {
      toast.addNotification({
        header: 'Category deleted',
        message: `The category "${category.name}" has been deleted.`,
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.addNotification({
      header: 'Delete failed',
      message: error.message || 'Failed to delete category.',
      type: 'error'
    });
  }
};

// Reorder categories
const reorderCategories = async (order) => {
  try {
    const mutation = `
      mutation ReorderFlairCategories($order: [ReorderFlairCategoriesInput!]!) {
        reorderFlairCategories(order: $order)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        order
      }
    });

    if (result.value?.reorderFlairCategories) {
      toast.addNotification({
        header: 'Order updated',
        message: 'Category order has been updated.',
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error reordering categories:', error);
    toast.addNotification({
      header: 'Reorder failed',
      message: error.message || 'Failed to reorder categories.',
      type: 'error'
    });
  }
};

// Assign flair to category
const assignFlairToCategory = async (flairId, categoryId) => {
  try {
    const mutation = `
      mutation UpdateFlairTemplate($templateId: Int!, $input: UpdateFlairTemplateInput!) {
        updateFlairTemplate(templateId: $templateId, input: $input) {
          id
          categoryId
        }
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        templateId: flairId,
        input: {
          categoryId: categoryId ? parseInt(categoryId) : null
        }
      }
    });

    if (result.value?.updateFlairTemplate) {
      toast.addNotification({
        header: 'Flair updated',
        message: 'Flair has been assigned to category.',
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error assigning flair:', error);
    toast.addNotification({
      header: 'Assignment failed',
      message: error.message || 'Failed to assign flair to category.',
      type: 'error'
    });
  }
};

// Remove flair from category
const removeFlairFromCategory = async (flairId) => {
  await assignFlairToCategory(flairId, null);
};
</script>
