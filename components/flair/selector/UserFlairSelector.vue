<template>
  <div class="user-flair-selector space-y-4">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="ml-3 text-sm text-gray-600 dark:text-gray-400">Loading flairs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Current User Flair -->
    <div v-else-if="currentFlair" class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Current Flair:</p>
          <FlairDisplayFlairBadge
            :flair="currentFlairWithStyle"
            size="md"
            :removable="false"
          />
          <p v-if="!currentFlair.isApproved" class="mt-2 text-xs text-amber-600 dark:text-amber-400">
            ⏳ Pending moderator approval
          </p>
        </div>
        <button
          @click="removeFlair"
          :disabled="removing"
          class="px-3 py-2 text-sm border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
        >
          {{ removing ? 'Removing...' : 'Remove' }}
        </button>
      </div>
    </div>

    <!-- Select New Flair -->
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

      <!-- Available Flairs Grid -->
      <div v-if="availableFlairs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          v-for="flair in filteredFlairs"
          :key="flair.id"
          @click="selectFlair(flair)"
          :disabled="assigning"
          :class="[
            'p-3 rounded-lg border-2 text-left transition-all',
            'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700/50',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          ]"
        >
          <FlairDisplayFlairBadge
            :flair="getFlairWithStyle(flair)"
            size="sm"
            :clickable="false"
          />
          <p v-if="flair.modOnly" class="mt-2 text-xs text-orange-600 dark:text-orange-400">
            🛡️ Moderator only
          </p>
          <p v-if="flair.requiresApproval" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
            ⏳ Requires approval
          </p>
        </button>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M7 7h3l4 9h.5a3.5 3.5 0 0 0 0 -7h-11z" />
          <path d="M7 12l8 0" />
        </svg>
        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">No flairs available for this board</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlairTemplate, FlairCategory } from '~/types/flair';

interface Props {
  boardId: number;
  userId: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'flair-assigned': [];
  'flair-removed': [];
}>();

const { parseBackendStyle } = useFlairStyle();
const toast = useToastStore();

// State
const loading = ref(false);
const error = ref('');
const assigning = ref(false);
const removing = ref(false);
const availableFlairs = ref<FlairTemplate[]>([]);
const categories = ref<FlairCategory[]>([]);
const currentFlair = ref<any>(null);
const selectedCategory = ref<number | null>(null);

// Computed
const filteredFlairs = computed(() => {
  if (selectedCategory.value === null) {
    return availableFlairs.value;
  }
  return availableFlairs.value.filter(f => f.categoryId === selectedCategory.value);
});

const currentFlairWithStyle = computed(() => {
  if (!currentFlair.value) return null;
  return getFlairWithStyle(currentFlair.value);
});

// Methods
const loadData = async () => {
  loading.value = true;
  error.value = '';

  try {
    const query = `
      query GetUserFlairData($boardId: Int!, $userId: Int!) {
        boardFlairs(boardId: $boardId, flairType: user, activeOnly: true) {
          id
          textDisplay
          isEditable
          modOnly
          styleConfig
          categoryId
          requiresApproval
          isActive
          backgroundColor
          textColor
        }
        flairCategories(boardId: $boardId) {
          id
          name
          description
          color
          displayOrder
        }
        userFlair(userId: $userId, boardId: $boardId) {
          id
          userId
          boardId
          templateId
          textDisplay
          backgroundColor
          textColor
          styleConfig
          isApproved
        }
      }
    `;

    const { data, error: queryError } = await useGraphQLQuery(query, {
      variables: {
        boardId: props.boardId,
        userId: props.userId
      }
    });

    if (queryError.value) {
      throw new Error(queryError.value.message || 'Failed to load flairs');
    }

    if (data.value?.boardFlairs) {
      availableFlairs.value = data.value.boardFlairs;
    }

    if (data.value?.flairCategories) {
      categories.value = data.value.flairCategories.sort((a, b) =>
        (a.displayOrder || 0) - (b.displayOrder || 0)
      );
    }

    if (data.value?.userFlair) {
      currentFlair.value = data.value.userFlair;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load flairs';
    console.error('Error loading user flair data:', err);
  } finally {
    loading.value = false;
  }
};

const getFlairWithStyle = (flair: any) => {
  // Parse styleConfig if needed
  let style;
  if (flair.styleConfig) {
    style = parseBackendStyle(flair.styleConfig);
  } else {
    style = parseBackendStyle(null);
    // Use background/text colors if available
    if (flair.backgroundColor) {
      style.backgroundColor = flair.backgroundColor;
    }
    if (flair.textColor) {
      style.textColor = flair.textColor;
    }
  }

  return {
    id: flair.id || 0,
    text: flair.textDisplay || '',
    style: style,
    isUserSelectable: true,
    isModOnly: flair.modOnly || false,
    creationDate: '',
    updated: ''
  };
};

const selectFlair = async (flair: FlairTemplate) => {
  assigning.value = true;
  error.value = '';

  try {
    const mutation = `
      mutation AssignUserFlair($input: AssignUserFlairInput!) {
        assignUserFlair(input: $input) {
          id
          userId
          boardId
          textDisplay
          isApproved
        }
      }
    `;

    const { data, error: mutationError } = await useGraphQLMutation(mutation, {
      variables: {
        input: {
          userId: props.userId,
          boardId: props.boardId,
          templateId: flair.id,
          textDisplay: flair.textDisplay
        }
      }
    });

    if (mutationError.value) {
      throw new Error(mutationError.value.message || 'Failed to assign flair');
    }

    if (data.value?.assignUserFlair) {
      currentFlair.value = data.value.assignUserFlair;

      toast.addNotification({
        header: 'Flair Assigned',
        message: currentFlair.value.isApproved
          ? 'Your flair has been assigned successfully!'
          : 'Your flair request has been submitted for approval.',
        type: 'success'
      });

      emit('flair-assigned');
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to assign flair';
    toast.addNotification({
      header: 'Assignment Failed',
      message: error.value,
      type: 'error'
    });
  } finally {
    assigning.value = false;
  }
};

const removeFlair = async () => {
  if (!confirm('Are you sure you want to remove your flair?')) return;

  removing.value = true;
  error.value = '';

  try {
    const mutation = `
      mutation RemoveUserFlair($userId: Int!, $boardId: Int!) {
        removeUserFlair(userId: $userId, boardId: $boardId)
      }
    `;

    const { data, error: mutationError } = await useGraphQLMutation(mutation, {
      variables: {
        userId: props.userId,
        boardId: props.boardId
      }
    });

    if (mutationError.value) {
      throw new Error(mutationError.value.message || 'Failed to remove flair');
    }

    if (data.value?.removeUserFlair) {
      currentFlair.value = null;

      toast.addNotification({
        header: 'Flair Removed',
        message: 'Your flair has been removed successfully.',
        type: 'success'
      });

      emit('flair-removed');
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to remove flair';
    toast.addNotification({
      header: 'Removal Failed',
      message: error.value,
      type: 'error'
    });
  } finally {
    removing.value = false;
  }
};

// Load data on mount
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.user-flair-selector {
  /* Component-specific styles if needed */
}
</style>
