<template>
  <div class="flair-subscription-picker">
    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search boards..."
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
    </div>

    <!-- Selection summary -->
    <div v-if="totalSelectedFlairs > 0" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
          {{ totalSelectedFlairs }} flair{{ totalSelectedFlairs !== 1 ? 's' : '' }} selected from {{ selectedBoardCount }} board{{ selectedBoardCount !== 1 ? 's' : '' }}
        </span>
        <button
          @click="clearAll"
          class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
        >
          Clear all
        </button>
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

    <!-- Board list with flairs -->
    <div v-else class="space-y-3 max-h-[500px] overflow-y-auto">
      <div
        v-for="board in filteredBoards"
        :key="board.id"
        class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      >
        <!-- Board header -->
        <button
          @click="toggleBoardExpanded(board.id)"
          class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div v-if="board.icon" class="flex-shrink-0">
              <img :src="board.icon" :alt="board.name" class="w-10 h-10 rounded-full">
            </div>
            <div v-else class="flex-shrink-0 w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />

            <div class="text-left">
              <div class="font-medium text-gray-900 dark:text-gray-100">
                +{{ board.name }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ board.flairs.length }} flair{{ board.flairs.length !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span
              v-if="getBoardSelectedCount(board.id) > 0"
              class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
            >
              {{ getBoardSelectedCount(board.id) }} selected
            </span>

            <svg
              :class="[
                'w-5 h-5 text-gray-500 transition-transform',
                expandedBoards.has(board.id) ? 'rotate-180' : ''
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <!-- Flair grid -->
        <div
          v-show="expandedBoards.has(board.id)"
          class="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700"
        >
          <div v-if="board.flairs.length === 0" class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No flairs available for this board
          </div>

          <div v-else class="space-y-2">
            <!-- Select all -->
            <label class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <input
                type="checkbox"
                :checked="isAllFlairsSelected(board.id)"
                :indeterminate="isSomeFlairsSelected(board.id)"
                @change="toggleAllFlairs(board)"
                class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
              >
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select all
              </span>
            </label>

            <!-- Flair checkboxes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                v-for="flair in board.flairs"
                :key="flair.id"
                class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="flair.id"
                  :checked="isFlairSelected(flair.id)"
                  @change="toggleFlair(board, flair)"
                  class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
                >

                <span
                  class="px-2 py-1 text-xs font-medium rounded"
                  :style="{
                    color: flair.color || '#ffffff',
                    backgroundColor: flair.bgColor || '#6b7280'
                  }"
                >
                  {{ flair.displayName }}
                </span>
              </label>
            </div>
          </div>
        </div>
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
  </div>
</template>

<script setup lang="ts">
import { useDirectGraphQLRequest } from '@/composables/useGraphQL'
import type { Board, Flair } from '~/types/stream'

interface BoardWithFlairs extends Board {
  flairs: Flair[]
}

interface FlairSelection {
  boardId: number
  boardName: string
  flairIds: number[]
  flairs: Flair[]
}

interface Props {
  modelValue: FlairSelection[]
  excludeBoardIds?: number[]
}

interface Emits {
  (e: 'update:modelValue', value: FlairSelection[]): void
}

const props = withDefaults(defineProps<Props>(), {
  excludeBoardIds: () => [],
})

const emit = defineEmits<Emits>()

const boards = ref<BoardWithFlairs[]>([])
const searchQuery = ref('')
const expandedBoards = ref(new Set<number>())
const loading = ref(false)
const error = ref<string | null>(null)

const selections = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const filteredBoards = computed(() => {
  let result = boards.value

  // Exclude boards that are subscribed entirely
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

  return result
})

const totalSelectedFlairs = computed(() => {
  return selections.value.reduce((sum, s) => sum + s.flairIds.length, 0)
})

const selectedBoardCount = computed(() => {
  return selections.value.filter(s => s.flairIds.length > 0).length
})

const getBoardSelectedCount = (boardId: number) => {
  const selection = selections.value.find(s => s.boardId === boardId)
  return selection?.flairIds.length || 0
}

const isFlairSelected = (flairId: number) => {
  return selections.value.some(s => s.flairIds.includes(flairId))
}

const isAllFlairsSelected = (boardId: number) => {
  const board = boards.value.find(b => b.id === boardId)
  if (!board || board.flairs.length === 0) return false

  const selection = selections.value.find(s => s.boardId === boardId)
  return selection?.flairIds.length === board.flairs.length
}

const isSomeFlairsSelected = (boardId: number) => {
  const board = boards.value.find(b => b.id === boardId)
  if (!board || board.flairs.length === 0) return false

  const count = getBoardSelectedCount(boardId)
  return count > 0 && count < board.flairs.length
}

const toggleBoardExpanded = (boardId: number) => {
  if (expandedBoards.value.has(boardId)) {
    expandedBoards.value.delete(boardId)
  } else {
    expandedBoards.value.add(boardId)
  }
}

const toggleFlair = (board: BoardWithFlairs, flair: Flair) => {
  const selectionIndex = selections.value.findIndex(s => s.boardId === board.id)

  if (selectionIndex === -1) {
    // Create new selection for this board
    selections.value = [
      ...selections.value,
      {
        boardId: board.id,
        boardName: board.name,
        flairIds: [flair.id],
        flairs: [flair],
      },
    ]
  } else {
    const selection = selections.value[selectionIndex]
    const flairIndex = selection.flairIds.indexOf(flair.id)

    if (flairIndex === -1) {
      // Add flair
      selection.flairIds.push(flair.id)
      selection.flairs.push(flair)
    } else {
      // Remove flair
      selection.flairIds.splice(flairIndex, 1)
      selection.flairs.splice(flairIndex, 1)
    }

    // Remove empty selections
    if (selection.flairIds.length === 0) {
      selections.value = selections.value.filter((_, i) => i !== selectionIndex)
    } else {
      selections.value = [...selections.value]
    }
  }
}

const toggleAllFlairs = (board: BoardWithFlairs) => {
  const selectionIndex = selections.value.findIndex(s => s.boardId === board.id)

  if (isAllFlairsSelected(board.id)) {
    // Deselect all
    if (selectionIndex !== -1) {
      selections.value = selections.value.filter((_, i) => i !== selectionIndex)
    }
  } else {
    // Select all
    if (selectionIndex === -1) {
      selections.value = [
        ...selections.value,
        {
          boardId: board.id,
          boardName: board.name,
          flairIds: board.flairs.map(f => f.id),
          flairs: [...board.flairs],
        },
      ]
    } else {
      selections.value[selectionIndex] = {
        boardId: board.id,
        boardName: board.name,
        flairIds: board.flairs.map(f => f.id),
        flairs: [...board.flairs],
      }
      selections.value = [...selections.value]
    }
  }
}

const clearAll = () => {
  selections.value = []
}

const fetchBoards = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: gqlError } = await useDirectGraphQLRequest<{ listBoards: BoardWithFlairs[] }>(`
      query GetBoardsWithFlairs {
        listBoards(limit: 100) {
          id
          name
          title
          description
          icon
          flairs {
            id
            flairType
            textDisplay
            backgroundColor
            textColor
          }
        }
      }
    `)

    if (gqlError.value) throw gqlError.value

    if (data.value?.listBoards) {
      boards.value = data.value.listBoards
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
.flair-subscription-picker {
  @apply w-full;
}

/* Indeterminate checkbox styling */
input[type="checkbox"]:indeterminate {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
  border-color: #3b82f6;
  background-color: #3b82f6;
}
</style>
