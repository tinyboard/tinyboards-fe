<template>
  <div class="w-full h-full flex tiptap-editor-container" :class="!isRichTextMode && showPreview ? 'flex-row gap-2' : 'flex-col'">
    <!-- Main Editor Area -->
    <div class="relative flex-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-950 flex flex-col">

      <!-- Rich Text Mode Toolbar (Top) -->
      <TiptapToolbar
        v-if="editor && isRichTextMode"
        :editor="editor"
        @link="setLink"
        @upload="triggerFileUpload"
      />

      <!-- Editor Content Area with bottom controls -->
      <div class="relative" :class="isRichTextMode ? 'h-80' : 'flex-1 min-h-[300px]'">
        <!-- Rich Text Editor -->
        <div v-if="isRichTextMode && editor" class="absolute inset-0 overflow-hidden">
          <editor-content
            :editor="editor"
            class="h-full w-full prose prose-sm dark:prose-invert max-w-none p-4 pb-16 focus:outline-none overflow-y-auto bg-transparent tiptap-editor"
          />
        </div>

        <!-- Markdown Editor -->
        <div v-else class="absolute inset-0">
          <textarea
            ref="markdownTextarea"
            v-model="markdownContent"
            @input="updateMarkdown"
            @keydown="handleMarkdownKeydown"
            :placeholder="placeholder"
            class="w-full h-full p-4 pb-16 bg-transparent border-none focus:outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm"
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
      style="min-height: 300px;"
    >
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 class="text-sm font-medium text-gray-900 dark:text-white">Preview</h3>
      </div>
      <div class="p-4">
        <div v-if="markdownContent" class="prose dark:prose-invert prose-sm max-w-none" v-html="processedPreviewHTML"></div>
        <div v-else class="text-gray-400 italic text-sm">Nothing to preview yet...</div>
      </div>
    </div>

    <!-- Format Guide Modal -->
    <Teleport to="body">
      <div
        v-if="showFormattingGuide"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[300]"
        @click.self="showFormattingGuide = false"
      >
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Formatting Guide</h3>
              <button
                type="button"
                @click="showFormattingGuide = false"
                class="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Close"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div v-if="isRichTextMode" class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Rich Text Editor</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Use the toolbar buttons above to format your text. You can also use keyboard shortcuts:</p>
                <ul class="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+B</kbd> - Bold</li>
                  <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+I</kbd> - Italic</li>
                  <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+U</kbd> - Underline</li>
                  <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+Shift+X</kbd> - Strikethrough</li>
                </ul>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Markdown Syntax</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Formatting</p>
                    <ul class="space-y-1 text-gray-600 dark:text-gray-400">
                      <li><code>**bold**</code> → <strong>bold</strong></li>
                      <li><code>*italic*</code> → <em>italic</em></li>
                      <li><code>~~strikethrough~~</code> → <del>strikethrough</del></li>
                      <li><code>`code`</code> → <code>code</code></li>
                    </ul>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Structure</p>
                    <ul class="space-y-1 text-gray-600 dark:text-gray-400">
                      <li><code># Heading 1</code></li>
                      <li><code>## Heading 2</code></li>
                      <li><code>- List item</code></li>
                      <li><code>1. Numbered item</code></li>
                      <li><code>> Quote</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Upload progress indicator -->
    <div v-if="uploading" class="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow-lg border border-gray-200 dark:border-gray-700 z-20">
      <p class="text-sm text-gray-600 dark:text-gray-400">Uploading {{ uploadProgress }}/{{ uploadTotal }} images...</p>
    </div>

    <!-- Unified Mention autocomplete dropdown -->
    <UnifiedMentionDropdown
      :user-suggestions="suggestions"
      :board-suggestions="boardSuggestions"
      :is-user-loading="mentionLoading"
      :is-board-loading="boardLoading"
      :is-visible="unifiedMentionVisible"
      :position="mentionVisible ? mentionPosition : boardPosition"
      :selected-index="mentionVisible ? mentionSelectedIndex : boardSelectedIndex"
      :current-type="currentMentionType"
      @select-user="insertUserMention"
      @select-board="insertBoardMention"
      @update-selection="updateMentionSelection"
    />

    <!-- Emoji suggestions dropdown -->
    <EmojiSuggestions
      :suggestions="emojiSuggestions"
      :selected-index="emojiSelectedIndex"
      :is-visible="emojiVisible"
      :position="emojiPositionData"
      @select="insertEmojiSuggestion"
    />

    <!-- Drag and drop overlay -->
    <div v-if="isDragging" class="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded flex items-center justify-center z-20 pointer-events-none">
      <p class="text-primary font-semibold">Drop images here</p>
    </div>
  </div>

  <!-- Link Modal -->
  <Teleport to="body">
    <div
      v-if="showLinkModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="cancelLink"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Link</h3>
            <button
              type="button"
              @click="cancelLink"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <!-- URL Input -->
            <div>
              <label for="link-url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
              </label>
              <input
                id="link-url"
                v-model="linkUrl"
                type="url"
                placeholder="https://example.com"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                @keydown.enter="insertLink"
                @keydown.esc="cancelLink"
              />
            </div>

            <!-- Display Text Input -->
            <div>
              <label for="link-text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Text
              </label>
              <input
                id="link-text"
                v-model="linkText"
                type="text"
                placeholder="Click here"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                @keydown.enter="insertLink"
                @keydown.esc="cancelLink"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2 mt-6">
            <button
              type="button"
              @click="cancelLink"
              class="button secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="insertLink"
              class="button primary px-4 py-2"
              :disabled="!linkUrl"
            >
              Insert Link
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Keyboard Shortcuts Help Modal -->
  <Teleport to="body">
    <div
      v-if="showShortcutsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="toggleShortcutsModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
            <button
              type="button"
              @click="toggleShortcutsModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <!-- Rich Text Shortcuts -->
            <div v-if="isRichTextMode">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Rich Text Editor</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white mb-2">Text Formatting</p>
                  <ul class="space-y-1 text-gray-600 dark:text-gray-400">
                    <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+B</kbd> Bold</li>
                    <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+I</kbd> Italic</li>
                    <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+U</kbd> Underline</li>
                    <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+Shift+X</kbd> Strikethrough</li>
                  </ul>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white mb-2">Structure</p>
                  <ul class="space-y-1 text-gray-600 dark:text-gray-400">
                    <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+Shift+1</kbd> Heading 1</li>
                    <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+Shift+2</kbd> Heading 2</li>
                    <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+Shift+3</kbd> Heading 3</li>
                    <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+Shift+B</kbd> Blockquote</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Markdown Shortcuts -->
            <div v-else>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Markdown Editor</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white mb-2">Formatting Syntax</p>
                  <ul class="space-y-1 text-gray-600 dark:text-gray-400">
                    <li><code>**text**</code> Bold</li>
                    <li><code>*text*</code> Italic</li>
                    <li><code>~~text~~</code> Strikethrough</li>
                    <li><code>`code`</code> Inline code</li>
                  </ul>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white mb-2">Structure Syntax</p>
                  <ul class="space-y-1 text-gray-600 dark:text-gray-400">
                    <li><code># Heading</code> H1</li>
                    <li><code>## Heading</code> H2</li>
                    <li><code>- Item</code> List</li>
                    <li><code>> Quote</code> Blockquote</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Universal Shortcuts -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Universal</h4>
              <div class="text-sm">
                <ul class="space-y-1 text-gray-600 dark:text-gray-400">
                  <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">@</kbd> Mention users/boards</li>
                  <li><kbd class="bg-gray-100 dark:bg-gray-700 px-1 rounded">:</kbd> Insert emoji</li>
                </ul>
              </div>
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-400">
              <strong>Note:</strong> On Mac, use <kbd class="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Cmd</kbd> instead of <kbd class="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl</kbd>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>      const query = `
<script setup>
  import { ref, watch, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
  import { Link } from '@tiptap/extension-link';
  import { Image } from '@tiptap/extension-image';
  import { TextAlign } from '@tiptap/extension-text-align';
  import { TextStyle } from '@tiptap/extension-text-style';
  import { Color } from '@tiptap/extension-color';
  import { Highlight } from '@tiptap/extension-highlight';
  import { Table } from '@tiptap/extension-table';
  import { TableRow } from '@tiptap/extension-table-row';
  import { TableCell } from '@tiptap/extension-table-cell';
  import { TableHeader } from '@tiptap/extension-table-header';
  import { TaskList } from '@tiptap/extension-task-list';
  import { TaskItem } from '@tiptap/extension-task-item';
  import { Underline } from '@tiptap/extension-underline';
  import { Superscript } from '@tiptap/extension-superscript';
  import { Subscript } from '@tiptap/extension-subscript';
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import { Extension } from '@tiptap/core';
  import { Plugin, PluginKey } from '@tiptap/pm/state';
  import TiptapToolbar from './TiptapToolbar.vue';
  import EmojiPicker from './EmojiPicker.vue';
  import UnifiedMentionDropdown from './UnifiedMentionDropdown.vue';
  import EmojiSuggestions from './EmojiSuggestions.vue';
  // import MarkdownEditor from './MarkdownEditor.vue'; // Removed - now unified
  import { useMentionAutocomplete } from '@/composables/useMentionAutocomplete';
  import { useBoardMentions } from '@/composables/useBoardMentions';
  import { useEmojiSuggestions } from '@/composables/useEmojiSuggestions';
  import { useToastStore } from '@/stores/StoreToast';
  import { useLoggedInUser } from '@/stores/StoreAuth';
  import { useGraphQLQuery } from '@/composables/useGraphQL';

  // Custom Spoiler Extension
  const Spoiler = Extension.create({
    name: 'spoiler',

    addOptions() {
      return {
        HTMLAttributes: {
          class: 'spoiler'
        }
      }
    },

    parseHTML() {
      return [
        {
          tag: 'span[data-spoiler]',
        },
        {
          tag: 'span.spoiler',
        }
      ]
    },

    renderHTML({ HTMLAttributes }) {
      return ['span', {
        'data-spoiler': 'true',
        class: 'spoiler cursor-pointer px-1 py-0.5 bg-gray-800 dark:bg-gray-600 text-gray-800 dark:text-gray-600 hover:text-white dark:hover:text-white transition-colors duration-200 rounded',
        title: 'Click to reveal spoiler',
        ...HTMLAttributes
      }, 0]
    },

    addCommands() {
      return {
        toggleSpoiler: () => ({ commands }) => {
          return commands.toggleMark(this.name)
        }
      }
    },

    addKeyboardShortcuts() {
      return {
        'Mod-Shift-s': () => this.editor.commands.toggleSpoiler(),
      }
    }
  })

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Type something interesting here...'
    },
    minHeight: {
      type: String,
      default: "56px"
    },
    height: {
      type: String,
      default: "400px"
    },
    menubarBottom: {
      type: Boolean,
      default: false
    },
    boardId: {
      type: Number,
      default: null
    }
  });

  const emit = defineEmits(['update:modelValue']);

  // Toast notifications
  const toastStore = useToastStore();

  // Preview toggle state
  const showPreview = ref(false);
  const showFormattingGuide = ref(false);

  // Toolbar expansion state (for rich text mode)
  const toolbarExpanded = ref(false);



  // Rich text mode toggle (false = markdown mode, true = full rich text)
  // Initialize based on user's editor_mode preference
  // Use client-side only check to prevent hydration mismatches
  const authStore = useLoggedInUser();
  const defaultMode = (process.client && authStore.user?.editorMode) ? authStore.user.editorMode : 'markdown';
  const isRichTextMode = ref(defaultMode === 'rich_text');

  // Markdown content (for markdown mode)
  // If we start in markdown mode but have HTML content, convert to text
  const initialContent = props.modelValue || '';
  const markdownContent = ref(
    !isRichTextMode.value && initialContent.includes('<')
      ? '' // Start with empty content if HTML detected in markdown mode
      : initialContent
  );

  // Watch markdown content changes
  watch(markdownContent, (newValue) => {
    if (!isRichTextMode.value) {
      emit('update:modelValue', newValue);
    }
  });

  // Watch for external modelValue changes
  watch(() => props.modelValue, (newValue) => {
    if (!isRichTextMode.value && newValue !== markdownContent.value) {
      markdownContent.value = newValue;
    }
  });

  // Convert HTML to Markdown
  const convertHtmlToMarkdown = (html) => {
    // Basic HTML to Markdown conversion
    // This is a simplified converter - for production, consider using a library like turndown
    return html
      // Remove wrapping <p> tags but preserve line breaks
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, '\n\n')
      // Convert headings
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
      // Convert bold and italic
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      // Convert links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      // Convert code
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
      .replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n\n')
      // Convert blockquotes
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
        return content.split('\n').map((line) => `> ${line.trim()}`).join('\n') + '\n\n';
      })
      // Convert lists
      .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n') + '\n';
      })
      .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/gis, () => `${counter++}. $1\n`) + '\n';
      })
      // Convert line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Convert emoji images to shortcodes
      .replace(/<img[^>]*(?=.*class="emoji")(?=.*data-shortcode="([^"]*)").*?\/?>/gi, ':$1:')
      // Clean up HTML entities
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      // Remove any remaining HTML tags
      .replace(/<[^>]*>/gi, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '');
  };

  // Convert shortcodes in markdown to emoji HTML
  const convertShortcodesToEmojis = async (markdownText) => {
    // Make sure emoji cache is loaded
    await loadEmojiCache();

    // Find all shortcodes in the format :shortcode:
    return markdownText.replace(/:([a-zA-Z0-9_+-]+):/g, (match, shortcode) => {
      const emoji = getEmojiByShortcode(shortcode);
      if (emoji) {
        return `<img src="${emoji.imageUrl}" alt="${emoji.altTextDisplay}" class="emoji" data-shortcode="${emoji.shortcode}" />`;
      }
      // Return original text if emoji not found
      return match;
    });
  };

  // Watch for mode changes and sync content
  watch(isRichTextMode, async (newMode, oldMode) => {
    if (newMode) {
      // Switching to Rich Text mode
      // Parse markdown content and set as HTML in the editor
      if (editor.value && markdownContent.value) {
        try {
          // First convert shortcodes to emojis, then parse markdown
          const contentWithEmojis = await convertShortcodesToEmojis(markdownContent.value);

          // Import marked for markdown parsing
          import('marked').then(({ marked }) => {
            const htmlContent = marked.parse(contentWithEmojis);
            editor.value?.commands.setContent(htmlContent, false);
          });
        } catch (error) {
          console.error('Error parsing markdown:', error);
          // Fallback: set as plain text
          editor.value.commands.setContent(markdownContent.value, false);
        }
      }
    } else {
      // Switching to Markdown mode
      // Convert HTML content back to markdown format
      if (editor.value) {
        const htmlContent = editor.value.getHTML();
        markdownContent.value = convertHtmlToMarkdown(htmlContent);
      }
    }
  });

  // Track editor empty state for placeholder
  const isEditorEmpty = ref(true);

  // Link modal state
  const showLinkModal = ref(false);
  const linkUrl = ref('');
  const linkText = ref('');
  const linkUrlInput = ref(null);

  // Mention autocomplete state
  const {
    suggestions,
    isLoading: mentionLoading,
    selectedIndex: mentionSelectedIndex,
    query: mentionQuery,
    isVisible: mentionVisible,
    debouncedSearch,
    selectNext: selectNextMention,
    selectPrevious: selectPreviousMention,
    getSelectedUsername,
    reset: resetMention
  } = useMentionAutocomplete();

  const mentionPosition = ref({ top: 0, left: 0 });
  const mentionStartPos = ref(null);

  // Board mention autocomplete
  const {
    suggestions: boardSuggestions,
    selectedIndex: boardSelectedIndex,
    isVisible: boardVisible,
    isLoading: boardLoading,
    debouncedSearch: boardDebouncedSearch,
    selectNext: boardSelectNext,
    selectPrevious: boardSelectPrevious,
    getSelectedBoard: boardGetSelectedBoard,
    reset: boardReset
  } = useBoardMentions();

  const boardPosition = ref({ top: 0, left: 0 });
  const boardStartPos = ref(null);

  // Unified mention state for TipTap
  const currentMentionType = ref('user');
  const unifiedMentionVisible = computed(() => mentionVisible.value || boardVisible.value);

  // Emoji suggestions state
  const {
    suggestions: emojiSuggestions,
    isVisible: emojiVisible,
    selectedIndex: emojiSelectedIndex,
    showSuggestions: showEmojiSuggestions,
    hideSuggestions: hideEmojiSuggestions,
    selectSuggestion: selectEmojiSuggestion,
    navigateUp: navigateEmojiUp,
    navigateDown: navigateEmojiDown,
    position: emojiPositionData,
    loadEmojis: loadEmojiCache,
    getEmojiByShortcode
  } = useEmojiSuggestions(props.boardId);

  const emojiStartPos = ref(null);

  // Watch for emoji suggestions changes (for reactivity)
  watch([emojiSuggestions, emojiVisible], ([suggestions, visible]) => {
    // Reactively update when emoji state changes
  });

  // Cache for emoji data
  const emojiCache = ref(new Map());

  // Load emojis into cache
  const loadEmojisForPreview = async () => {
    try {
      const query = `
        query ListEmojis($input: ListEmojisInput) {
          listEmojis(input: $input) {
            id
            shortcode
            imageUrl
            altTextDisplay
          }
        }
      `;

      const variables = {
        input: {
          boardId: props.boardId,
          scope: props.boardId ? "BOARD" : "SITE",
          activeOnly: true,
          limit: 200,
          offset: 0
        }
      };

      const { data, error } = await useGraphQLQuery(query, { variables });

      if (!error.value && data.value?.listEmojis) {
        const newCache = new Map();
        data.value.listEmojis.forEach(emoji => {
          newCache.set(emoji.shortcode, emoji);
        });
        emojiCache.value = newCache;
      }
    } catch (error) {
      console.error('Failed to load emojis for preview:', error);
    }
  };

  // Process preview HTML to render custom emojis
  // Reactive reference for processed markdown HTML
  const processedMarkdownHTML = ref('');

  // Process markdown content to HTML
  const processMarkdownContent = async () => {
    if (!markdownContent.value) {
      processedMarkdownHTML.value = '';
      return;
    }

    try {
      // Import marked for markdown parsing
      const { marked } = await import('marked');

      // First convert shortcodes to emojis
      let content = markdownContent.value;
      const emojiRegex = /:([a-zA-Z0-9_-]+):/g;
      content = content.replace(emojiRegex, (match, shortcode) => {
        const emoji = emojiCache.value.get(shortcode);
        if (emoji) {
          return `<img class="emoji" src="${emoji.imageUrl}" alt=":${shortcode}:" title=":${shortcode}:" style="width: 1.5em; height: 1.5em; vertical-align: middle; display: inline-block;" />`;
        }
        return match;
      });

      // Then parse markdown to HTML
      processedMarkdownHTML.value = marked.parse(content);
    } catch (error) {
      console.error('Error processing markdown preview:', error);
      processedMarkdownHTML.value = markdownContent.value;
    }
  };

  // Watch markdown content changes and reprocess
  watch(markdownContent, processMarkdownContent);

  // Process initially if content exists
  onMounted(() => {
    if (markdownContent.value) {
      processMarkdownContent();
    }
  });

  const processedPreviewHTML = computed(() => {
    // In markdown mode, use the processed markdown HTML
    if (!isRichTextMode.value) {
      return processedMarkdownHTML.value;
    }

    // In rich text mode, use the editor HTML
    if (!editor.value) return '';

    let html = editor.value.getHTML();

    // Replace :shortcode: patterns with emoji images
    const emojiRegex = /:([a-zA-Z0-9_-]+):/g;
    html = html.replace(emojiRegex, (match, shortcode) => {
      const emoji = emojiCache.value.get(shortcode);
      if (emoji) {
        return `<img class="emoji" src="${emoji.imageUrl}" alt=":${shortcode}:" title=":${shortcode}:" style="width: 1.5em; height: 1.5em; vertical-align: middle; display: inline-block;" />`;
      }
      return match; // Keep original if emoji not found
    });

    return html;
  });

  // Load emojis when component mounts
  if (process.client) {
    loadEmojisForPreview();
  }

  // Insert user mention into editor
  const insertUserMention = (username) => {
    if (!editor.value || mentionStartPos.value === null) return;

    const { state } = editor.value;
    const currentPos = state.selection.from;

    // Calculate the range to replace (@query)
    const from = mentionStartPos.value;
    const to = currentPos;

    // Create the mention link HTML
    const mentionHtml = `<a href="/@${username}">@${username}</a>&nbsp;`;

    // Replace the @query text with the mention link
    editor.value
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(mentionHtml)
      .run();

    // Reset mention state
    resetMention();
    boardReset();
    mentionStartPos.value = null;
    boardStartPos.value = null;
  };

  // Insert board mention into editor
  const insertBoardMention = (board) => {
    if (!editor.value || boardStartPos.value === null) return;

    const { state } = editor.value;
    const currentPos = state.selection.from;

    // Calculate the range to replace (b/query)
    const from = boardStartPos.value;
    const to = currentPos;

    // Create the board link HTML
    const boardHtml = `<a href="/b/${board.name}">b/${board.name}</a>&nbsp;`;

    // Replace the b/query text with the board link
    editor.value
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(boardHtml)
      .run();

    // Reset mention state
    resetMention();
    boardReset();
    mentionStartPos.value = null;
    boardStartPos.value = null;
  };

  // Handle selection updates from dropdown
  const updateMentionSelection = (type, index) => {
    currentMentionType.value = type;
    if (type === 'user') {
      mentionSelectedIndex.value = index;
    } else {
      boardSelectedIndex.value = index;
    }
  };

  // Detect @ and b/ symbols and track position
  const checkForMention = (editor) => {
    const { state } = editor;
    const { from } = state.selection;
    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, '\n', '\ufffc');

    // Look for @ followed by characters (user mention)
    const userMentionMatch = textBefore.match(/@(\w*)$/);
    // Look for b/ followed by characters (board mention)
    const boardMentionMatch = textBefore.match(/b\/(\w*)$/);

    if (userMentionMatch || boardMentionMatch) {
      const isUserMention = !!userMentionMatch;
      const query = isUserMention ? userMentionMatch[1] : boardMentionMatch[1];
      const triggerLength = isUserMention ? 1 : 2; // @ = 1 char, b/ = 2 chars
      const triggerPos = from - query.length - triggerLength;

      // Update mention type
      currentMentionType.value = isUserMention ? 'user' : 'board';

      // Store the position for later replacement
      if (isUserMention) {
        mentionStartPos.value = triggerPos;
        boardStartPos.value = null;
      } else {
        boardStartPos.value = triggerPos;
        mentionStartPos.value = null;
      }

      // Trigger search if query has content
      if (query.length > 0) {
        if (isUserMention) {
          debouncedSearch(query);
          boardReset(); // Clear board suggestions
        } else {
          boardDebouncedSearch(query);
          resetMention(); // Clear user suggestions
        }
      } else {
        // Show empty dropdown or reset
        if (isUserMention) {
          resetMention();
        } else {
          boardReset();
        }
      }

      // Calculate dropdown position with viewport boundary detection
      const coords = editor.view.coordsAtPos(from);
      if (coords) {
        const dropdownHeight = 200; // Approximate dropdown height
        const dropdownWidth = 250; // Approximate dropdown width

        // Calculate initial position (coordsAtPos already returns viewport coordinates)
        let top = coords.bottom + 5;
        let left = coords.left;

        // Check if dropdown would overflow bottom of viewport
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - coords.bottom;
        const spaceAbove = coords.top;

        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          // Position above cursor if more space above
          top = coords.top - dropdownHeight - 5;
        }

        // Check if dropdown would overflow right edge of viewport
        const viewportWidth = window.innerWidth;
        if (left + dropdownWidth > viewportWidth) {
          left = viewportWidth - dropdownWidth - 10;
        }

        // Ensure dropdown doesn't go off left edge
        if (left < 10) {
          left = 10;
        }

        // Set position for the appropriate mention type
        if (isUserMention) {
          mentionPosition.value = { top, left };
        } else {
          boardPosition.value = { top, left };
        }
      }
    } else {
      // No mention triggers detected, hide dropdowns
      if (mentionVisible.value) {
        resetMention();
        mentionStartPos.value = null;
      }
      if (boardVisible.value) {
        boardReset();
        boardStartPos.value = null;
      }
    }
  };

  // Insert emoji from suggestions
  const insertEmojiSuggestion = (index) => {
    const emoji = selectEmojiSuggestion(index);
    if (!emoji || !editor.value || emojiStartPos.value === null) return;

    const { state } = editor.value;
    const currentPos = state.selection.from;

    // Calculate the range to replace (:query)
    const from = emojiStartPos.value;
    const to = currentPos;

    // Create the emoji HTML with proper class and shortcode data attribute for conversion
    const emojiHtml = `<img src="${emoji.imageUrl}" alt="${emoji.altTextDisplay}" class="emoji" data-shortcode="${emoji.shortcode}" />&nbsp;`;

    // Replace the :query text with the emoji image
    editor.value
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(emojiHtml)
      .run();

    // Reset emoji state
    hideEmojiSuggestions();
    emojiStartPos.value = null;
  };

  // Detect : symbol and track position for emoji
  const checkForEmojiSuggestion = async (editor) => {
    const { state } = editor;
    const { from } = state.selection;
    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, '\n', '\ufffc');

    // Look for : followed by characters
    const emojiMatch = textBefore.match(/:(\w*)$/);


    if (emojiMatch && emojiMatch[1].length >= 1) {
      const query = emojiMatch[1];
      const colonPos = from - query.length - 1; // Position of :


      // Track start position
      emojiStartPos.value = colonPos;


      // Load emojis if not already loaded
      await loadEmojiCache();

      // Calculate cursor coordinates for precise positioning
      const coords = editor.view.coordsAtPos(from);

      // Create a temporary element at cursor position for positioning
      const tempElement = {
        getBoundingClientRect() {
          return {
            top: coords.top,
            left: coords.left,
            bottom: coords.bottom,
            right: coords.right,
            width: 0,
            height: coords.bottom - coords.top
          };
        }
      };

      // Use the composable's showSuggestions method with precise coordinates
      await showEmojiSuggestions(textBefore, from, tempElement);

    } else {
      // No : detected or query too short, hide dropdown
      if (emojiVisible.value) {
        hideEmojiSuggestions();
        emojiStartPos.value = null;
      }
    }
  };

  // Keyboard shortcuts help modal
  const showShortcutsModal = ref(false);

  const toggleShortcutsModal = () => {
    showShortcutsModal.value = !showShortcutsModal.value;
  };

  // Mode switching with smooth transitions
  const toggleMode = () => {
    isRichTextMode.value = !isRichTextMode.value;
  };

  // Preview toggle for markdown mode
  const togglePreview = () => {
    showPreview.value = !showPreview.value;
  };

  // Color picker state
  const showTextColorPicker = ref(false);
  const showHighlightColorPicker = ref(false);
  const customTextColor = ref('');
  const customHighlightColor = ref('');

  // Color presets - common text colors
  const textColorPresets = [
    '#000000', // Black
    '#444444', // Dark Gray
    '#666666', // Gray
    '#999999', // Light Gray
    '#E53E3E', // Red
    '#DD6B20', // Orange
    '#D69E2E', // Yellow
    '#38A169', // Green
    '#3182CE', // Blue
    '#805AD5', // Purple
    '#D53F8C', // Pink
    '#2D3748', // Dark Slate
    '#718096', // Slate
    '#A0AEC0', // Light Slate
    '#FFFFFF', // White
    '#742A2A', // Dark Red
  ];

  // Color presets - common highlight colors
  const highlightColorPresets = [
    '#FFFF00', // Yellow
    '#FEF08A', // Light Yellow
    '#FDE047', // Bright Yellow
    '#FCD34D', // Gold
    '#FCA5A5', // Light Red
    '#FDA4AF', // Pink
    '#F9A8D4', // Light Pink
    '#DDD6FE', // Light Purple
    '#C7D2FE', // Lavender
    '#BFDBFE', // Light Blue
    '#A5F3FC', // Cyan
    '#A7F3D0', // Light Green
    '#BBF7D0', // Mint
    '#D1FAE5', // Very Light Green
    '#FDE68A', // Pale Yellow
    '#E5E7EB', // Light Gray
  ];

  // Set text color
  const setTextColor = (color) => {
    editor.value?.chain().focus().setColor(color).run();
    showTextColorPicker.value = false;
    customTextColor.value = '';
  };

  // Set highlight color
  const setHighlightColor = (color) => {
    editor.value?.chain().focus().toggleHighlight({ color }).run();
    showHighlightColorPicker.value = false;
    customHighlightColor.value = '';
  };

  // Extension to disable markdown input rules in markdown mode
  const DisableMarkdownInputRules = Extension.create({
    name: 'disableMarkdownInputRules',

    // Override input rules to disable them in markdown mode
    addInputRules() {
      return [];
    },

    // Disable all built-in input rules when in markdown mode
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('disableMarkdownInputRules'),

          // Higher priority to run before other plugins
          appendTransaction(transactions, oldState, newState) {
            // In markdown mode, revert any formatting applied by input rules
            if (!isRichTextMode.value) {
              const tr = newState.tr;
              let modified = false;

              // Check if any node was converted to a formatted type
              newState.doc.descendants((node, pos) => {
                // If node type changed to a formatted type, revert it to paragraph
                if (node.type.name === 'heading' ||
                    node.type.name === 'bulletList' ||
                    node.type.name === 'orderedList' ||
                    node.type.name === 'blockquote' ||
                    node.type.name === 'codeBlock') {

                  // Get the text content
                  const textContent = node.textContent;

                  // Create paragraph with text content (handle empty text)
                  let paragraph;
                  if (textContent && textContent.length > 0) {
                    paragraph = newState.schema.nodes.paragraph.create(null,
                      newState.schema.text(textContent)
                    );
                  } else {
                    // Empty paragraph for empty content
                    paragraph = newState.schema.nodes.paragraph.create();
                  }

                  tr.replaceWith(pos, pos + node.nodeSize, paragraph);
                  modified = true;
                  return false; // Stop descending
                }
              });

              if (modified) {
                return tr;
              }
            }
            return null;
          }
        })
      ];
    }
  });

  // Create keyboard shortcut extension for formatting and navigation
  const KeyboardShortcutsExtension = Extension.create({
    name: 'keyboardShortcuts',

    addKeyboardShortcuts() {
      return {
        // Text Formatting
        'Mod-b': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().toggleBold().run();
            return true;
          }
          return false;
        },
        'Mod-i': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().toggleItalic().run();
            return true;
          }
          return false;
        },
        'Mod-Shift-s': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().toggleStrike().run();
            return true;
          }
          return false;
        },
        // Link insertion
        'Mod-k': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            setLink();
            return true;
          }
          return false;
        },
        // Lists
        'Mod-Shift-7': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().toggleOrderedList().run();
            return true;
          }
          return false;
        },
        'Mod-Shift-8': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().toggleBulletList().run();
            return true;
          }
          return false;
        },
        // Headings
        'Mod-Alt-1': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().toggleHeading({ level: 1 }).run();
            return true;
          }
          return false;
        },
        'Mod-Alt-2': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().toggleHeading({ level: 2 }).run();
            return true;
          }
          return false;
        },
        'Mod-Alt-3': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().toggleHeading({ level: 3 }).run();
            return true;
          }
          return false;
        },
        // Blockquote
        'Mod-Shift-b': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().toggleBlockquote().run();
            return true;
          }
          return false;
        },
        // Code block
        'Mod-Alt-c': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().toggleCodeBlock().run();
            return true;
          }
          return false;
        },
        // Clear formatting
        'Mod-\\': () => {
          if (!mentionVisible.value && !emojiVisible.value) {
            editor.value?.chain().focus().clearNodes().unsetAllMarks().run();
            return true;
          }
          return false;
        },
        // Help modal
        'Mod-/': () => {
          toggleShortcutsModal();
          return true;
        },
        // Unified Mention and Emoji Navigation
        ArrowDown: () => {
          if (unifiedMentionVisible.value) {
            if (currentMentionType.value === 'user' && mentionVisible.value) {
              selectNextMention();
            } else if (currentMentionType.value === 'board' && boardVisible.value) {
              boardSelectNext();
            }
            return true;
          }
          if (emojiVisible.value) {
            navigateEmojiDown();
            return true;
          }
          return false;
        },
        ArrowUp: () => {
          if (unifiedMentionVisible.value) {
            if (currentMentionType.value === 'user' && mentionVisible.value) {
              selectPreviousMention();
            } else if (currentMentionType.value === 'board' && boardVisible.value) {
              boardSelectPrevious();
            }
            return true;
          }
          if (emojiVisible.value) {
            navigateEmojiUp();
            return true;
          }
          return false;
        },
        Enter: () => {
          if (unifiedMentionVisible.value) {
            if (currentMentionType.value === 'user' && mentionVisible.value) {
              const username = getSelectedUsername();
              if (username) {
                insertUserMention(username);
                return true;
              }
            } else if (currentMentionType.value === 'board' && boardVisible.value) {
              const board = boardGetSelectedBoard();
              if (board) {
                insertBoardMention(board);
                return true;
              }
            }
          }
          if (emojiVisible.value) {
            insertEmojiSuggestion(emojiSelectedIndex.value);
            return true;
          }
          return false;
        },
        Escape: () => {
          if (showShortcutsModal.value) {
            showShortcutsModal.value = false;
            return true;
          }
          if (showLinkModal.value) {
            cancelLink();
            return true;
          }
          if (showTextColorPicker.value) {
            showTextColorPicker.value = false;
            return true;
          }
          if (showHighlightColorPicker.value) {
            showHighlightColorPicker.value = false;
            return true;
          }
          if (unifiedMentionVisible.value) {
            resetMention();
            boardReset();
            mentionStartPos.value = null;
            boardStartPos.value = null;
            return true;
          }
          if (emojiVisible.value) {
            hideEmojiSuggestions();
            emojiStartPos.value = null;
            return true;
          }
          return false;
        }
      };
    }
  });

  const editor = useEditor({
    content: props.modelValue || '',
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        italic: {
          HTMLAttributes: {
            class: 'italic-mark'
          }
        },
        bold: {
          HTMLAttributes: {
            class: 'bold-mark'
          }
        },
        strike: {
          HTMLAttributes: {
            class: 'strike-mark'
          }
        }
      }),
      Color,
      Highlight.configure({
        multicolor: true
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-700 underline'
        }
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded cursor-move image-resizable'
        }
      }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null,
              parseHTML: element => element.getAttribute('width'),
              renderHTML: attributes => {
                if (!attributes.width) {
                  return {}
                }
                return { width: attributes.width }
              },
            },
            height: {
              default: null,
              parseHTML: element => element.getAttribute('height'),
              renderHTML: attributes => {
                if (!attributes.height) {
                  return {}
                }
                return { height: attributes.height }
              },
            },
            class: {
              default: null,
              parseHTML: element => element.getAttribute('class'),
              renderHTML: attributes => {
                if (!attributes.class) {
                  return {}
                }
                return { class: attributes.class }
              },
            },
            'data-shortcode': {
              default: null,
              parseHTML: element => element.getAttribute('data-shortcode'),
              renderHTML: attributes => {
                if (!attributes['data-shortcode']) {
                  return {}
                }
                return { 'data-shortcode': attributes['data-shortcode'] }
              },
            },
          }
        },
        addNodeView() {
          return ({ node, getPos, editor }) => {
            // Check if this is an emoji
            const isEmoji = node.attrs.class && node.attrs.class.includes('emoji');

            if (isEmoji) {
              // For emojis, return a simple image without wrapper or resize handles
              const img = document.createElement('img');
              img.src = node.attrs.src;
              img.alt = node.attrs.alt || '';
              img.className = node.attrs.class || 'emoji'; // Preserve original emoji classes

              if (node.attrs['data-shortcode']) {
                img.setAttribute('data-shortcode', node.attrs['data-shortcode']);
              }

              return {
                dom: img,
                contentDOM: null,
                update: (updatedNode) => {
                  if (updatedNode.type.name !== 'image') return false;

                  img.src = updatedNode.attrs.src;
                  img.alt = updatedNode.attrs.alt || '';
                  if (updatedNode.attrs.class) {
                    img.className = updatedNode.attrs.class;
                  }
                  if (updatedNode.attrs['data-shortcode']) {
                    img.setAttribute('data-shortcode', updatedNode.attrs['data-shortcode']);
                  }

                  return true;
                }
              };
            }

            // For regular images, use the resizable wrapper
            const container = document.createElement('div');
            container.className = 'image-wrapper';

            const img = document.createElement('img');
            img.src = node.attrs.src;
            img.alt = node.attrs.alt || '';
            img.className = 'max-w-full h-auto rounded cursor-move image-resizable';

            if (node.attrs.width) {
              img.style.width = node.attrs.width + 'px';
            }
            if (node.attrs.height) {
              img.style.height = node.attrs.height + 'px';
            }

            // Create resize handles
            const createHandle = (position) => {
              const handle = document.createElement('div');
              handle.className = `resize-handle resize-handle-${position}`;
              handle.setAttribute('data-position', position);
              return handle;
            };

            const handleBottomRight = createHandle('bottom-right');

            container.appendChild(img);
            container.appendChild(handleBottomRight);

            return {
              dom: container,
              contentDOM: null,
              update: (updatedNode) => {
                if (updatedNode.type.name !== 'image') return false;

                img.src = updatedNode.attrs.src;
                img.alt = updatedNode.attrs.alt || '';

                // Check if this node has become an emoji
                const isNowEmoji = updatedNode.attrs.class && updatedNode.attrs.class.includes('emoji');
                if (isNowEmoji) {
                  // If it's now an emoji, we should recreate the view without wrapper
                  return false; // Force recreation
                }

                if (updatedNode.attrs.width) {
                  img.style.width = updatedNode.attrs.width + 'px';
                } else {
                  img.style.width = '';
                }
                if (updatedNode.attrs.height) {
                  img.style.height = updatedNode.attrs.height + 'px';
                } else {
                  img.style.height = '';
                }

                return true;
              }
            };
          };
        }
      }),
      Underline,
      Superscript,
      Subscript,
      Spoiler,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-200 dark:bg-yellow-800'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full'
        }
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start gap-2'
        }
      }),
      DisableMarkdownInputRules,
      KeyboardShortcutsExtension
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none'
      }
    },
    onCreate: ({ editor }) => {
      // Only emit initial content when in rich text mode
      if (isRichTextMode.value) {
        emit('update:modelValue', editor.getHTML());
      }
      isEditorEmpty.value = editor.isEmpty;

      // Add image resize handler
      setupImageResize(editor);

      // Add spoiler click handler
      setupSpoilerHandlers(editor);
    },
    onUpdate: async ({ editor }) => {
      // Only emit when in rich text mode
      if (isRichTextMode.value) {
        emit('update:modelValue', editor.getHTML());
      }
      isEditorEmpty.value = editor.isEmpty;

      // Check for @ mentions and : emoji on every update
      checkForMention(editor);
      await checkForEmojiSuggestion(editor);
    }
  });

  // Image resize functionality
  const setupImageResize = (editor) => {
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let currentImage = null;
    let currentWrapper = null;
    let currentPos = null;

    const handleMouseDown = (e) => {
      // Check if clicking on resize handle
      const handle = e.target.closest('.resize-handle');
      if (handle) {
        const wrapper = handle.closest('.image-wrapper');
        const img = wrapper?.querySelector('img');

        if (wrapper && img) {
          // Don't allow resizing images inside blockquotes (quoted content)
          const isInBlockquote = wrapper.closest('blockquote');
          if (isInBlockquote) {
            return;
          }

          e.preventDefault();
          e.stopPropagation();

          isResizing = true;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = img.offsetWidth || img.naturalWidth;
          startHeight = img.offsetHeight || img.naturalHeight;
          currentImage = img;
          currentWrapper = wrapper;

          // Store the position in the document
          currentPos = editor.view.posAtDOM(wrapper, 0);

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);

          // Prevent text selection while resizing
          document.body.style.userSelect = 'none';
        }
        return;
      }

      // Fallback: Also allow dragging selected images directly (legacy behavior)
      const img = e.target;
      if (img.tagName === 'IMG' && img.classList.contains('ProseMirror-selectednode')) {
        // Don't allow resizing images inside blockquotes (quoted content)
        const isInBlockquote = img.closest('blockquote');
        if (isInBlockquote) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = img.width || img.naturalWidth;
        startHeight = img.height || img.naturalHeight;
        currentImage = img;

        // Store the position in the document
        currentPos = editor.view.posAtDOM(img, 0);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Prevent text selection while resizing
        document.body.style.userSelect = 'none';
      }
    };

    const handleMouseMove = (e) => {
      if (!isResizing || !currentImage) return;

      e.preventDefault();
      e.stopPropagation();

      const deltaX = e.clientX - startX;
      const newWidth = Math.max(100, Math.min(startWidth + deltaX, 1000));

      // Apply the new width directly
      currentImage.style.width = newWidth + 'px';
      currentImage.style.height = 'auto';
    };

    const handleMouseUp = () => {
      if (isResizing && currentImage && currentPos !== null) {
        const newWidth = parseInt(currentImage.style.width);

        // Update the node attributes in the editor
        const transaction = editor.view.state.tr.setNodeMarkup(currentPos, null, {
          ...editor.view.state.doc.nodeAt(currentPos)?.attrs,
          width: newWidth,
        });

        editor.view.dispatch(transaction);
      }

      isResizing = false;
      currentImage = null;
      currentWrapper = null;
      currentPos = null;
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Add event listener to editor element
    if (editor.view?.dom) {
      editor.view.dom.addEventListener('mousedown', handleMouseDown);
    }
  };

  // Spoiler click functionality
  const setupSpoilerHandlers = (editor) => {
    const handleSpoilerClick = (event) => {
      const spoilerElement = event.target.closest('.spoiler');
      if (spoilerElement && spoilerElement.getAttribute('data-spoiler') === 'true') {
        event.preventDefault();
        event.stopPropagation();

        // Toggle revealed state
        spoilerElement.classList.toggle('revealed');

        // Update the title attribute
        if (spoilerElement.classList.contains('revealed')) {
          spoilerElement.title = 'Click to hide spoiler';
        } else {
          spoilerElement.title = 'Click to reveal spoiler';
        }
      }
    };

    // Add click listener to editor
    if (editor.view?.dom) {
      editor.view.dom.addEventListener('click', handleSpoilerClick);
    }
  };

  // Watch for external changes to modelValue
  watch(() => props.modelValue, (newValue) => {
    const isSame = editor.value?.getHTML() === newValue;
    if (!isSame && editor.value) {
      editor.value.commands.setContent(newValue, false);
      isEditorEmpty.value = editor.value.isEmpty;
    }
  });

  // Handle click outside color pickers
  const handleClickOutside = (event) => {
    // Check if click is outside color picker popovers
    const target = event.target;
    const isInTextColorPicker = target.closest('.text-color-picker-container');
    const isInHighlightColorPicker = target.closest('.highlight-color-picker-container');

    if (!isInTextColorPicker && showTextColorPicker.value) {
      showTextColorPicker.value = false;
    }
    if (!isInHighlightColorPicker && showHighlightColorPicker.value) {
      showHighlightColorPicker.value = false;
    }
  };

  // Add click outside handler on mount
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  // Remove click outside handler on unmount
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    // Properly destroy TipTap editor to prevent memory leaks
    if (editor.value) {
      editor.value.destroy();
    }
  });

  const setLink = () => {
    // Get selected text and existing link if any
    const { state } = editor.value;
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to, ' ');
    const previousUrl = editor.value?.getAttributes('link').href;

    // Pre-fill the form
    linkUrl.value = previousUrl || '';
    linkText.value = selectedText || '';

    // Show modal
    showLinkModal.value = true;

    // Focus the URL input after modal renders
    nextTick(() => {
      linkUrlInput.value?.focus();
    });
  };

  const insertLink = () => {
    if (!linkUrl.value) {
      // Remove link if URL is empty
      editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
      showLinkModal.value = false;
      return;
    }

    const { state } = editor.value;
    const { from, to } = state.selection;

    if (linkText.value && linkText.value !== state.doc.textBetween(from, to, ' ')) {
      // Insert new text with link
      editor.value
        ?.chain()
        .focus()
        .insertContent(`<a href="${linkUrl.value}">${linkText.value}</a>`)
        .run();
    } else {
      // Just add link to selected text
      editor.value
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl.value })
        .run();
    }

    // Reset and close
    linkUrl.value = '';
    linkText.value = '';
    showLinkModal.value = false;
  };

  const cancelLink = () => {
    linkUrl.value = '';
    linkText.value = '';
    showLinkModal.value = false;

    // Restore focus to editor
    nextTick(() => {
      editor.value?.commands.focus();
    });
  };

  const addImage = () => {
    const url = window.prompt('Image URL')

    if (url) {
      editor.value.chain().focus().setImage({ src: url }).run()
    }
  }

  const insertEmoji = (emoji) => {
    if (editor.value) {
      editor.value.chain().focus().insertContent(emoji).run()
    }
  }

  // File upload state
  const fileInput = ref(null)
  const isDragging = ref(false)
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const uploadTotal = ref(0)
  let dragCounter = 0

  const handleDragEnter = (e) => {
    // Only show overlay for file drags, not internal editor drags
    if (e.dataTransfer?.types?.includes('Files')) {
      dragCounter++
      isDragging.value = true
    }
  }

  const handleDragLeave = (e) => {
    dragCounter--
    if (dragCounter === 0) {
      isDragging.value = false
    }
  }

  const handleDragOver = (e) => {
    // Check if we're dragging files
    if (e.dataTransfer?.types?.includes('Files')) {
      isDragging.value = true
    }
  }

  const triggerFileUpload = () => {
    fileInput.value?.click()
  }

  const uploadFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 10MB')
    }

    const formData = new FormData()
    formData.append('operations', JSON.stringify({
      query: `
        mutation UploadFile($file: Upload!) {
          uploadFile(file: $file)
        }
      `,
      variables: { file: null }
    }))
    formData.append('map', JSON.stringify({ '0': ['variables.file'] }))
    formData.append('0', file)

    try {
      // Get the auth token from cookie
      const authStore = useLoggedInUser()
      const token = authStore.token

      const headers = {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }

      const response = await fetch('/api/v2/graphql', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      if (result.errors) {
        throw new Error(result.errors[0].message || 'Upload failed')
      }

      return result.data.uploadFile
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  const handleFileUpload = async (event) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    await processFiles(Array.from(files))

    // Reset input
    event.target.value = ''
  }

  const handleDrop = async (event) => {
    isDragging.value = false
    dragCounter = 0
    const files = event.dataTransfer?.files
    if (!files) return

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      await processFiles(imageFiles)
    }
  }

  const processFiles = async (files) => {
    uploading.value = true
    uploadTotal.value = files.length
    uploadProgress.value = 0

    let successCount = 0
    let failedFiles = []

    for (const file of files) {
      try {
        const url = await uploadFile(file)

        // Insert image into editor at cursor position
        editor.value?.chain().focus().setImage({ src: url }).run()

        successCount++
        uploadProgress.value++
      } catch (error) {
        console.error('Failed to upload file:', error)
        failedFiles.push({ name: file.name, error: error.message })
        uploadProgress.value++
      }
    }

    uploading.value = false

    // Show success notification if any files uploaded
    if (successCount > 0) {
      toastStore.addNotification({
        header: 'Upload successful',
        message: successCount === 1
          ? '1 image uploaded successfully'
          : `${successCount} images uploaded successfully`,
        type: 'success'
      })
    }

    // Show error notification if any files failed
    if (failedFiles.length > 0) {
      const errorMessage = failedFiles.length === 1
        ? `Failed to upload ${failedFiles[0].name}: ${failedFiles[0].error}`
        : `Failed to upload ${failedFiles.length} image${failedFiles.length > 1 ? 's' : ''}: ${failedFiles.map(f => f.name).join(', ')}`

      toastStore.addNotification({
        header: 'Upload failed',
        message: errorMessage,
        type: 'error'
      })
    }
  }

  // ===== MARKDOWN MODE FUNCTIONS =====

  // Refs for markdown mode
  const markdownTextarea = ref(null);
  // showPreview is already declared above - reusing existing ref

  // Markdown input handlers
  const handleMarkdownInput = (event) => {
    const textarea = event.target;
    const content = textarea.value;

    // Handle mention autocomplete
    handleMentionInput(textarea, content);

    // Handle emoji suggestions
    handleEmojiInput(textarea, content);

    emit('update:modelValue', content);
  };

  const handleMarkdownKeydown = (event) => {
    const textarea = event.target;

    // Handle mention selection
    if (unifiedMentionVisible.value) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        updateMentionSelection(direction);
        return;
      }

      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        if (currentMentionType.value === 'user' && mentionVisible.value) {
          insertUserMentionMarkdown(mentionSelectedIndex.value);
        } else if (currentMentionType.value === 'board' && boardVisible.value) {
          insertBoardMentionMarkdown(boardSelectedIndex.value);
        }
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        resetMention();
        boardReset();
        return;
      }
    }

    // Handle emoji selection
    if (emojiVisible.value) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const newIndex = Math.max(0, Math.min(emojiSuggestions.value.length - 1, emojiSelectedIndex.value + direction));
        emojiSelectedIndex.value = newIndex;
        return;
      }

      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        insertEmojiSuggestionMarkdown(emojiSelectedIndex.value);
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        clearEmojiSuggestions();
        return;
      }
    }
  };

  const handleMarkdownClick = (event) => {
    const textarea = event.target;
    updateMarkdownMentionPosition(textarea);
  };

  // Markdown mention functions
  const handleMentionInput = (textarea, content) => {
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPos);

    // Check for user mention (@)
    const userMatch = textBeforeCursor.match(/@([a-zA-Z0-9_]*)$/);
    if (userMatch) {
      const query = userMatch[1];
      searchUsers(query);
      mentionStartPos.value = cursorPos - userMatch[0].length;
      updateMarkdownMentionPosition(textarea);
      currentMentionType.value = 'user';
      return;
    }

    // Check for board mention (b/)
    const boardMatch = textBeforeCursor.match(/b\/([a-zA-Z0-9_]*)$/);
    if (boardMatch) {
      const query = boardMatch[1];
      searchBoards(query);
      boardStartPos.value = cursorPos - boardMatch[0].length;
      updateMarkdownMentionPosition(textarea);
      currentMentionType.value = 'board';
      return;
    }

    // Reset if no match
    resetMention();
    boardReset();
  };

  const handleEmojiInput = (textarea, content) => {
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPos);

    // Check for emoji shortcode (:emoji:)
    const emojiMatch = textBeforeCursor.match(/:([a-zA-Z0-9_+\-]*)$/);
    if (emojiMatch && emojiMatch[1].length > 0) {
      const query = emojiMatch[1];
      startEmojiSuggestions(query, cursorPos - emojiMatch[0].length);
      updateMarkdownEmojiPosition(textarea);
    } else {
      clearEmojiSuggestions();
    }
  };

  const updateMarkdownMentionPosition = (textarea) => {
    if (!textarea) return;

    const { top, left } = getTextareaCaretPosition(textarea, textarea.selectionStart);
    const rect = textarea.getBoundingClientRect();

    // Account for scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    mentionPosition.value = {
      top: rect.top + top + 20 + scrollTop,
      left: rect.left + left + scrollLeft
    };

    boardPosition.value = {
      top: rect.top + top + 20 + scrollTop,
      left: rect.left + left + scrollLeft
    };
  };

  const updateMarkdownEmojiPosition = (textarea) => {
    if (!textarea) return;

    const { top, left } = getTextareaCaretPosition(textarea, textarea.selectionStart);
    const rect = textarea.getBoundingClientRect();

    // Account for scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    emojiPositionData.value = {
      top: rect.top + top + 20 + scrollTop,
      left: rect.left + left + scrollLeft
    };
  };

  // Get caret position in textarea for positioning dropdowns
  const getTextareaCaretPosition = (textarea, caretPos) => {
    if (!textarea || !textarea.value) return { top: 0, left: 0 };

    // Create a temporary div to measure text
    const div = document.createElement('div');
    const computed = getComputedStyle(textarea);

    // Copy all relevant styles
    [
      'fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
      'letterSpacing', 'wordSpacing', 'lineHeight',
      'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
      'border', 'borderLeft', 'borderRight', 'borderTop', 'borderBottom',
      'boxSizing', 'whiteSpace'
    ].forEach(prop => {
      div.style[prop] = computed[prop];
    });

    // Position and make invisible
    div.style.position = 'absolute';
    div.style.left = '-9999px';
    div.style.top = '-9999px';
    div.style.visibility = 'hidden';
    div.style.height = 'auto';
    div.style.width = textarea.clientWidth + 'px';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.overflow = 'hidden';

    document.body.appendChild(div);

    // Get text before caret
    const textBeforeCaret = textarea.value.substring(0, caretPos);
    div.textContent = textBeforeCaret;

    // Create a span for the caret position
    const span = document.createElement('span');
    span.textContent = '|'; // Invisible character to mark position
    div.appendChild(span);

    const spanRect = span.getBoundingClientRect();
    const divRect = div.getBoundingClientRect();

    // Calculate relative position within the textarea
    const relativeTop = spanRect.top - divRect.top;
    const relativeLeft = spanRect.left - divRect.left;

    document.body.removeChild(div);

    return {
      top: relativeTop,
      left: relativeLeft
    };
  };

  // Markdown mention insertion functions
  const insertUserMentionMarkdown = (index) => {
    if (!markdownTextarea.value || typeof index === 'object') {
      // If index is actually a user object (from direct selection)
      const username = typeof index === 'object' ? index.name : suggestions.value[index]?.name;
      if (!username) return;

      insertAtCaret(markdownTextarea.value, mentionStartPos.value, markdownTextarea.value.selectionStart, `@${username}`);
      resetMention();
      return;
    }

    const user = suggestions.value[index];
    if (!user) return;

    insertAtCaret(markdownTextarea.value, mentionStartPos.value, markdownTextarea.value.selectionStart, `@${user.name}`);
    resetMention();
  };

  const insertBoardMentionMarkdown = (index) => {
    if (!markdownTextarea.value || typeof index === 'object') {
      // If index is actually a board object (from direct selection)
      const boardName = typeof index === 'object' ? index.name : boardSuggestions.value[index]?.name;
      if (!boardName) return;

      insertAtCaret(markdownTextarea.value, boardStartPos.value, markdownTextarea.value.selectionStart, `b/${boardName}`);
      boardReset();
      return;
    }

    const board = boardSuggestions.value[index];
    if (!board) return;

    insertAtCaret(markdownTextarea.value, boardStartPos.value, markdownTextarea.value.selectionStart, `b/${board.name}`);
    boardReset();
  };

  const insertEmojiSuggestionMarkdown = (index) => {
    const emoji = selectEmojiSuggestion(index);
    if (!emoji || !markdownTextarea.value) return;

    const startPos = emojiStartPos.value;
    const endPos = markdownTextarea.value.selectionStart;

    insertAtCaret(markdownTextarea.value, startPos, endPos, emoji.shortcode);
    clearEmojiSuggestions();
  };

  // Helper function to insert text at caret position
  const insertAtCaret = (textarea, startPos, endPos, replacement) => {
    const currentValue = textarea.value;
    const newValue = currentValue.substring(0, startPos) + replacement + currentValue.substring(endPos);

    textarea.value = newValue;
    markdownContent.value = newValue;
    emit('update:modelValue', newValue);

    // Set cursor position after replacement
    const newCursorPos = startPos + replacement.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  };
</script>

<style scoped>

/* Force full width for the editor */
.w-full {
  width: 100% !important;
  max-width: none !important;
  min-width: 100% !important;
}

/* Override TipTap editor background */
.tiptap-editor :deep(.ProseMirror) {
  background: transparent !important;
  background-color: transparent !important;
}

.tiptap-editor :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #9ca3af; /* gray-400 */
}

.tiptap-editor :deep(.ProseMirror) {
  outline: none !important;
  border: none !important;
}

/* Dynamic height management */
.tiptap-root {
  min-height: 240px; /* Fallback minimum height when no container constraints */
}

.editor-container {
  flex: 1;
  min-height: 0; /* Important for flex children to shrink */
}

.editor-toolbar {
  flex-shrink: 0;
  max-height: 120px;
  overflow-y: auto;
}

:deep(.editor-content) {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.ProseMirror) {
  flex: 1;
  overflow-y: auto;
  font-size: 14px;
  @apply bg-gray-100 focus:bg-white dark:bg-gray-900 dark:focus:bg-gray-950 px-3 py-3 pb-12 shadow-inner-xs;
}

:deep(.ProseMirror:focus) {
  outline: none;
}

/* Markdown Mode: Disable visual formatting to show raw markdown */
.markdown-mode :deep(.ProseMirror *:not(img)) {
  font-size: 14px !important;
  line-height: 1.5 !important;
  font-weight: normal !important;
  font-style: normal !important;
  text-decoration: none !important;
  color: inherit !important;
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  list-style: none !important;
}

.markdown-mode :deep(.ProseMirror) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
}

.markdown-mode :deep(.ProseMirror) {
  padding-bottom: 3rem !important; /* Less padding for markdown mode since no toolbar */
}

.markdown-mode :deep(.ProseMirror p) {
  margin-bottom: 0.5rem !important;
}

.markdown-mode :deep(.ProseMirror strong),
.markdown-mode :deep(.ProseMirror b) {
  font-weight: normal !important;
}

.markdown-mode :deep(.ProseMirror em),
.markdown-mode :deep(.ProseMirror i) {
  font-style: normal !important;
}

.markdown-mode :deep(.ProseMirror h1),
.markdown-mode :deep(.ProseMirror h2),
.markdown-mode :deep(.ProseMirror h3),
.markdown-mode :deep(.ProseMirror h4),
.markdown-mode :deep(.ProseMirror h5),
.markdown-mode :deep(.ProseMirror h6) {
  font-size: 14px !important;
  font-weight: normal !important;
}

.markdown-mode :deep(.ProseMirror ul),
.markdown-mode :deep(.ProseMirror ol) {
  padding-left: 0 !important;
}

.markdown-mode :deep(.ProseMirror li) {
  margin-bottom: 0.25rem !important;
}

/* Headings */
:deep(.ProseMirror h1) {
  @apply text-3xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100;
}

:deep(.ProseMirror h2) {
  @apply text-2xl font-bold mt-5 mb-3 text-gray-900 dark:text-gray-100;
}

:deep(.ProseMirror h3) {
  @apply text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100;
}

/* Paragraphs */
:deep(.ProseMirror p) {
  @apply text-gray-900 dark:text-gray-100 leading-relaxed mb-3;
}

:deep(.ProseMirror p:last-child) {
  @apply mb-0;
}

/* Text formatting */
:deep(.ProseMirror strong) {
  @apply font-bold text-gray-900 dark:text-gray-100;
}

:deep(.ProseMirror em) {
  @apply italic;
}

:deep(.ProseMirror s) {
  @apply line-through;
}

:deep(.ProseMirror u) {
  @apply underline;
}

/* Links */
:deep(.ProseMirror a) {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline cursor-pointer;
}

/* Lists */
:deep(.ProseMirror ul) {
  @apply list-disc pl-6 mb-3 text-gray-900 dark:text-gray-100;
}

:deep(.ProseMirror ul li) {
  @apply mb-1;
}

:deep(.ProseMirror ul li::marker) {
  color: #000000;
}

.dark :deep(.ProseMirror ul li::marker) {
  color: #ffffff;
}

:deep(.ProseMirror ol) {
  @apply list-decimal pl-6 mb-3 text-gray-900 dark:text-gray-100;
}

:deep(.ProseMirror ol li) {
  @apply mb-1;
}

:deep(.ProseMirror ol li::marker) {
  color: #000000;
  font-weight: 600;
}

.dark :deep(.ProseMirror ol li::marker) {
  color: #ffffff;
}

/* Nested ordered list styling - different numbering types by level */
:deep(.ProseMirror ol) {
  list-style-type: decimal; /* First level: 1, 2, 3... */
}

:deep(.ProseMirror ol ol) {
  list-style-type: lower-alpha; /* Second level: a, b, c... */
  margin-top: 0.25rem;
}

:deep(.ProseMirror ol ol ol) {
  list-style-type: lower-roman; /* Third level: i, ii, iii... */
  margin-top: 0.25rem;
}

:deep(.ProseMirror ol ol ol ol) {
  list-style-type: decimal; /* Fourth level: back to numbers */
  margin-top: 0.25rem;
}

:deep(.ProseMirror ol ol ol ol ol) {
  list-style-type: lower-alpha; /* Fifth level: back to letters */
  margin-top: 0.25rem;
}

/* Blockquotes */
:deep(.ProseMirror blockquote) {
  @apply border-l-4 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300;
  border-left-color: rgb(var(--color-primary));
  background-color: rgba(var(--color-primary), 0.05);
  quotes: none;
}

:deep(.ProseMirror blockquote)::before,
:deep(.ProseMirror blockquote)::after {
  content: '';
  content: none;
}

:deep(.ProseMirror blockquote p)::before,
:deep(.ProseMirror blockquote p)::after {
  content: '';
  content: none;
}

:deep(.ProseMirror blockquote a.quote-link) {
  @apply not-italic font-semibold no-underline;
  color: rgb(var(--color-primary));
}

:deep(.ProseMirror blockquote a.quote-link:hover) {
  @apply underline;
}

/* Images in blockquotes cannot be resized */
:deep(.ProseMirror blockquote img) {
  cursor: default !important;
}

:deep(.ProseMirror blockquote img.ProseMirror-selectednode) {
  cursor: default !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Code */
:deep(.ProseMirror code) {
  @apply bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400;
}

:deep(.ProseMirror pre) {
  @apply bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg my-4 overflow-x-auto;
}

:deep(.ProseMirror pre code) {
  @apply bg-transparent p-0 text-gray-100 text-sm;
}

/* Horizontal rule */
:deep(.ProseMirror hr) {
  @apply border-t-2 border-gray-300 dark:border-gray-700 my-6;
}

/* Images */
:deep(.ProseMirror img) {
  @apply max-w-full h-auto rounded-lg my-4;
  display: block;
  position: relative;
  cursor: default;
}

:deep(.ProseMirror img.ProseMirror-selectednode) {
  @apply outline outline-4 outline-blue-400;
  cursor: nwse-resize;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

/* Image wrapper for custom node view */
:deep(.ProseMirror .image-wrapper) {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

:deep(.ProseMirror .image-wrapper.ProseMirror-selectednode) {
  outline: 4px solid rgb(59, 130, 246);
  outline-offset: 0;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  border-radius: 8px;
}

/* Resize handles */
:deep(.ProseMirror .resize-handle) {
  position: absolute;
  width: 12px;
  height: 12px;
  background: rgb(59, 130, 246);
  border: 2px solid white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: all;
  z-index: 10;
}

:deep(.ProseMirror .image-wrapper:hover .resize-handle),
:deep(.ProseMirror .image-wrapper.ProseMirror-selectednode .resize-handle) {
  opacity: 1;
}

:deep(.ProseMirror .resize-handle-bottom-right) {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
}

:deep(.ProseMirror .resize-handle-bottom-left) {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}

:deep(.ProseMirror .resize-handle-top-right) {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}

:deep(.ProseMirror .resize-handle-top-left) {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}

/* Placeholder - handled in template, not via CSS */

/* Mention styling */
:deep(.mention) {
  @apply inline-flex text-primary leading-4 bg-primary bg-opacity-10 rounded-sm px-1 py-0.5;
}

/* Text alignment */
:deep(.ProseMirror .text-left) {
  text-align: left;
}

:deep(.ProseMirror .text-center) {
  text-align: center;
}

:deep(.ProseMirror .text-right) {
  text-align: right;
}

/* Tables */
:deep(.ProseMirror table) {
  @apply border-collapse w-full my-4 text-gray-900 dark:text-gray-100;
  border: 1px solid rgb(var(--color-primary) / 0.3);
}

:deep(.ProseMirror th) {
  @apply font-bold px-3 py-2 border;
  text-align: left;
  background-color: rgba(var(--color-primary), 0.1);
  border-color: rgb(var(--color-primary) / 0.3);
}

:deep(.ProseMirror td) {
  @apply px-3 py-2 border border-gray-300 dark:border-gray-600;
}

:deep(.ProseMirror th p),
:deep(.ProseMirror td p) {
  @apply m-0;
}

/* Selected table cell */
:deep(.ProseMirror .selectedCell) {
  @apply bg-primary bg-opacity-10;
}

/* Task Lists */
:deep(.ProseMirror ul[data-type="taskList"]) {
  @apply list-none pl-0;
}

:deep(.ProseMirror ul[data-type="taskList"] li) {
  @apply flex items-start gap-2 mb-2;
}

:deep(.ProseMirror ul[data-type="taskList"] li > label) {
  @apply flex-none mt-1;
}

:deep(.ProseMirror ul[data-type="taskList"] li > div) {
  @apply flex-1;
}

:deep(.ProseMirror ul[data-type="taskList"] li input[type="checkbox"]) {
  @apply w-4 h-4 rounded border-gray-300 dark:border-gray-600 cursor-pointer;
  accent-color: rgb(var(--color-primary));
}

:deep(.ProseMirror ul[data-type="taskList"] li[data-checked="true"] > div) {
  @apply line-through text-gray-500 dark:text-gray-400;
}

/* Editor menu buttons */
#editor > button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

#editor > button:hover {
  @apply transform scale-105;
}

#editor > button:active {
  @apply transform scale-95;
}

/* Custom Emoji Images */
:deep(.ProseMirror img.inline-emoji),
:deep(.ProseMirror img.emoji),
.prose img.emoji {
  display: inline-block !important;
  width: 1.5em !important;
  height: 1.5em !important;
  vertical-align: middle !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  object-fit: contain;
}

/* Don't let emojis be resized like regular images */
:deep(.ProseMirror img.inline-emoji),
:deep(.ProseMirror img.emoji) {
  cursor: default !important;
}

:deep(.ProseMirror img.inline-emoji.ProseMirror-selectednode),
:deep(.ProseMirror img.emoji.ProseMirror-selectednode) {
  cursor: default !important;
  outline: 2px solid rgba(var(--color-primary), 0.5) !important;
  box-shadow: none !important;
}

/* Emoji styling in markdown mode - still show images */
.markdown-mode :deep(.ProseMirror img.inline-emoji),
.markdown-mode :deep(.ProseMirror img.emoji) {
  display: inline-block !important;
  width: 1.5em !important;
  height: 1.5em !important;
}

/* Spoiler text styling */
:deep(.ProseMirror .spoiler) {
  @apply cursor-pointer px-1 py-0.5 bg-gray-800 dark:bg-gray-600 text-gray-800 dark:text-gray-600 hover:text-white dark:hover:text-white transition-colors duration-200 rounded;
}

:deep(.ProseMirror .spoiler:hover) {
  @apply bg-gray-600 dark:bg-gray-400;
}

/* Spoiler text revealed state - when clicked or hovered */
:deep(.ProseMirror .spoiler.revealed),
:deep(.spoiler.revealed) {
  @apply bg-transparent text-current;
}

/* Superscript and subscript styling */
:deep(.ProseMirror sup) {
  @apply text-xs;
  vertical-align: super;
  line-height: 0;
}

:deep(.ProseMirror sub) {
  @apply text-xs;
  vertical-align: sub;
  line-height: 0;
}

</style>