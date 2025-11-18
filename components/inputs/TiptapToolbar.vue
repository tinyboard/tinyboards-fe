<template>
  <div v-if="editor" class="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
    <!-- Main Toolbar Row -->
    <div class="flex items-center px-3 py-2 gap-1 overflow-x-auto">
      <!-- Group 1: Basic Text Formatting -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex-shrink-0">
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
      </div>

      <!-- Group 2: Colors -->
      <TiptapColorPickers :editor="editor" />

      <!-- Group 3: Lists -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex-shrink-0">
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

      <!-- Group 4: Quote and Link -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex-shrink-0">
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleBlockquote().run()" :class="editor.isActive('blockquote') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Blockquote">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <path d="M6 15h15M21 19h-15M15 11h6M21 7h-6M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
          </svg>
        </button>
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="$emit('link')" title="Insert link">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
          </svg>
        </button>
      </div>

      <!-- Toggle More Tools Button -->
      <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0 ml-1" @click="showMoreTools = !showMoreTools" :title="showMoreTools ? 'Hide advanced tools' : 'Show advanced tools'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </button>
    </div>

    <!-- Second Row: Advanced Tools (Collapsible) -->
    <div v-show="showMoreTools" class="flex items-center px-3 py-2 gap-1 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-600 overflow-x-auto">
      <!-- Group 1: Headings -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex-shrink-0">
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

      <!-- Group 2: Text Alignment -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex-shrink-0">
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

      <!-- Group 3: More Text Tools -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex-shrink-0">
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleStrike().run()" :class="editor.isActive('strike') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Strikethrough">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <line x1="5" y1="12" x2="19" y2="12" /><path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5" />
          </svg>
        </button>
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleTaskList().run()" :class="editor.isActive('taskList') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Checklist">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </button>
      </div>

      <!-- Group 4: Code and Media -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex-shrink-0">
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleCodeBlock().run()" :class="editor.isActive('codeBlock') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Code block">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <path d="m7 8-4 4 4 4M17 8l4 4-4 4M14 4l-4 16"/>
          </svg>
        </button>
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleSpoiler().run()" :class="editor.isActive('spoiler') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Spoiler text">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
            <path d="m6 6 12 12"/>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TiptapColorPickers from './TiptapColorPickers.vue'
import TiptapTableControls from './TiptapTableControls.vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

const showMoreTools = ref(false)

defineEmits(['link', 'upload'])

// Smart indent/outdent functions that work with lists
const handleIndent = () => {
  const { editor } = props

  // Check if we're in a list
  if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
    // In a list - sink the list item (increase nesting)
    editor.chain().focus().sinkListItem('listItem').run()
  } else if (editor.isActive('taskList')) {
    // In a task list - sink the task item
    editor.chain().focus().sinkListItem('taskItem').run()
  } else {
    // Not in a list - just increase paragraph indent
    // We can simulate this with text align for now, or add custom indent extension
    // For now, we'll just convert to a bullet list
    editor.chain().focus().toggleBulletList().run()
  }
}

const handleOutdent = () => {
  const { editor } = props

  // Check if we're in a list
  if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
    // In a list - lift the list item (decrease nesting)
    if (!editor.chain().focus().liftListItem('listItem').run()) {
      // If we can't lift anymore, toggle out of the list
      editor.chain().focus().toggleBulletList().run()
    }
  } else if (editor.isActive('taskList')) {
    // In a task list - lift the task item
    if (!editor.chain().focus().liftListItem('taskItem').run()) {
      // If we can't lift anymore, toggle out of the task list
      editor.chain().focus().toggleTaskList().run()
    }
  }
  // For regular paragraphs, outdent does nothing (or could decrease custom indent)
}
</script>