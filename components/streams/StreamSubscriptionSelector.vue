<template>
  <div class="stream-subscription-selector">
    <!-- Mode tabs -->
    <div class="flex border-b border-gray-200 dark:border-gray-700 mb-6">
      <button
        @click="activeMode = 'flair'"
        :class="[
          'flex-1 px-6 py-3 font-medium transition-colors border-b-2',
          activeMode === 'flair'
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        <div class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>By Flair</span>
          <span v-if="totalFlairCount > 0" class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {{ totalFlairCount }}
          </span>
        </div>
      </button>

      <button
        @click="activeMode = 'board'"
        :class="[
          'flex-1 px-6 py-3 font-medium transition-colors border-b-2',
          activeMode === 'board'
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        <div class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>By Board</span>
          <span v-if="selectedBoards.length > 0" class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {{ selectedBoards.length }}
          </span>
        </div>
      </button>
    </div>

    <!-- Summary banner -->
    <div v-if="totalFlairCount > 0 || selectedBoards.length > 0" class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="flex-1">
          <p class="font-medium text-blue-900 dark:text-blue-100 mb-1">
            {{ totalSourceCount }} source{{ totalSourceCount !== 1 ? 's' : '' }} selected
          </p>
          <div class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p v-if="totalFlairCount > 0">
              <span class="font-medium">{{ totalFlairCount }}</span> flair{{ totalFlairCount !== 1 ? 's' : '' }} from
              <span class="font-medium">{{ flairBoardCount }}</span> board{{ flairBoardCount !== 1 ? 's' : '' }}
            </p>
            <p v-if="selectedBoards.length > 0">
              <span class="font-medium">{{ selectedBoards.length }}</span> full board{{ selectedBoards.length !== 1 ? 's' : '' }}
              <span class="text-xs">(all posts)</span>
            </p>
          </div>
        </div>
        <button
          @click="clearAll"
          class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Mode content -->
    <div class="mode-content">
      <!-- Flair mode -->
      <div v-show="activeMode === 'flair'">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Select specific flairs
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Choose individual flairs from boards to create a curated feed
          </p>
        </div>

        <FlairSubscriptionPicker
          v-model="flairSelections"
          :exclude-board-ids="selectedBoards.map(b => b.id)"
        />
      </div>

      <!-- Board mode -->
      <div v-show="activeMode === 'board'">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Select entire boards
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Include all posts from selected boards, regardless of their flair
          </p>
        </div>

        <BoardSubscriptionPicker
          v-model="selectedBoards"
          :exclude-board-ids="flairBoardIds"
        />
      </div>
    </div>

    <!-- Quick switch hint -->
    <div v-if="activeMode === 'flair' && selectedBoards.length > 0" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <button
        @click="activeMode = 'board'"
        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        View {{ selectedBoards.length }} selected board{{ selectedBoards.length !== 1 ? 's' : '' }}
      </button>
    </div>

    <div v-if="activeMode === 'board' && totalFlairCount > 0" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <button
        @click="activeMode = 'flair'"
        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        View {{ totalFlairCount }} selected flair{{ totalFlairCount !== 1 ? 's' : '' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Board } from '~/types/stream'
import FlairSubscriptionPicker from './FlairSubscriptionPicker.vue'
import BoardSubscriptionPicker from './BoardSubscriptionPicker.vue'

interface FlairSelection {
  boardId: number
  boardName: string
  flairIds: number[]
  flairs: any[]
}

interface Props {
  flairSelections: FlairSelection[]
  boardSelections: Board[]
}

interface Emits {
  (e: 'update:flairSelections', value: FlairSelection[]): void
  (e: 'update:boardSelections', value: Board[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const activeMode = ref<'flair' | 'board'>('flair')

const flairSelections = computed({
  get: () => props.flairSelections,
  set: (value) => emit('update:flairSelections', value),
})

const selectedBoards = computed({
  get: () => props.boardSelections,
  set: (value) => emit('update:boardSelections', value),
})

const totalFlairCount = computed(() => {
  return flairSelections.value.reduce((sum, s) => sum + s.flairIds.length, 0)
})

const flairBoardCount = computed(() => {
  return flairSelections.value.filter(s => s.flairIds.length > 0).length
})

const flairBoardIds = computed(() => {
  return flairSelections.value.map(s => s.boardId)
})

const totalSourceCount = computed(() => {
  return totalFlairCount.value + selectedBoards.value.length
})

const clearAll = () => {
  flairSelections.value = []
  selectedBoards.value = []
}
</script>

<style scoped>
.stream-subscription-selector {
  @apply w-full;
}

.mode-content {
  @apply min-h-[400px];
}
</style>
