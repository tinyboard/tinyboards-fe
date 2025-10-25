<template>
  <NuxtLayout name="admin">
    <div class="flex flex-col space-y-6">
      <!-- Breadcrumb -->
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <NuxtLink to="/admin" class="text-gray-700 dark:text-gray-300 hover:text-primary">
              Admin
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <NuxtLink to="/admin/flairs" class="ml-1 text-gray-700 dark:text-gray-300 hover:text-primary">
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
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Site-Wide Flair</h2>
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
        :is-site-wide="true"
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
                :to="getPostUrl(post)"
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
import { useSiteStore } from '@/stores/StoreSite';
import { useGraphQLQuery, useGraphQLMutation } from '@/composables/useGraphQL';
import FlairEditor from '@/components/flair/editor/FlairEditor.vue';
import FlairUsageStats from '@/components/flair/management/FlairUsageStats.vue';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const flairId = parseInt(route.params.id);

definePageMeta({
  hasAuthRequired: true,
  isAdminRequired: true,
  isLeftNavbarDisabled: true
});

// Fetch flair data
const { data: flairData, error, refresh } = await useGraphQLQuery(`
  query GetSiteFlair($flairId: Int!) {
    siteFlair(id: $flairId) {
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
      usageCount
      creationDate
      updated
    }
    getSiteFlairUsageStats(flairId: $flairId) {
      totalUsage
      thisWeek
      thisMonth
      uniqueUsers
    }
    getSiteFlairUsageChart(flairId: $flairId) {
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

const flair = computed(() => flairData.value?.siteFlair);
const usageStats = computed(() => flairData.value?.getSiteFlairUsageStats || {});
const chartData = computed(() => flairData.value?.getSiteFlairUsageChart || []);

useHead({
  title: computed(() => `Edit ${flair.value?.name} - Admin`)
});

// Fetch posts/users using this flair
const { data: usageData } = await useGraphQLQuery(`
  query GetSiteFlairUsage($flairId: Int!) {
    getSiteFlairPosts(flairId: $flairId, limit: 50) {
      id
      title
      slug
      titleChunk
      postType
      urlPath
      score
      board {
        name
      }
    }
    getSiteFlairUsers(flairId: $flairId, limit: 50) {
      id
      name
      avatar
    }
    getSiteFlairTopPosts(flairId: $flairId, limit: 5) {
      id
      title
      slug
      titleChunk
      postType
      urlPath
      score
      author {
        name
      }
      board {
        name
      }
      creationDate
    }
    getSiteFlairTopUsers(flairId: $flairId, limit: 5) {
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

const currentPosts = computed(() => usageData.value?.getSiteFlairPosts || []);
const currentUsers = computed(() => usageData.value?.getSiteFlairUsers || []);
const topPosts = computed(() => usageData.value?.getSiteFlairTopPosts || []);
const topUsers = computed(() => usageData.value?.getSiteFlairTopUsers || []);

// Helper function to construct post URLs based on postType
const getPostUrl = (post) => {
  // Use urlPath if available
  if (post?.urlPath) return post.urlPath;
  if (!post) return '#';

  const slug = post.slug || post.titleChunk || 'post';
  // Map backend postType to route segment (thread -> threads)
  const typeSegment = post.postType === 'thread' ? 'threads' : 'feed';
  const site = useSiteStore();

  if (site.enableBoards && post.board) {
    return `/b/${post.board.name}/${typeSegment}/${post.id}/${slug}`;
  }

  return `/${typeSegment}/${post.id}/${slug}`;
};

const handleSave = async () => {
  toast.addNotification({
    header: 'Flair updated',
    message: 'The site-wide flair has been updated successfully.',
    type: 'success'
  });
  await refresh();
};

const handleCancel = () => {
  router.push('/admin/flairs');
};

const confirmDelete = async () => {
  const usageCount = flair.value?.usageCount || 0;
  const message = usageCount > 0
    ? `This flair is currently being used by ${usageCount} ${flair.value.flairType === 'post' ? 'post(s)' : 'user(s)'}. Are you sure you want to delete it?`
    : 'Are you sure you want to delete this flair? This action cannot be undone.';

  if (!confirm(message)) return;

  try {
    const mutation = `
      mutation DeleteSiteFlair($flairId: Int!) {
        deleteSiteFlair(flairId: $flairId)
      }
    `;

    const { data: result } = await useGraphQLMutation(mutation, {
      variables: {
        flairId
      }
    });

    if (result.value?.deleteSiteFlair) {
      toast.addNotification({
        header: 'Flair deleted',
        message: 'The site-wide flair has been deleted successfully.',
        type: 'success'
      });
      router.push('/admin/flairs');
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
