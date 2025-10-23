<template>
  <div class="custom-feeds-dropdown relative" ref="dropdownRef">
    <!-- Trigger button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      :class="{ 'bg-gray-100 dark:bg-gray-800': isOpen }"
    >
      <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span class="font-medium text-gray-700 dark:text-gray-300">
        Streams
      </span>
      <svg
        :class="[
          'w-4 h-4 text-gray-500 transition-transform',
          isOpen ? 'rotate-180' : ''
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <Teleport to="body">
      <div
        v-show="isOpen"
        :style="dropdownStyle"
        class="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[280px]"
      >
        <!-- Loading state -->
        <div v-if="loading" class="px-4 py-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Pinned streams -->
          <div v-if="navbarStreams.length > 0">
            <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Pinned Streams
            </div>

            <NuxtLink
              v-for="stream in navbarStreams"
              :key="stream.id"
              :to="`/streams/@${stream.creator.name}/${stream.slug}`"
              @click="isOpen = false"
              class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div
                v-if="stream.icon"
                class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
              >
                <img :src="stream.icon" :alt="stream.name" class="w-full h-full object-cover">
              </div>
              <div
                v-else
                class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                :style="{ backgroundColor: stream.color || '#3B82F6' }"
              >
                {{ stream.name.charAt(0).toUpperCase() }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ stream.name }}
                </div>
                <div v-if="!stream.isPublic" class="text-xs text-gray-500 dark:text-gray-400">
                  Private
                </div>
              </div>

              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>

            <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          </div>

          <!-- Empty state -->
          <div v-if="navbarStreams.length === 0" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p class="text-sm font-medium mb-1">No pinned streams</p>
            <p class="text-xs">Create a stream and pin it to navbar</p>
          </div>

          <!-- Actions -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-2">
            <NuxtLink
              to="/streams"
              @click="isOpen = false"
              class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span class="font-medium">Manage Streams</span>
            </NuxtLink>

            <NuxtLink
              to="/streams/create"
              @click="isOpen = false"
              class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600 dark:text-blue-400"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="font-medium">Create New Stream</span>
            </NuxtLink>

            <NuxtLink
              to="/streams/discover"
              @click="isOpen = false"
              class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="font-medium">Discover Streams</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { navbarStreams, loading, fetchNavbarStreams } = useStream()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref({})

// Calculate dropdown position
const updateDropdownPosition = () => {
  if (!dropdownRef.value) return

  const rect = dropdownRef.value.getBoundingClientRect()
  dropdownStyle.value = {
    top: `${rect.bottom + 8}px`,
    left: `${rect.left}px`,
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (!dropdownRef.value?.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Close dropdown on escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

watch(isOpen, (newValue) => {
  if (newValue) {
    updateDropdownPosition()
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
  } else {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
  }
})

onMounted(() => {
  fetchNavbarStreams()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.custom-feeds-dropdown {
  @apply relative;
}
</style>
