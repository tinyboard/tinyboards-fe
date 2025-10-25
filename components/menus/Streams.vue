<template>
  <div class="relative">
    <!-- Streams Button -->
    <button
      @click="isOpen = !isOpen"
      class="relative flex items-center justify-center w-9 h-9 text-xl text-white dark:text-gray-400 rounded hover:bg-white/10 transition-colors"
      :class="{ 'bg-white/10': isOpen }"
      title="My Streams"
      aria-label="My Streams"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="5" cy="19" r="1"></circle>
        <path d="M4 4a16 16 0 0 1 16 16"></path>
        <path d="M4 11a9 9 0 0 1 9 9"></path>
      </svg>
      <!-- Badge for stream count -->
      <span
        v-if="streams && streams.length > 0"
        class="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-secondary rounded-full"
      >
        {{ streams.length > 9 ? '9+' : streams.length }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40"
        @click="isOpen = false"
      ></div>
    </Teleport>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="py-1">
          <!-- Header -->
          <div class="px-4 py-2 border-b dark:border-gray-700">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">My Streams</p>
          </div>

          <!-- Stream List -->
          <div v-if="streams && streams.length > 0" class="max-h-80 overflow-y-auto">
            <NuxtLink
              v-for="stream in streams"
              :key="stream.id"
              :to="`/streams/@${stream.creator?.name || 'unknown'}/${stream.slug}`"
              @click="isOpen = false"
              class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              role="menuitem"
            >
              <span v-if="stream.icon" class="mr-2 text-lg">{{ stream.icon }}</span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="5" cy="19" r="1"></circle>
                <path d="M4 4a16 16 0 0 1 16 16"></path>
                <path d="M4 11a9 9 0 0 1 9 9"></path>
              </svg>
              <span :style="stream.color ? { color: stream.color } : {}" class="truncate">{{ stream.name }}</span>
            </NuxtLink>
          </div>

          <!-- Empty State -->
          <div v-else class="px-4 py-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mx-auto text-gray-400 mb-2" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="5" cy="19" r="1"></circle>
              <path d="M4 4a16 16 0 0 1 16 16"></path>
              <path d="M4 11a9 9 0 0 1 9 9"></path>
            </svg>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">No streams in navbar</p>
            <p class="text-xs text-gray-400 dark:text-gray-500">Create a stream and add it to your navbar</p>
          </div>

          <!-- Footer Actions -->
          <div class="border-t dark:border-gray-700">
            <NuxtLink
              to="/streams"
              @click="isOpen = false"
              class="flex items-center px-4 py-2 text-sm text-primary dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              role="menuitem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
                <path d="M12 12l0 .01" />
                <path d="M3 13a20 20 0 0 0 18 0" />
              </svg>
              Manage Streams
            </NuxtLink>
            <NuxtLink
              to="/streams/create"
              @click="isOpen = false"
              class="flex items-center px-4 py-2 text-sm text-primary dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              role="menuitem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5l0 14" />
                <path d="M5 12l14 0" />
              </svg>
              Create New Stream
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Stream {
  id: number
  name: string
  slug: string
  icon?: string
  color?: string
  creator?: {
    id: number
    name: string
  }
}

interface Props {
  streams?: Stream[]
}

const props = withDefaults(defineProps<Props>(), {
  streams: () => []
})

const isOpen = ref(false)

// Close dropdown when clicking outside or pressing Escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      isOpen.value = false
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
/* Custom scrollbar for stream list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.7);
}
</style>
