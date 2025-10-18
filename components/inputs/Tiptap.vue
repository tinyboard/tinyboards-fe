><template>
  <div class="relative flex flex-col bg-gray-100 dark:bg-gray-900 border dark:border-gray-700/70 focus:bg-white dark:focus:bg-gray-950 focus:ring-2 focus:border-primary focus:ring-primary rounded-md overflow-hidden" :style="[ccsProps, 'min-height:210px']">

    <!-- Editor Menu Buttons (moved to top) -->
    <div v-if="editor" id="editor" class="flex flex-wrap items-center gap-1 p-2 text-sm font-bold bg-gray-200 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600">
      <!-- Headings -->
      <button type="button" class="w-7 h-7 hover:text-gray-900 dark:hover:text-gray-100 rounded text-xs font-bold" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="editor.isActive('heading', { level: 1 }) ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        H1
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-900 dark:hover:text-gray-100 rounded text-xs font-bold" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="editor.isActive('heading', { level: 2 }) ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        H2
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-900 dark:hover:text-gray-100 rounded text-xs font-bold" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="editor.isActive('heading', { level: 3 }) ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        H3
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-400 dark:border-gray-600 mx-1"></span>
      <!-- Text Formatting -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleBold().run()" :class="editor.isActive('bold') ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z"></path>
           <path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"></path>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleItalic().run()" :class="editor.isActive('italic') ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="11" y1="5" x2="17" y2="5"></line>
           <line x1="7" y1="19" x2="13" y2="19"></line>
           <line x1="14" y1="5" x2="10" y2="19"></line>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleStrike().run()" :class="editor.isActive('strike') ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="5" y1="12" x2="19" y2="12"></line>
           <path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5"></path>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-400 dark:border-gray-600 mx-1"></span>
      <button type="button" class="w-7 h-7 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded" @click="setLink()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path>
           <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded" @click="triggerFileUpload()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="15" y1="8" x2="15.01" y2="8"></line>
           <rect x="4" y="4" width="16" height="16" rx="3"></rect>
           <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5"></path>
           <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2"></path>
        </svg>
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileUpload"
      />
      <!-- Divider -->
      <span class="border-r border-gray-400 dark:border-gray-600 mx-1"></span>
      <!-- Blockquote -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleBlockquote().run()" :class="editor.isActive('blockquote') ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M6 15h15"></path>
           <path d="M21 19h-15"></path>
           <path d="M15 11h6"></path>
           <path d="M21 7h-6"></path>
           <path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2"></path>
           <path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2"></path>
        </svg>
      </button>
      <!-- Code Block -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleCodeBlock().run()" :class="editor.isActive('codeBlock') ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <polyline points="7 8 3 12 7 16"></polyline>
           <polyline points="17 8 21 12 17 16"></polyline>
           <line x1="14" y1="4" x2="10" y2="20"></line>
        </svg>
      </button>
      <!-- Horizontal Rule -->
      <button type="button" class="w-7 h-7 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded" @click="editor.chain().focus().setHorizontalRule().run()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-400 dark:border-gray-600 mx-1"></span>
      <!-- Lists -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleBulletList().run()" :class="editor.isActive('bulletList') ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="9" y1="6" x2="20" y2="6" stroke="currentColor" stroke-width="2"></line>
           <line x1="9" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2"></line>
           <line x1="9" y1="18" x2="20" y2="18" stroke="currentColor" stroke-width="2"></line>
           <circle cx="5" cy="6" r="1.5" fill="currentColor"></circle>
           <circle cx="5" cy="12" r="1.5" fill="currentColor"></circle>
           <circle cx="5" cy="18" r="1.5" fill="currentColor"></circle>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleOrderedList().run()" :class="editor.isActive('orderedList') ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M11 6h9"></path>
           <path d="M11 12h9"></path>
           <path d="M12 18h8"></path>
           <path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4"></path>
           <path d="M6 10v-6l-2 2"></path>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-400 dark:border-gray-600 mx-1"></span>
      <!-- Text Alignment -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().setTextAlign('left').run()" :class="editor.isActive({ textAlign: 'left' }) ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="4" y1="6" x2="20" y2="6"></line>
           <line x1="4" y1="12" x2="14" y2="12"></line>
           <line x1="4" y1="18" x2="18" y2="18"></line>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().setTextAlign('center').run()" :class="editor.isActive({ textAlign: 'center' }) ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="4" y1="6" x2="20" y2="6"></line>
           <line x1="8" y1="12" x2="16" y2="12"></line>
           <line x1="6" y1="18" x2="18" y2="18"></line>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().setTextAlign('right').run()" :class="editor.isActive({ textAlign: 'right' }) ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="4" y1="6" x2="20" y2="6"></line>
           <line x1="10" y1="12" x2="20" y2="12"></line>
           <line x1="6" y1="18" x2="20" y2="18"></line>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-400 dark:border-gray-600 mx-1"></span>
      <!-- Text Color -->
      <div class="relative">
        <input
          ref="textColorInput"
          type="color"
          @input="editor.chain().focus().setColor($event.target.value).run()"
          :value="editor.getAttributes('textStyle').color || '#000000'"
          class="absolute opacity-0 w-0 h-0"
        />
        <button
          type="button"
          @click="$refs.textColorInput.click()"
          class="w-7 h-7 flex items-center justify-center rounded border border-gray-400 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 text-xs font-bold"
          :style="{ color: editor.getAttributes('textStyle').color || '#000000' }"
          title="Text color"
        >
          A
        </button>
      </div>
      <!-- Highlight Color -->
      <div class="relative">
        <input
          ref="highlightColorInput"
          type="color"
          @input="editor.chain().focus().toggleHighlight({ color: $event.target.value }).run()"
          class="absolute opacity-0 w-0 h-0"
        />
        <button
          type="button"
          @click="$refs.highlightColorInput.click()"
          class="w-7 h-7 flex items-center justify-center rounded border border-gray-400 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 text-xs font-bold text-gray-900 dark:text-white"
          :style="{ backgroundColor: editor.isActive('highlight') ? (editor.getAttributes('highlight').color || '#ffff00') : 'transparent' }"
          title="Highlight color"
        >
          A
        </button>
      </div>
      <!-- Divider -->
      <span class="border-r border-gray-400 dark:border-gray-600 mx-1"></span>
      <!-- Emoji Picker -->
      <EmojiPicker @emoji-selected="insertEmoji" />
      <!-- Divider -->
      <span class="border-r border-gray-400 dark:border-gray-600 mx-1"></span>
      <button type="button" class="w-7 h-7 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded" @click="editor.chain().focus().undo().run()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded" @click="editor.chain().focus().redo().run()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M15 13l4 -4l-4 -4m4 4h-11a4 4 0 0 0 0 8h1"></path>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-400 dark:border-gray-600 mx-1"></span>
      <!-- Preview Toggle -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="showPreview = !showPreview" :class="showPreview ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'" :title="showPreview ? 'Edit' : 'Preview'">
        <svg v-if="!showPreview" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <circle cx="12" cy="12" r="2"></circle>
           <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
           <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
           <path d="M16 5l3 3"></path>
        </svg>
      </button>
    </div>

    <!-- Fake bar while loading -->
    <div v-else class="bg-gray-200 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600 h-[45px]"></div>

    <!-- Placeholder -->
    <span v-if="isEditorEmpty" class="z-10 absolute top-[53px] left-3 pointer-events-none text-gray-400">
      {{ placeholder }}
    </span>

    <!-- Editor Container -->
    <div
      v-show="!showPreview"
      class="relative"
      @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
    >
      <div v-if="isDragging" class="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded flex items-center justify-center z-20 pointer-events-none">
        <p class="text-primary font-semibold">Drop images here</p>
      </div>
      <editor-content :editor="editor" :style="`min-height:170px`"/>
      <!-- Upload progress indicator -->
      <div v-if="uploading" class="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">Uploading {{ uploadProgress }}/{{ uploadTotal }} images...</p>
      </div>
    </div>

    <!-- Preview Container -->
    <div v-show="showPreview" class="relative min-h-[170px] p-3 overflow-auto">
      <div v-if="editor && editor.getHTML()" class="prose dark:prose-invert prose-sm max-w-none" v-html="editor.getHTML()"></div>
      <div v-else class="text-gray-400 italic">Nothing to preview yet...</div>
    </div>
  </div>

  <!-- Link Modal -->
  <Teleport to="body">
    <div
      v-if="showLinkModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="cancelLink"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Insert Link</h3>

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
  </Teleport>
