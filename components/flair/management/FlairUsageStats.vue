<template>
  <div class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Usage Statistics</h3>

    <!-- Summary Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-md border dark:border-blue-800">
        <div class="text-2xl font-bold text-blue-700 dark:text-blue-300">{{ stats.totalUsage || 0 }}</div>
        <div class="text-xs text-blue-600 dark:text-blue-400 uppercase font-medium mt-1">Total Uses</div>
      </div>
      <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-md border dark:border-green-800">
        <div class="text-2xl font-bold text-green-700 dark:text-green-300">{{ stats.thisWeek || 0 }}</div>
        <div class="text-xs text-green-600 dark:text-green-400 uppercase font-medium mt-1">This Week</div>
      </div>
      <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-md border dark:border-purple-800">
        <div class="text-2xl font-bold text-purple-700 dark:text-purple-300">{{ stats.thisMonth || 0 }}</div>
        <div class="text-xs text-purple-600 dark:text-purple-400 uppercase font-medium mt-1">This Month</div>
      </div>
      <div class="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-md border dark:border-orange-800">
        <div class="text-2xl font-bold text-orange-700 dark:text-orange-300">{{ stats.uniqueUsers || 0 }}</div>
        <div class="text-xs text-orange-600 dark:text-orange-400 uppercase font-medium mt-1">Unique Users</div>
      </div>
    </div>

    <!-- Usage Chart (Simple bar visualization) -->
    <div v-if="chartData.length > 0" class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Usage Over Time</h4>
      <div class="space-y-2">
        <div
          v-for="item in chartData"
          :key="item.date"
          class="flex items-center gap-3"
        >
          <div class="w-24 text-xs text-gray-600 dark:text-gray-400">{{ item.label }}</div>
          <div class="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
            <div
              class="h-full bg-primary rounded-md transition-all duration-300"
              :style="{ width: `${(item.count / maxChartValue) * 100}%` }"
            />
          </div>
          <div class="w-12 text-right text-sm font-medium text-gray-700 dark:text-gray-300">{{ item.count }}</div>
        </div>
      </div>
    </div>

    <!-- Top Posts/Users -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Top Posts -->
      <div v-if="flairType === 'post' && topPosts.length > 0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Posts with This Flair</h4>
        <ul class="space-y-2">
          <li
            v-for="post in topPosts"
            :key="post.id"
            class="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <div class="flex-shrink-0 text-lg font-bold text-gray-400 dark:text-gray-600">{{ post.score }}</div>
            <div class="flex-1 min-w-0">
              <NuxtLink
                :to="`/b/${post.board?.name || 'unknown'}/p/${post.id}/${post.titleChunk || 'post'}`"
                class="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block"
              >
                {{ post.title }}
              </NuxtLink>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                by {{ post.author.name }} • {{ formatTimeAgo(post.creationDate) }}
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Top Users -->
      <div v-if="flairType === 'user' && topUsers.length > 0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Users with This Flair</h4>
        <ul class="space-y-2">
          <li
            v-for="user in topUsers"
            :key="user.id"
            class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <img :src="user.avatar" :alt="user.name" class="w-8 h-8 rounded object-cover" />
            <div class="flex-1 min-w-0">
              <NuxtLink
                :to="`/@${user.name}`"
                class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate block"
              >
                {{ user.name }}
              </NuxtLink>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ user.reputation }} reputation
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="stats.totalUsage === 0" class="text-center py-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
        <path d="M12 9h.01" />
        <path d="M11 12h1v4h1" />
      </svg>
      <p class="mt-4 text-gray-600 dark:text-gray-400">This flair hasn't been used yet</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';

const props = defineProps({
  flairType: {
    type: String,
    required: true,
    validator: (value) => ['post', 'user'].includes(value)
  },
  stats: {
    type: Object,
    default: () => ({
      totalUsage: 0,
      thisWeek: 0,
      thisMonth: 0,
      uniqueUsers: 0
    })
  },
  chartData: {
    type: Array,
    default: () => []
  },
  topPosts: {
    type: Array,
    default: () => []
  },
  topUsers: {
    type: Array,
    default: () => []
  }
});

const maxChartValue = computed(() => {
  if (props.chartData.length === 0) return 1;
  return Math.max(...props.chartData.map(item => item.count));
});

const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
</script>
