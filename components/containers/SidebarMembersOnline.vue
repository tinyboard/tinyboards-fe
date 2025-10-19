<template>
  <div class="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-md overflow-hidden">
    <!-- Header -->
    <div class="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
      <h3 class="font-bold text-sm flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
        Members online
      </h3>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="p-4 text-center text-gray-400 text-sm">
      Loading...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-4 text-center text-red-500 text-sm">
      Failed to load online members
    </div>

    <!-- Members list -->
    <div v-else-if="activeUsers && activeUsers.length > 0" class="p-3">
      <div class="flex flex-wrap gap-1.5">
        <NuxtLink
          v-for="user in displayedUsers"
          :key="user.id"
          :to="`/@${user.name}`"
          class="text-primary hover:underline text-sm"
        >
          {{ user.name }}<!--
        --><template v-if="displayedUsers.indexOf(user) < displayedUsers.length - 1">,</template>
        </NuxtLink>
      </div>

      <!-- "and X more" link -->
      <div v-if="remainingCount > 0" class="mt-2 text-xs text-gray-500">
        ... and <NuxtLink to="/members" class="text-primary hover:underline font-medium">{{ remainingCount }} more</NuxtLink>.
      </div>

      <!-- Total count footer -->
      <div class="mt-3 pt-3 border-t dark:border-gray-800 text-xs text-gray-500">
        Total: <strong class="text-gray-700 dark:text-gray-300">{{ totalCount }}</strong>
        (members: <strong class="text-gray-700 dark:text-gray-300">{{ memberCount }}</strong>,
        guests: <strong class="text-gray-700 dark:text-gray-300">{{ guestCount }}</strong>)
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="p-4 text-center text-gray-400 text-sm">
      No members online
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGraphQLQuery } from '@/composables/useGraphQL';

const props = defineProps<{
  displayLimit?: number;
}>();

const displayLimit = props.displayLimit || 50;

// Query for online users (users active in last 10 minutes)
const usersQuery = `
  query ListOnlineUsers($minutes: Int, $limit: Int) {
    listOnlineUsers(minutes: $minutes, limit: $limit) {
      id
      name
      displayName
      avatar
      lastSeen
    }
  }
`;

const { data: usersData, error, pending } = await useGraphQLQuery(usersQuery, {
  variables: {
    minutes: 10, // Users active in last 10 minutes
    limit: 100   // Fetch more than we'll display
  }
});

// Get online users from the query
const activeUsers = computed(() => {
  return usersData.value?.listOnlineUsers || [];
});

// Show only the first N users
const displayedUsers = computed(() => {
  return activeUsers.value.slice(0, displayLimit);
});

// Calculate remaining count
const remainingCount = computed(() => {
  return Math.max(0, activeUsers.value.length - displayLimit);
});

// Get total counts (actual online users)
const memberCount = computed(() => {
  return activeUsers.value.length;
});

// For demo purposes, we'll estimate guests (in production, this would come from actual session tracking)
const guestCount = computed(() => {
  // This is a placeholder - in production you'd track this server-side
  return Math.floor(memberCount.value * 0.3); // Estimate 30% guests
});

const totalCount = computed(() => {
  return memberCount.value + guestCount.value;
});
</script>
