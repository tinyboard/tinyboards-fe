<template>
  <NuxtLayout name="settings">
    <div class="flex flex-col space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Flair Management</h2>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage post and user flairs for {{ boardName }}
          </p>
        </div>
        <div class="flex gap-2">
          <NuxtLink :to="`/b/${boardName}/flairs/categories`" class="button gray">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
              <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
            </svg>
            Categories
          </NuxtLink>
          <NuxtLink :to="`/b/${boardName}/flairs/create`" class="button primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
            Create Flair
          </NuxtLink>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-800">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'post'"
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'post'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'"
          >
            Post Flairs
            <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="activeTab === 'post' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'">
              {{ postFlairs.length }}
            </span>
          </button>
          <button
            @click="activeTab = 'user'"
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === 'user'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'"
          >
            User Flairs
            <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="activeTab === 'user' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'">
              {{ userFlairs.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Flair Table -->
      <FlairTable
        :flairs="currentFlairs"
        @edit="editFlair"
        @delete="deleteFlair"
        @duplicate="duplicateFlair"
        @toggleActive="toggleFlairActive"
        @bulkDelete="bulkDeleteFlairs"
        @bulkToggleActive="bulkToggleActive"
      />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery, useGraphQLMutation } from '@/composables/useGraphQL';
import FlairTable from '@/components/flair/management/FlairTable.vue';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const boardName = route.params.board;
const activeTab = ref('post');

definePageMeta({
  hasAuthRequired: true,
  isLeftNavbarDisabled: true,
  alias: '/b/:board/mod/flairs'
});

useHead({
  title: `Flair Management - ${boardName}`
});

// Fetch board flairs
const { data: flairsData, pending, error, refresh } = await useGraphQLQuery(`
  query GetBoardFlairs($boardName: String!) {
    board(name: $boardName) {
      id
      name
      myModPermissions
      flairs {
        id
        name
        displayText
        description
        flairType
        backgroundColor
        textColor
        icon
        isActive
        allowUserEdit
        usageCount
        category {
          id
          name
        }
        createdAt
        updatedAt
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
    statusMessage: 'Failed to load board flairs',
    fatal: true
  });
}

const board = computed(() => flairsData.value?.board);
const allFlairs = computed(() => board.value?.flairs || []);

// Check permissions
const hasConfigPermission = computed(() => {
  const perms = board.value?.myModPermissions;
  return perms && (perms.includes('CONFIG') || perms.includes('ALL'));
});

if (!hasConfigPermission.value) {
  throw createError({
    statusCode: 403,
    statusMessage: 'You do not have permission to manage flairs',
    fatal: true
  });
}

const postFlairs = computed(() => {
  return allFlairs.value.filter(f => f.flairType === 'post');
});

const userFlairs = computed(() => {
  return allFlairs.value.filter(f => f.flairType === 'user');
});

const currentFlairs = computed(() => {
  return activeTab.value === 'post' ? postFlairs.value : userFlairs.value;
});

// Edit flair
const editFlair = (flair) => {
  router.push(`/b/${boardName}/flairs/${flair.id}/edit`);
};

// Delete flair
const deleteFlair = async (flair) => {
  try {
    const mutation = `
      mutation DeleteFlair($flairId: Int!) {
        deleteFlair(flairId: $flairId)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        flairId: flair.id
      }
    });

    if (result.value?.deleteFlair) {
      toast.addNotification({
        header: 'Flair deleted',
        message: `The flair "${flair.name}" has been deleted.`,
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error deleting flair:', error);
    toast.addNotification({
      header: 'Delete failed',
      message: error.message || 'Failed to delete flair.',
      type: 'error'
    });
  }
};

// Duplicate flair
const duplicateFlair = async (flair) => {
  try {
    const mutation = `
      mutation DuplicateFlair($flairId: Int!) {
        duplicateFlair(flairId: $flairId) {
          id
          name
        }
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        flairId: flair.id
      }
    });

    if (result.value?.duplicateFlair) {
      toast.addNotification({
        header: 'Flair duplicated',
        message: `Created a copy of "${flair.name}".`,
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error duplicating flair:', error);
    toast.addNotification({
      header: 'Duplicate failed',
      message: error.message || 'Failed to duplicate flair.',
      type: 'error'
    });
  }
};

// Toggle flair active status
const toggleFlairActive = async (flair) => {
  try {
    const mutation = `
      mutation UpdateFlair($input: UpdateFlairInput!) {
        updateFlair(input: $input) {
          id
          isActive
        }
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        input: {
          flairId: flair.id,
          isActive: !flair.isActive
        }
      }
    });

    if (result.value?.updateFlair) {
      toast.addNotification({
        header: 'Flair updated',
        message: `Flair "${flair.name}" is now ${!flair.isActive ? 'active' : 'inactive'}.`,
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error toggling flair:', error);
    toast.addNotification({
      header: 'Update failed',
      message: error.message || 'Failed to update flair.',
      type: 'error'
    });
  }
};

// Bulk delete flairs
const bulkDeleteFlairs = async (flairIds) => {
  try {
    const mutation = `
      mutation BulkDeleteFlairs($flairIds: [Int!]!) {
        bulkDeleteFlairs(flairIds: $flairIds)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        flairIds
      }
    });

    if (result.value?.bulkDeleteFlairs) {
      toast.addNotification({
        header: 'Flairs deleted',
        message: `Successfully deleted ${flairIds.length} flair(s).`,
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error bulk deleting flairs:', error);
    toast.addNotification({
      header: 'Bulk delete failed',
      message: error.message || 'Failed to delete flairs.',
      type: 'error'
    });
  }
};

// Bulk toggle active
const bulkToggleActive = async (flairIds) => {
  try {
    const mutation = `
      mutation BulkToggleFlairs($flairIds: [Int!]!) {
        bulkToggleFlairs(flairIds: $flairIds)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        flairIds
      }
    });

    if (result.value?.bulkToggleFlairs) {
      toast.addNotification({
        header: 'Flairs updated',
        message: `Successfully toggled ${flairIds.length} flair(s).`,
        type: 'success'
      });
      await refresh();
    }
  } catch (error) {
    console.error('Error bulk toggling flairs:', error);
    toast.addNotification({
      header: 'Bulk toggle failed',
      message: error.message || 'Failed to toggle flairs.',
      type: 'error'
    });
  }
};
</script>
