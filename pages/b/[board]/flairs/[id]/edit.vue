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
              <span class="ml-1 text-gray-500 dark:text-gray-400">Edit</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Flair</h2>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Editing: {{ flair?.name }}
          </p>
        </div>
        <button
          @click="confirmDelete"
          class="button red"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
          Delete Flair
        </button>
      </div>

      <!-- Flair Editor -->
      <FlairEditor
        :flair="flair"
        :board-id="boardId"
        @save="handleSave"
        @cancel="handleCancel"
      />

      <!-- Usage Statistics -->
      <FlairUsageStats
        v-if="flair"
        :flair-type="flair.flairType"
        :stats="usageStats"
        :chart-data="chartData"
        :top-posts="topPosts"
        :top-users="topUsers"
      />

      <!-- Current Usage -->
      <div v-if="flair && (currentPosts.length > 0 || currentUsers.length > 0)" class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Current Usage</h3>

        <!-- Posts using this flair -->
        <div v-if="flair.flairType === 'post' && currentPosts.length > 0" class="mb-6">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Posts with this flair ({{ currentPosts.length }})
          </h4>
          <ul class="space-y-2">
            <li
              v-for="post in currentPosts.slice(0, 10)"
              :key="post.id"
              class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <NuxtLink
                :to="`/p/${post.id}`"
                class="flex-1 text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {{ post.title }}
              </NuxtLink>
              <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {{ post.score }} points
              </span>
            </li>
          </ul>
          <p v-if="currentPosts.length > 10" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            And {{ currentPosts.length - 10 }} more...
          </p>
        </div>

        <!-- Users with this flair -->
        <div v-if="flair.flairType === 'user' && currentUsers.length > 0">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Users with this flair ({{ currentUsers.length }})
          </h4>
          <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <li
              v-for="user in currentUsers.slice(0, 20)"
              :key="user.id"
              class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <img :src="user.avatar" :alt="user.name" class="w-6 h-6 rounded object-cover" />
              <NuxtLink
                :to="`/@${user.name}`"
                class="flex-1 text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {{ user.name }}
              </NuxtLink>
            </li>
          </ul>
          <p v-if="currentUsers.length > 20" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            And {{ currentUsers.length - 20 }} more...
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToastStore } from '@/stores/StoreToast';
import { useGraphQLQuery, useGraphQLMutation } from '@/composables/useGraphQL';
import FlairEditor from '@/components/flair/editor/FlairEditor.vue';
import FlairUsageStats from '@/components/flair/management/FlairUsageStats.vue';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const boardName = route.params.board;
const flairId = parseInt(route.params.id);

definePageMeta({
  hasAuthRequired: true,
  isLeftNavbarDisabled: true
});

// Fetch flair data
const { data: flairData, error, refresh } = await useGraphQLQuery(`
  query GetFlair($flairId: Int!) {
    flair(id: $flairId) {
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
      modOnly
      maxUses
      expiresAt
      categoryId
      usageCount
      board {
        id
        name
        myModPermissions
      }
      createdAt
      updatedAt
    }
    getFlairUsageStats(flairId: $flairId) {
      totalUsage
      thisWeek
      thisMonth
      uniqueUsers
    }
    getFlairUsageChart(flairId: $flairId) {
      date
      label
      count
    }
  }
`, {
  variables: {
    flairId
  }
});

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Flair not found',
    fatal: true
  });
}

const flair = computed(() => flairData.value?.flair);
const boardId = computed(() => flair.value?.board.id);
const usageStats = computed(() => flairData.value?.getFlairUsageStats || {});
const chartData = computed(() => flairData.value?.getFlairUsageChart || []);

useHead({
  title: computed(() => `Edit ${flair.value?.name} - ${boardName}`)
});

// Check permissions
const hasConfigPermission = computed(() => {
  const perms = flair.value?.board?.myModPermissions;
  return perms && (perms.includes('CONFIG') || perms.includes('ALL'));
});

if (!hasConfigPermission.value) {
  throw createError({
    statusCode: 403,
    statusMessage: 'You do not have permission to edit flairs',
    fatal: true
  });
}

// Fetch posts/users using this flair
const { data: usageData } = await useGraphQLQuery(`
  query GetFlairUsage($flairId: Int!) {
    getFlairPosts(flairId: $flairId, limit: 50) {
      id
      title
      score
    }
    getFlairUsers(flairId: $flairId, limit: 50) {
      id
      name
      avatar
    }
    getFlairTopPosts(flairId: $flairId, limit: 5) {
      id
      title
      score
      author {
        name
      }
      createdAt
    }
    getFlairTopUsers(flairId: $flairId, limit: 5) {
      id
      name
      avatar
      reputation
    }
  }
`, {
  variables: {
    flairId
  }
});

const currentPosts = computed(() => usageData.value?.getFlairPosts || []);
const currentUsers = computed(() => usageData.value?.getFlairUsers || []);
const topPosts = computed(() => usageData.value?.getFlairTopPosts || []);
const topUsers = computed(() => usageData.value?.getFlairTopUsers || []);

const handleSave = async () => {
  toast.addNotification({
    header: 'Flair updated',
    message: 'The flair has been updated successfully.',
    type: 'success'
  });
  await refresh();
};

const handleCancel = () => {
  router.push(`/b/${boardName}/flairs`);
};

const confirmDelete = async () => {
  const usageCount = flair.value?.usageCount || 0;
  const message = usageCount > 0
    ? `This flair is currently being used by ${usageCount} ${flair.value.flairType === 'post' ? 'post(s)' : 'user(s)'}. Are you sure you want to delete it?`
    : 'Are you sure you want to delete this flair? This action cannot be undone.';

  if (!confirm(message)) return;

  try {
    const mutation = `
      mutation DeleteFlair($flairId: Int!) {
        deleteFlair(flairId: $flairId)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        flairId
      }
    });

    if (result.value?.deleteFlair) {
      toast.addNotification({
        header: 'Flair deleted',
        message: 'The flair has been deleted successfully.',
        type: 'success'
      });
      router.push(`/b/${boardName}/flairs`);
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
</script>
