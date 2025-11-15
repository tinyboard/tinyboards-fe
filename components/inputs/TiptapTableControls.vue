<template>
  <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
    <button type="button" class="w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors" @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()" title="Insert table">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2"></rect>
        <line x1="4" y1="10" x2="20" y2="10"></line>
        <line x1="10" y1="4" x2="10" y2="20"></line>
      </svg>
    </button>
    <template v-if="editor.isActive('table')">
      <span class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5"></span>
      <!-- Add Column -->
      <button type="button" class="w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors" @click="editor.chain().focus().addColumnBefore().run()" title="Add column">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <rect x="4" y="4" width="6" height="16" rx="1"></rect>
          <rect x="14" y="4" width="6" height="16" rx="1"></rect>
          <path d="M12 8v8M8 12h8" stroke-width="2.5"></path>
        </svg>
      </button>
      <!-- Add Row -->
      <button type="button" class="w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors" @click="editor.chain().focus().addRowBefore().run()" title="Add row">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <rect x="4" y="4" width="16" height="6" rx="1"></rect>
          <rect x="4" y="14" width="16" height="6" rx="1"></rect>
          <path d="M12 8v8M8 12h8" stroke-width="2.5"></path>
        </svg>
      </button>
      <span class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5"></span>
      <!-- Delete Column -->
      <button type="button" class="w-8 h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" @click="editor.chain().focus().deleteColumn().run()" title="Delete column">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <rect x="9" y="4" width="6" height="16" rx="1"></rect>
          <path d="M11 9l2 6M13 9l-2 6" stroke-width="2.5"></path>
        </svg>
      </button>
      <!-- Delete Row -->
      <button type="button" class="w-8 h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" @click="editor.chain().focus().deleteRow().run()" title="Delete row">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <rect x="4" y="9" width="16" height="6" rx="1"></rect>
          <path d="M9 11l6 2M9 13l6 -2" stroke-width="2.5"></path>
        </svg>
      </button>
      <span class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5"></span>
      <!-- Delete entire table -->
      <button type="button" class="w-8 h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" @click="editor.chain().focus().deleteTable().run()" title="Delete table">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
          <line x1="5" y1="5" x2="19" y2="19"></line>
          <line x1="19" y1="5" x2="5" y2="19"></line>
        </svg>
      </button>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})
</script>