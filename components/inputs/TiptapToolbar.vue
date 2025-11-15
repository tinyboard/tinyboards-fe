<template>
  <div v-if="editor" class="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
    <!-- Main Toolbar Row -->
    <div class="flex items-center justify-between px-3 py-2">
      <!-- Essential Tools -->
      <div class="flex items-center gap-1">
        <!-- Basic Text Formatting -->
        <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleBold().run()" :class="editor.isActive('bold') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Bold (Ctrl+B)">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6zM13 12h1a3.5 3.5 0 0 1 0 7h-7v-7" />
            </svg>
          </button>
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleItalic().run()" :class="editor.isActive('italic') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Italic (Ctrl+I)">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <line x1="11" y1="5" x2="17" y2="5" /><line x1="7" y1="19" x2="13" y2="19" /><line x1="14" y1="5" x2="10" y2="19" />
            </svg>
          </button>
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleUnderline().run()" :class="editor.isActive('underline') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Underline (Ctrl+U)">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <path d="M7 5v5c0 4.071 3.929 7 7 7s7-2.929 7-7V5M5 19h14" />
            </svg>
          </button>
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleStrike().run()" :class="editor.isActive('strike') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Strikethrough">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <line x1="5" y1="12" x2="19" y2="12" /><path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5" />
            </svg>
          </button>
        </div>

        <!-- Text Color Tools -->
        <TiptapColorPickers :editor="editor" />

        <!-- Headings -->
        <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded text-xs font-bold transition-colors" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="editor.isActive('heading', { level: 1 }) ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Heading 1">
            H1
          </button>
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded text-xs font-bold transition-colors" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="editor.isActive('heading', { level: 2 }) ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Heading 2">
            H2
          </button>
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded text-xs font-bold transition-colors" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="editor.isActive('heading', { level: 3 }) ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Heading 3">
            H3
          </button>
        </div>

        <!-- Lists -->
        <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleBulletList().run()" :class="editor.isActive('bulletList') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Bullet list">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="9" y1="6" x2="20" y2="6" stroke="currentColor" stroke-width="2"></line>
              <line x1="9" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2"></line>
              <line x1="9" y1="18" x2="20" y2="18" stroke="currentColor" stroke-width="2"></line>
              <circle cx="5" cy="6" r="1.5" fill="currentColor"></circle>
              <circle cx="5" cy="12" r="1.5" fill="currentColor"></circle>
              <circle cx="5" cy="18" r="1.5" fill="currentColor"></circle>
            </svg>
          </button>
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleOrderedList().run()" :class="editor.isActive('orderedList') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Numbered list">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <path d="M11 6h9M11 12h9M12 18h8M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4M6 10v-6l-2 2" />
            </svg>
          </button>
        </div>

        <!-- Essential Actions -->
        <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="$emit('link')" title="Insert link">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
            </svg>
          </button>
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="$emit('upload')" title="Upload image/video">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Expand/Collapse Button -->
      <button
        type="button"
        @click="showAdvanced = !showAdvanced"
        class="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        :title="showAdvanced ? 'Hide advanced tools' : 'Show advanced tools'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none" :class="{ 'rotate-180': showAdvanced }">
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      </button>
    </div>

    <!-- Advanced Tools (Collapsible) -->
    <div v-if="showAdvanced" class="px-3 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-600">
      <div class="flex flex-wrap items-center gap-1">
        <!-- Text Alignment -->
        <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().setTextAlign('left').run()" :class="editor.isActive({ textAlign: 'left' }) ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Align left">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="14" y2="12"></line>
              <line x1="4" y1="18" x2="18" y2="18"></line>
            </svg>
          </button>
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().setTextAlign('center').run()" :class="editor.isActive({ textAlign: 'center' }) ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Align center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="6" y1="18" x2="18" y2="18"></line>
            </svg>
          </button>
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().setTextAlign('right').run()" :class="editor.isActive({ textAlign: 'right' }) ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Align right">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="10" y1="12" x2="20" y2="12"></line>
              <line x1="6" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Additional Tools -->
        <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleBlockquote().run()" :class="editor.isActive('blockquote') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Blockquote">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <path d="M6 15h15M21 19h-15M15 11h6M21 7h-6M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
            </svg>
          </button>
          <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleTaskList().run()" :class="editor.isActive('taskList') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Task list">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
              <rect x="3" y="5" width="6" height="6" rx="1"></rect>
              <path d="M5 8l2 2l4-4M13 7h8M13 12h8M13 17h8" />
            </svg>
          </button>
        </div>

        <!-- Table Controls -->
        <TiptapTableControls v-if="editor" :editor="editor" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

const showAdvanced = ref(false)

defineEmits(['link', 'upload'])
</script>