<template>
  <div class="pending-user-flairs">
    <div class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm overflow-hidden">
      <div class="p-4 border-b dark:border-gray-800">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Pending User Flair Requests</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Review and approve user flair requests
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <p class="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading pending flairs...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg m-4">
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Pending Flairs List -->
      <div v-else-if="pendingFlairs.length > 0" class="divide-y dark:divide-gray-800">
        <div
          v-for="pendingFlair in pendingFlairs"
          :key="pendingFlair.id"
          class="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <NuxtLink
                  :to="`/@${pendingFlair.user.name}`"
                  class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ pendingFlair.user.name }}
                </NuxtLink>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(pendingFlair.creationDate) }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <FlairDisplayFlairBadge
                  :flair="getFlairPreview(pendingFlair)"
                  size="md"
                />
                <span v-if="pendingFlair.template" class="text-xs text-gray-500 dark:text-gray-400">
                  ({{ pendingFlair.template.textDisplay }})
                </span>
              </div>
            </div>

            <div class="flex gap-2 ml-4">
              <button
                @click="approveFlair(pendingFlair.id)"
                :disabled="processing.has(pendingFlair.id)"
                class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M5 12l5 5l10 -10" />
                </svg>
                {{ processing.has(pendingFlair.id) ? 'Approving...' : 'Approve' }}
              </button>
              <button
                @click="rejectFlair(pendingFlair.id)"
                :disabled="processing.has(pendingFlair.id)"
                class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
                {{ processing.has(pendingFlair.id) ? 'Rejecting...' : 'Reject' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M5 12l5 5l10 -10" />
        </svg>
        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">No pending flair requests</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { useGraphQLQuery, useGraphQLMutation } from '@/composables/useGraphQL';
import { useToastStore } from '@/stores/StoreToast';

interface Props {
  boardId: number;
}

const props = defineProps<Props>();

const toast = useToastStore();
const { parseBackendStyle } = useFlairStyle();

// State
const loading = ref(false);
const error = ref('');
const processing = ref<Set<number>>(new Set());

// Fetch pending user flairs
const { data, error: queryError, refresh } = await useGraphQLQuery(`
  query GetPendingUserFlairs($boardId: Int!) {
    pendingUserFlairs(boardId: $boardId) {
      id
      userId
      boardId
      templateId
      textDisplay
      customBackgroundColor
      customTextColor
      creationDate
      user {
        id
        name
        avatar
      }
      template {
        id
        textDisplay
        backgroundColor
        textColor
        styleConfig
      }
    }
  }
`, {
  variables: {
    boardId: props.boardId
  }
});

if (queryError.value) {
  error.value = queryError.value.message || 'Failed to load pending flairs';
}

const pendingFlairs = computed(() => data.value?.pendingUserFlairs || []);

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
};

const getFlairPreview = (flair: any) => {
  const backgroundColor = flair.customBackgroundColor || flair.template?.backgroundColor || '#e5e7eb';
  const textColor = flair.customTextColor || flair.template?.textColor || '#374151';

  let style;
  if (flair.template?.styleConfig) {
    style = parseBackendStyle(flair.template.styleConfig);
  } else {
    style = parseBackendStyle(null);
    style.backgroundColor = backgroundColor;
    style.textColor = textColor;
  }

  return {
    id: flair.id,
    text: flair.textDisplay,
    style: style
  };
};

const approveFlair = async (flairId: number) => {
  processing.value.add(flairId);
  error.value = '';

  try {
    const mutation = `
      mutation ApproveUserFlair($flairId: Int!) {
        approveUserFlair(flairId: $flairId) {
          id
          isApproved
        }
      }
    `;

    const { data: result, error: mutationError } = await useGraphQLMutation(mutation, {
      variables: {
        flairId
      }
    });

    if (mutationError.value) {
      throw new Error(mutationError.value.message || 'Failed to approve flair');
    }

    if (result.value?.approveUserFlair) {
      toast.addNotification({
        header: 'Flair Approved',
        message: 'The user flair has been approved successfully.',
        type: 'success'
      });

      await refresh();
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to approve flair';
    toast.addNotification({
      header: 'Approval Failed',
      message: error.value,
      type: 'error'
    });
  } finally {
    processing.value.delete(flairId);
  }
};

const rejectFlair = async (flairId: number) => {
  if (!confirm('Are you sure you want to reject this flair request?')) return;

  processing.value.add(flairId);
  error.value = '';

  try {
    const mutation = `
      mutation RejectUserFlair($flairId: Int!) {
        rejectUserFlair(flairId: $flairId) {
          id
          isApproved
        }
      }
    `;

    const { data: result, error: mutationError } = await useGraphQLMutation(mutation, {
      variables: {
        flairId
      }
    });

    if (mutationError.value) {
      throw new Error(mutationError.value.message || 'Failed to reject flair');
    }

    if (result.value?.rejectUserFlair) {
      toast.addNotification({
        header: 'Flair Rejected',
        message: 'The user flair request has been rejected.',
        type: 'success'
      });

      await refresh();
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to reject flair';
    toast.addNotification({
      header: 'Rejection Failed',
      message: error.value,
      type: 'error'
    });
  } finally {
    processing.value.delete(flairId);
  }
};
</script>

<style scoped>
.pending-user-flairs {
  /* Component-specific styles if needed */
}
</style>
