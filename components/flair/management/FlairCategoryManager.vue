<template>
  <div class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm">
    <!-- Header -->
    <div class="p-4 border-b dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Flair Categories</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Organize flairs into categories for better management
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md transition-colors duration-200 text-sm font-medium whitespace-nowrap"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        <span>New Category</span>
      </button>
    </div>

    <!-- Categories List -->
    <div class="p-4">
      <div v-if="categories.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
          <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
        </svg>
        <p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">No categories yet</p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Create your first category to get started</p>
      </div>

      <draggable
        v-else
        v-model="localCategories"
        @end="onReorder"
        item-key="id"
        handle=".drag-handle"
        class="space-y-3"
      >
        <template #item="{ element: category }">
          <div
            class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <!-- Drag Handle -->
            <div class="drag-handle cursor-move text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              </svg>
            </div>

            <!-- Color Indicator -->
            <div
              class="w-4 h-4 rounded-full flex-shrink-0"
              :style="{ backgroundColor: category.color || '#9ca3af' }"
            />

            <!-- Category Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900 dark:text-gray-100">{{ category.name }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">({{ category.flairCount || 0 }} flairs)</span>
              </div>
              <p v-if="category.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ category.description }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button
                @click="editCategory(category)"
                class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                  <path d="M20.385 6.585a2.1 2.1 0 0 0 0 -2.97a2.1 2.1 0 0 0 -2.97 0l-8.415 8.385v3h3l8.385 -8.415z" />
                  <path d="M16 5l3 3" />
                </svg>
              </button>
              <button
                @click="confirmDelete(category)"
                class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-950 rounded-lg shadow-xl max-w-md w-full m-4">
        <div class="p-6">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {{ editingCategory ? 'Edit Category' : 'Create Category' }}
          </h4>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input gray w-full"
                placeholder="Category name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="form-input gray w-full"
                placeholder="Brief description of this category"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <div class="flex gap-2">
                <input
                  v-model="formData.color"
                  type="color"
                  class="h-10 w-20 rounded border border-gray-300 dark:border-gray-700"
                />
                <input
                  v-model="formData.color"
                  type="text"
                  class="form-input gray flex-1"
                  placeholder="#6366f1"
                />
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="closeModal"
              class="button gray"
            >
              Cancel
            </button>
            <button
              @click="saveCategory"
              class="button primary"
              :disabled="!formData.name"
            >
              {{ editingCategory ? 'Save Changes' : 'Create Category' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import draggable from 'vuedraggable';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['create', 'update', 'delete', 'reorder']);

const showModal = ref(false);
const editingCategory = ref(null);
const localCategories = ref([...props.categories]);

const formData = ref({
  name: '',
  description: '',
  color: '#6366f1'
});

const openCreateModal = () => {
  editingCategory.value = null;
  formData.value = {
    name: '',
    description: '',
    color: '#6366f1'
  };
  showModal.value = true;
};

const editCategory = (category) => {
  editingCategory.value = category;
  formData.value = {
    name: category.name,
    description: category.description || '',
    color: category.color || '#6366f1'
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingCategory.value = null;
};

const saveCategory = () => {
  if (editingCategory.value) {
    emit('update', {
      id: editingCategory.value.id,
      ...formData.value
    });
  } else {
    emit('create', formData.value);
  }
  closeModal();
};

const confirmDelete = (category) => {
  if (confirm(`Are you sure you want to delete the category "${category.name}"? Flairs in this category won't be deleted.`)) {
    emit('delete', category);
  }
};

const onReorder = () => {
  const order = localCategories.value.map((cat, index) => ({
    id: cat.id,
    order: index
  }));
  emit('reorder', order);
};

// Watch for external changes
watch(() => props.categories, (newCategories) => {
  localCategories.value = [...newCategories];
}, { deep: true });
</script>