</template>

<script setup>
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

  import { ref, watch, computed } from 'vue';
  import { Link } from '@tiptap/extension-link';
  import { Image } from '@tiptap/extension-image';
  import { TextAlign } from '@tiptap/extension-text-align';
  import { TextStyle } from '@tiptap/extension-text-style';
  import { Color } from '@tiptap/extension-color';
  import { Highlight } from '@tiptap/extension-highlight';
  import { Underline } from '@tiptap/extension-underline';
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import EmojiPicker from './EmojiPicker.vue';

  // Preview toggle state
  const showPreview = ref(false);

  // Track editor empty state for placeholder
  const isEditorEmpty = ref(true);

  // Link modal state
  const showLinkModal = ref(false);
  const linkUrl = ref('');
  const linkText = ref('');

  const editor = useEditor({
    content: props.modelValue || '',
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        italic: true,
        bold: true,
        strike: true
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
          class: 'max-w-full h-auto rounded cursor-move'
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
          }
        },
      }),
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
      Underline
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none'
      }
    },
    onCreate: ({ editor }) => {
      // Emit initial content
      emit('update:modelValue', editor.getHTML());
      isEditorEmpty.value = editor.isEmpty;

      // Add image resize handler
      setupImageResize(editor);
    },
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getHTML());
      isEditorEmpty.value = editor.isEmpty;
    }
  });

  // Image resize functionality
  const setupImageResize = (editor) => {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;
    let currentImage = null;
    let currentPos = null;

    const handleMouseDown = (e) => {
      const img = e.target;
      if (img.tagName === 'IMG' && img.classList.contains('ProseMirror-selectednode')) {
        e.preventDefault();
        e.stopPropagation();

        isResizing = true;
        startX = e.clientX;
        startWidth = img.width || img.naturalWidth;
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

  // Watch for external changes to modelValue
  watch(() => props.modelValue, (newValue) => {
    const isSame = editor.value?.getHTML() === newValue;
    if (!isSame && editor.value) {
      editor.value.commands.setContent(newValue, false);
      isEditorEmpty.value = editor.value.isEmpty;
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

      const result = await response.json()
      if (result.errors) {
        throw new Error(result.errors[0].message)
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

    for (const file of files) {
      try {
        const url = await uploadFile(file)

        // Insert image into editor at cursor position
        editor.value?.chain().focus().setImage({ src: url }).run()

        uploadProgress.value++
      } catch (error) {
        console.error('Failed to upload file:', error)
        // Continue with other files even if one fails
        uploadProgress.value++
      }
    }

    uploading.value = false
  }
</script>

<style scoped>

:deep(.ProseMirror) {
  min-height: 170px;
  @apply bg-gray-100 focus:bg-white dark:bg-gray-900 dark:focus:bg-gray-950 px-3 py-3 shadow-inner-xs;
}

:deep(.ProseMirror:focus) {
  outline: none;
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

:deep(.ProseMirror ol) {
  @apply list-decimal pl-6 mb-3 text-gray-900 dark:text-gray-100;
}

:deep(.ProseMirror li) {
  @apply mb-1;
}

/* Blockquotes */
:deep(.ProseMirror blockquote) {
  @apply border-l-4 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300;
  border-left-color: rgb(var(--color-primary));
  background-color: rgba(var(--color-primary), 0.05);
}

:deep(.ProseMirror blockquote a.quote-link) {
  @apply not-italic font-semibold no-underline;
  color: rgb(var(--color-primary));
}

:deep(.ProseMirror blockquote a.quote-link:hover) {
  @apply underline;
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

</style>