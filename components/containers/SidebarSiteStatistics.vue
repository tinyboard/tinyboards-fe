<template>
  <div class="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-md overflow-hidden">
    <!-- Header -->
    <div class="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
      <h3 class="font-bold text-sm flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
          <path d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
          <path d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
          <path d="M4 20l14 0" />
        </svg>
        Site Statistics
      </h3>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="p-4 text-center text-gray-400 text-sm">
      Loading...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-4 text-center text-red-500 text-sm">
      Failed to load statistics
    </div>

    <!-- Statistics -->
    <div v-else-if="stats" class="p-3 space-y-2 text-sm">
      <!-- Threads -->
      <div class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">Threads:</span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ formatNumber(stats.posts) }}
        </span>
      </div>

      <!-- Messages (Comments) -->
      <div class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">Messages:</span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ formatNumber(stats.comments) }}
        </span>
      </div>

      <!-- Members -->
      <div class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">Members:</span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ formatNumber(stats.users) }}
        </span>
      </div>

      <!-- Latest Member -->
      <div v-if="latestMember" class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">Latest member:</span>
        <NuxtLink
          :to="`/@${latestMember.name}`"
          class="text-primary hover:underline font-semibold"
        >
          {{ latestMember.name }}
        </NuxtLink>
      </div>

      <!-- Boards (if enabled) -->
      <div v-if="site.enableBoards" class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">Boards:</span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ formatNumber(stats.boards) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGraphQLQuery } from '@/composables/useGraphQL';
import { useSiteStore } from '@/stores/StoreSite';

const site = useSiteStore();

// Query for site statistics
const statsQuery = `
  query GetSiteStats {
    siteStats {
      users
      posts
      comments
      boards
      usersActiveDay
      usersActiveWeek
      usersActiveMonth
    }
  }
`;

// Query for latest member
const latestMemberQuery = `
  query GetLatestMember($limit: Int!, $sort: String!) {
    listUsers(limit: $limit, sort: $sort) {
      id
      name
      displayName
    }
  }
`;

const { data: statsData, error: statsError, pending: statsPending } = await useGraphQLQuery(statsQuery);
const { data: memberData, error: memberError, pending: memberPending } = await useGraphQLQuery(latestMemberQuery, {
  variables: {
    limit: 1,
    sort: 'new'
  }
});

const error = computed(() => statsError.value || memberError.value);
const pending = computed(() => statsPending.value || memberPending.value);

const stats = computed(() => {
  return statsData.value?.siteStats || null;
});

const latestMember = computed(() => {
  const members = memberData.value?.listUsers || [];
  return members.length > 0 ? members[0] : null;
});

// Format large numbers with commas
const formatNumber = (num: number): string => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
};
</script>
