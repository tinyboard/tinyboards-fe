<template>
  <div class="wiki-editor">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Title
      </label>
      <input
        v-model="localTitle"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        placeholder="Page title"
      />
    </div>

    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Content (Markdown)
        </label>
        <button
          @click="showPreview = !showPreview"
          class="text-sm text-blue-600 hover:underline"
        >
          {{ showPreview ? 'Edit' : 'Preview' }}
        </button>
      </div>

      <textarea
        v-if="!showPreview"
        v-model="localBody"
        rows="20"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm dark:bg-gray-700 dark:text-white"
        placeholder="# Your content here

Use **markdown** for _formatting_..."
      ></textarea>

      <div
        v-else
        v-html="renderedHTML"
        class="prose dark:prose-invert max-w-none border border-gray-300 dark:border-gray-600 rounded-md p-4 min-h-[400px] bg-white dark:bg-gray-800"
      ></div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Edit Summary
      </label>
      <input
        v-model="editSummary"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        placeholder="Describe your changes..."
      />
    </div>

    <div class="flex justify-end gap-3">
      <button
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        Cancel
      </button>
      <button
        @click="save"
        :disabled="!localTitle || !localBody || saving"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ saving ? 'Saving...' : 'Save Page' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

const props = defineProps<{
  title?: string
  body?: string
  pageId?: number
}>()

const emit = defineEmits(['save', 'cancel'])

const localTitle = ref(props.title || '')
const localBody = ref(props.body || '')
const editSummary = ref('')
const showPreview = ref(false)
const saving = ref(false)

const renderedHTML = computed(() => {
  try {
    return marked(localBody.value)
  } catch (error) {
    return '<p class="text-red-600">Error rendering markdown</p>'
  }
})

const save = async () => {
  saving.value = true
  try {
    await emit('save', {
      title: localTitle.value,
      body: localBody.value,
      editSummary: editSummary.value,
    })
  } finally {
    // Reset saving state after a delay to allow navigation to occur
    setTimeout(() => {
      saving.value = false
    }, 2000)
  }
}

// Reset saving state when props change (e.g., after save completes)
watch(() => props.title, () => {
  saving.value = false
})
</script>
