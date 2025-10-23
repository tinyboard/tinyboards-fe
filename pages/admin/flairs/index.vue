<template>
  <NuxtLayout name="admin">
    <div class="flex flex-col space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Site-Wide Flairs</h2>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage global flairs that apply across the entire site
          </p>
        </div>
        <NuxtLink to="/admin/flairs/create" class="button primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
          </svg>
          Create Global Flair
        </NuxtLink>
      </div>

      <!-- Info Box -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M12 9h.01" />
              <path d="M11 12h1v4h1" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-900 dark:text-blue-100">About Site-Wide Flairs</h3>
            <p class="mt-1 text-sm text-blue-800 dark:text-blue-200">
              Site-wide flairs are available globally and can be used when boards are disabled or for special administrative purposes.
            </p>
          </div>
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
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery, useGraphQLMutation } from '@/composables/useGraphQL';
import FlairTable from '@/components/flair/management/FlairTable.vue';

const router = useRouter();
const toast = useToastStore();

const activeTab = ref('post');

definePageMeta({
  hasAuthRequired: true,
  isAdminRequired: true,
  isLeftNavbarDisabled: true,
  title: 'Site-Wide Flairs'
});

useHead({
  title: 'Site-Wide Flairs - Admin'
});

// Fetch site-wide flairs
const { data: flairsData, pending, error, refresh } = await useGraphQLQuery(`
  query GetSiteFlairs {
    getSiteFlairs {
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
      createdAt
      updatedAt
    }
  }
`);

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to load site-wide flairs',
    fatal: true
  });
}

const allFlairs = computed(() => flairsData.value?.getSiteFlairs || []);

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
  router.push(`/admin/flairs/${flair.id}/edit`);
};

// Delete flair
const deleteFlair = async (flair) => {
  try {
    const mutation = `
      mutation DeleteSiteFlair($flairId: Int!) {
        deleteSiteFlair(flairId: $flairId)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        flairId: flair.id
      }
    });

    if (result.value?.deleteSiteFlair) {
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
      mutation DuplicateSiteFlair($flairId: Int!) {
        duplicateSiteFlair(flairId: $flairId) {
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

    if (result.value?.duplicateSiteFlair) {
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
      mutation UpdateSiteFlair($input: UpdateSiteFlairInput!) {
        updateSiteFlair(input: $input) {
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

    if (result.value?.updateSiteFlair) {
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
      mutation BulkDeleteSiteFlairs($flairIds: [Int!]!) {
        bulkDeleteSiteFlairs(flairIds: $flairIds)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        flairIds
      }
    });

    if (result.value?.bulkDeleteSiteFlairs) {
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
      mutation BulkToggleSiteFlairs($flairIds: [Int!]!) {
        bulkToggleSiteFlairs(flairIds: $flairIds)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        flairIds
      }
    });

    if (result.value?.bulkToggleSiteFlairs) {
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
