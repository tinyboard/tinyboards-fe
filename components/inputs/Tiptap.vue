<template>
  <div class="w-full h-full flex tiptap-editor-container" :class="!isRichTextMode && showPreview ? 'flex-row gap-2' : 'flex-col'">
    <!-- Main Editor Area -->
    <div class="relative flex-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-950 flex flex-col">

      <!-- Rich Text Mode Toolbar (Top) -->
      <TiptapToolbar
        v-if="isRichTextMode && rteEditor"
        :editor="rteEditor"
        @link="setLink"
        @upload="triggerFileUpload"
      />

      <!-- Editor Content Area with bottom controls -->
      <div class="relative flex-1">
        <!-- Rich Text Editor -->
        <div v-if="isRichTextMode" class="absolute inset-0 overflow-hidden">
          <TiptapRichText
            v-model="content"
            :board-id="boardId"
            :placeholder="placeholder"
            min-height="100%"
            height="100%"
            @editor-ready="handleRteEditorReady"
          />
        </div>

        <!-- Markdown Editor -->
        <div v-else class="absolute inset-0 pb-16">
          <TiptapMarkdown
            v-model="content"
            :board-id="boardId"
            :placeholder="placeholder"
            min-height="100%"
            height="100%"
            :show-preview="false"
          />
        </div>

        <!-- Unified Bottom Right Controls (Always Visible) -->
        <div class="absolute bottom-3 right-3 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 shadow-sm z-[999]">
          <!-- Mode Switch Button -->
          <button
            type="button"
            @click="toggleMode"
            class="p-2.5 sm:p-2 rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto flex items-center justify-center"
            :title="`Switch to ${isRichTextMode ? 'Markdown' : 'Rich Text'} mode`"
          >
            <!-- Rich Text Icon (Clean Aa) -->
            <div v-if="!isRichTextMode" class="w-5 h-5 sm:w-4 sm:h-4 flex items-center justify-center font-sans">
              <span class="text-base sm:text-sm font-bold leading-none">A</span>
              <span class="text-sm sm:text-xs leading-none">a</span>
            </div>
            <!-- Markdown Icon (hash symbol) -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="9" x2="20" y2="9"/>
              <line x1="4" y1="15" x2="20" y2="15"/>
              <line x1="10" y1="3" x2="8" y2="21"/>
              <line x1="16" y1="3" x2="14" y2="21"/>
            </svg>
          </button>

          <!-- Preview Button (Markdown only) -->
          <button
            v-if="!isRichTextMode"
            type="button"
            @click="togglePreview"
            class="p-2.5 sm:p-2 rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto flex items-center justify-center"
            :class="{ 'bg-primary/20 text-primary': showPreview }"
            title="Toggle Preview"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>

          <!-- Format Guide Button -->
          <button
            type="button"
            @click="showFormattingGuide = !showFormattingGuide"
            class="p-2.5 sm:p-2 rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto flex items-center justify-center"
            :class="{ 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300': showFormattingGuide }"
            title="Formatting Guide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <path d="M8 7h8"/>
              <path d="M8 11h8"/>
              <path d="M8 15h5"/>
            </svg>
          </button>

          <!-- Emoji Picker -->
          <EmojiPicker @emoji-selected="insertEmoji" />
        </div>
      </div>
    </div>

    <!-- Markdown Preview Sidebar (only for markdown mode) -->
    <div
      v-if="!isRichTextMode && showPreview"
      class="flex-1 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto"
    >
      <div class="p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Preview</h3>
        <div
          v-html="markdownPreviewHtml"
          class="prose dark:prose-invert max-w-none"
        />
      </div>
    </div>

    <!-- Formatting Guide Popover -->
    <Transition name="fade">
      <div
        v-if="showFormattingGuide"
        class="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 p-4"
      >
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Formatting Guide</h3>
        <div class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div v-if="isRichTextMode">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Rich Text Mode</p>
            <ul class="space-y-1">
              <li><kbd>Ctrl/Cmd + B</kbd> - Bold</li>
              <li><kbd>Ctrl/Cmd + I</kbd> - Italic</li>
              <li><kbd>Ctrl/Cmd + U</kbd> - Underline</li>
              <li><kbd>Ctrl/Cmd + K</kbd> - Insert Link</li>
              <li><kbd>:</kbd> - Emoji suggestions</li>
              <li><kbd>@</kbd> - Mention user</li>
              <li><kbd>b/</kbd> - Mention board</li>
            </ul>
          </div>
          <div v-else>
            <p class="font-medium text-gray-900 dark:text-white mb-2">Markdown Syntax</p>
            <ul class="space-y-1">
              <li><code>**bold**</code> or <code>__bold__</code></li>
              <li><code>*italic*</code> or <code>_italic_</code></li>
              <li><code>[link](url)</code></li>
              <li><code># Heading</code></li>
              <li><code>- List item</code></li>
              <li><code>&gt; Quote</code></li>
              <li><code>:emoji:</code> - Emoji shortcode</li>
              <li><code>@username</code> - Mention user</li>
              <li><code>b/boardname</code> - Mention board</li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Hidden file input for image uploads -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileChange"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import { useContentConverter } from '@/composables/useContentConverter'
