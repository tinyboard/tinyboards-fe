<template>
  <div class="board-subscription-picker">
    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search boards..."
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
    </div>

    <!-- View toggle -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <button
          @click="viewMode = 'list'"
          :class="[
            'p-2 rounded',
            viewMode === 'list'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          ]"
          aria-label="List view"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          @click="viewMode = 'grid'"
          :class="[
            'p-2 rounded',
            viewMode === 'grid'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          ]"
          aria-label="Grid view"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>

      <div class="text-sm text-gray-600 dark:text-gray-400">
        {{ selectedBoards.length }} board{{ selectedBoards.length !== 1 ? 's' : '' }} selected
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button
        @click="fetchBoards"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Retry
      </button>
    </div>

    <!-- Board list/grid -->
    <div v-else>
      <!-- List view -->
      <div v-if="viewMode === 'list'" class="space-y-2 max-h-96 overflow-y-auto">
        <label
          v-for="board in filteredBoards"
          :key="board.id"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
        >
          <input
            type="checkbox"
            :value="board.id"
            :checked="isSelected(board.id)"
            @change="toggleBoard(board)"
            class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
          >

          <div v-if="board.icon" class="flex-shrink-0">
            <img :src="board.icon" :alt="board.name" class="w-8 h-8 rounded-full">
          </div>
          <div v-else class="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />

          <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-900 dark:text-gray-100">
              +{{ board.name }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 truncate">
              {{ board.title }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-500">
              {{ board.subscriberCount.toLocaleString() }} subscriber{{ board.subscriberCount !== 1 ? 's' : '' }}
            </div>
          </div>

          <!-- Warning badge -->
          <div v-if="isSelected(board.id)" class="flex-shrink-0">
            <span class="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
              All posts
            </span>
          </div>
        </label>
      </div>

      <!-- Grid view -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        <label
          v-for="board in filteredBoards"
          :key="board.id"
          :class="[
            'relative p-4 rounded-lg border-2 cursor-pointer transition-all',
            isSelected(board.id)
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
        >
          <input
            type="checkbox"
            :value="board.id"
            :checked="isSelected(board.id)"
            @change="toggleBoard(board)"
            class="absolute top-3 right-3 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
          >

          <div class="flex flex-col items-center text-center">
            <div v-if="board.icon" class="mb-2">
              <img :src="board.icon" :alt="board.name" class="w-12 h-12 rounded-full">
            </div>
            <div v-else class="w-12 h-12 mb-2 bg-gray-300 dark:bg-gray-700 rounded-full" />

            <div class="font-medium text-gray-900 dark:text-gray-100 mb-1">
              +{{ board.name }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
              {{ board.title }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-500">
              {{ formatNumber(board.subscriberCount) }} subs
            </div>

            <!-- Warning badge -->
            <div v-if="isSelected(board.id)" class="mt-2">
              <span class="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                All posts
              </span>
            </div>
          </div>
        </label>
      </div>

      <!-- Empty state -->
      <div v-if="filteredBoards.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="font-medium mb-1">No boards found</p>
        <p class="text-sm">Try adjusting your search query</p>
      </div>
    </div>

    <!-- Warning message -->
    <div v-if="selectedBoards.length > 0" class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div class="flex gap-3">
        <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
            Board subscription mode
          </p>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            Selected boards will include ALL posts, regardless of flair. This may result in a high volume of content in your stream.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDirectGraphQLRequest } from '@/composables/useGraphQL'
import type { Board } from '~/types/stream'

interface Props {
  modelValue: Board[]
  excludeBoardIds?: number[]
}

interface Emits {
  (e: 'update:modelValue', value: Board[]): void
}

const props = withDefaults(defineProps<Props>(), {
  excludeBoardIds: () => [],
})

const emit = defineEmits<Emits>()

const boards = ref<Board[]>([])
const searchQuery = ref('')
const viewMode = ref<'list' | 'grid'>('list')
const loading = ref(false)
const error = ref<string | null>(null)

const selectedBoards = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const filteredBoards = computed(() => {
  let result = boards.value

  // Exclude already selected boards from other sources
  if (props.excludeBoardIds.length > 0) {
    result = result.filter(b => !props.excludeBoardIds.includes(b.id))
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.title.toLowerCase().includes(query)
    )
  }

  // Sort by subscriber count
  return result.sort((a, b) => b.subscriberCount - a.subscriberCount)
})

const isSelected = (boardId: number) => {
  return selectedBoards.value.some(b => b.id === boardId)
}

const toggleBoard = (board: Board) => {
  const index = selectedBoards.value.findIndex(b => b.id === board.id)

  if (index !== -1) {
    selectedBoards.value = selectedBoards.value.filter(b => b.id !== board.id)
  } else {
    selectedBoards.value = [...selectedBoards.value, board]
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const fetchBoards = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: gqlError } = await useDirectGraphQLRequest<{ listBoards: Board[] }>(`
      query GetBoards {
        listBoards(limit: 100) {
          id
          name
          title
          description
          icon
          subscribers
        }
      }
    `)

    if (gqlError.value) throw gqlError.value

    if (data.value?.listBoards) {
      // Map backend field to expected field name
      boards.value = data.value.listBoards.map(b => ({
        ...b,
        subscriberCount: b.subscribers || 0
      }))
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch boards'
    console.error('Error fetching boards:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBoards()
})
</script>

<style scoped>
.board-subscription-picker {
  @apply w-full;
}
</style>
