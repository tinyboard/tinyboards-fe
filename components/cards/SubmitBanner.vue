<template>
  <div
    class="bg-white dark:bg-gray-950 border dark:border-gray-800 shadow-inner-xs sm:border sm:rounded-md overflow-hidden"
  >
    <!-- Banner Background -->
    <div
      class="relative h-32 sm:h-40 bg-gradient-to-r from-blue-500 to-purple-600"
      :style="{
        'background-image': board?.banner ? `url(${board.banner})` : undefined,
        'background-size': 'cover',
        'background-position': 'center',
        'background-color': board?.primaryColor || '#3B82F6'
      }"
    >
      <!-- Overlay for better text readability -->
      <div class="absolute inset-0 bg-black bg-opacity-30"></div>

      <!-- Content overlay -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-white">
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">
            {{ title || 'Create new post' }}
          </h1>
          <p v-if="subTitle" class="text-sm sm:text-base opacity-90">
            {{ subTitle }}
          </p>
        </div>
      </div>

      <!-- Board info in bottom left -->
      <div v-if="board" class="absolute bottom-4 left-4 flex items-center space-x-3">
        <img
          v-if="board.icon"
          :src="board.icon"
          :alt="board.name"
          class="w-10 h-10 rounded-lg object-cover border-2 border-white bg-white shadow-sm"
        />
        <div
          v-else
          class="w-10 h-10 rounded-lg border-2 border-white bg-white flex items-center justify-center shadow-sm"
        >
          <span class="text-sm font-bold text-gray-600">{{ board.name.charAt(0).toUpperCase() }}</span>
        </div>

        <div class="text-white">
          <h3 class="font-semibold text-sm">
            {{ board.title || board.name }}
          </h3>
          <p class="text-xs opacity-75">
            {{ board.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  board: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: 'Create new post'
  },
  subTitle: {
    type: String,
    default: 'Share a link, image or text with the community.'
  }
})
</script>