import TiptapRichText from './TiptapRichText.vue'
import TiptapMarkdown from './TiptapMarkdown.vue'
import TiptapToolbar from './TiptapToolbar.vue'
import EmojiPicker from './EmojiPicker.vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  modelValue: string
  boardId?: number
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const { htmlToMarkdown, markdownToHtml } = useContentConverter()

// Editor state
const isRichTextMode = ref(false) // Default to markdown mode
const showPreview = ref(false)
const showFormattingGuide = ref(false)
const content = ref(props.modelValue)
const rteEditor = ref<Editor | null>(null)
const fileInput = ref<HTMLInputElement>()
const markdownPreviewHtml = ref('')

// Markdown preview - watch for changes and update
watch([content, showPreview], async ([newContent, preview]) => {
  if (!preview || !newContent) {
    markdownPreviewHtml.value = ''
    return
  }
  try {
    markdownPreviewHtml.value = await markdownToHtml(newContent)
  } catch (error) {
    console.error('Markdown parsing error:', error)
    markdownPreviewHtml.value = newContent
  }
}, { immediate: true })

// Handle RTE editor ready
const handleRteEditorReady = (editor: Editor) => {
  rteEditor.value = editor
}

// Mode switching
const toggleMode = async () => {
  if (isRichTextMode.value) {
    // Switching from RTE to Markdown
    // Convert HTML to Markdown
    content.value = htmlToMarkdown(content.value)
  } else {
    // Switching from Markdown to RTE
    // Convert Markdown to HTML
    content.value = await markdownToHtml(content.value)
  }

  isRichTextMode.value = !isRichTextMode.value
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// Emoji insertion
const insertEmoji = (emoji: string) => {
  if (isRichTextMode.value && rteEditor.value) {
    // Insert into RTE
    rteEditor.value.commands.insertContent(emoji)
  } else {
    // Insert into markdown
    content.value += emoji
  }
}

// Link insertion
const setLink = () => {
  if (!rteEditor.value) return

  const url = window.prompt('Enter URL:')
  if (url) {
    rteEditor.value.chain().focus().setLink({ href: url }).run()
  }
}

// Image upload
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file || !rteEditor.value) return

  // Here you would implement image upload logic
  // For now, just insert a placeholder
  const reader = new FileReader()
  reader.onload = (e) => {
    const url = e.target?.result as string
    rteEditor.value?.commands.setImage({ src: url })
  }
  reader.readAsDataURL(file)

  // Reset input
  target.value = ''
}

// Watch for content changes
watch(content, (newValue) => {
  emit('update:modelValue', newValue)
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

kbd {
  @apply px-1.5 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded;
}

code {
  @apply px-1 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded;
}
</style>
