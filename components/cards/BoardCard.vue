<template>
  <NuxtLink
    :to="`/b/${board.name}`"
    class="group block bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    :style="{ 'border-color': board.primaryColor ? `${board.primaryColor}20` : undefined }"
  >
    <!-- Banner Section -->
    <div
      class="relative h-24 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden"
      :style="{
        'background-image': board.banner ? `url(${board.banner})` : undefined,
        'background-size': 'cover',
        'background-position': 'center',
        'background-color': board.primaryColor || '#3B82F6'
      }"
    >
      <!-- Overlay for better text readability -->
      <div class="absolute inset-0 bg-black bg-opacity-20"></div>

      <!-- Stats overlay -->
      <div class="absolute top-2 right-2 flex flex-wrap gap-1">
        <div class="bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
          {{ formatNumber(board.subscribers || 0) }} members
        </div>
        <div class="bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
          {{ formatNumber(board.postCount || 0) }} posts
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-4">
      <!-- Board Icon and Title -->
      <div class="flex items-start space-x-3 mb-3">
        <div class="flex-shrink-0 mt-[-20px] z-10">
          <img
            v-if="board.icon"
            :src="board.icon"
            :alt="board.name"
            class="w-12 h-12 rounded-lg object-cover border-2 border-white bg-white shadow-sm"
          />
          <div
            v-else
            class="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center shadow-sm"
          >
            <span class="text-lg font-bold text-gray-600">{{ board.name.charAt(0).toUpperCase() }}</span>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {{ board.title || board.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {{ board.name }}
          </p>
        </div>
      </div>

      <!-- Description -->
      <p
        v-if="board.description"
        class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3"
      >
        {{ board.description }}
      </p>
      <p
        v-else
        class="text-sm text-gray-400 dark:text-gray-500 italic mb-3"
      >
        No description available
      </p>

      <!-- Stats Row -->
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
            </svg>
            <span>{{ formatNumber(board.subscribers || 0) }}</span>
          </div>

          <div class="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
              <path d="M16 5l3 3"></path>
            </svg>
            <span>{{ formatNumber(board.postCount || 0) }}</span>
          </div>

          <div v-if="board.commentCount" class="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
            </svg>
            <span>{{ formatNumber(board.commentCount) }}</span>
          </div>
        </div>

        <!-- Activity indicator -->
        <div v-if="board.usersActiveDay" class="flex items-center space-x-1 text-green-600">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>{{ board.usersActiveDay }} online</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  board: {
    type: Object,
    required: true
  }
})

// Format large numbers for display
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>