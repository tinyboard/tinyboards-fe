<template>
  <div v-if="canModerate" class="flex items-center w-full">
    <button
      @click="toggleFilter"
      class="flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-colors w-full"
      :class="hideDeletedContent
        ? 'bg-primary text-white hover:bg-primary-dark'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
      :title="hideDeletedContent ? 'Show deleted/removed content' : 'Hide deleted/removed content'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path v-if="hideDeletedContent" d="M3 3l18 18"></path>
        <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
        <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
      </svg>
      <span>
        {{ hideDeletedContent ? 'Hide' : 'Show' }} Deleted
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAdminContentFilter } from '@/composables/adminFilter';

const { canModerate, hideDeletedContent, toggleFilter } = useAdminContentFilter();
</script>
