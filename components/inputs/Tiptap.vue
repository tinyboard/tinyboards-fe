><template>
  <div class="relative flex flex-col bg-gray-100 dark:bg-gray-900 border dark:border-gray-700/70 focus:bg-white dark:focus:bg-gray-950 focus:ring-2 focus:border-primary focus:ring-primary rounded-md overflow-hidden" :style="[ccsProps, 'min-height:210px']">

    <!-- Placeholder -->
    <span class="z-10 absolute top-3 left-3 pointer-events-none text-gray-400">
      <span v-if="editor" v-show="editor.isEmpty">{{ placeholder }}</span>
      <span v-else>{{ placeholder }}</span>
    </span>

    <!-- Editor Container -->
    <div
      v-show="!showPreview"
      class="relative"
      @drop.prevent="handleDrop"
      @dragover.prevent
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
    >
      <div v-if="isDragging" class="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded flex items-center justify-center z-20">
        <p class="text-primary font-semibold">Drop images here</p>
      </div>
      <editor-content :editor="editor" :style="`min-height:170px`"/>
      <!-- Emoji Picker inside editor -->
      <div class="absolute bottom-3 right-3">
        <EmojiPicker @emoji-selected="insertEmoji" />
      </div>
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

    <!-- Editor Menu Buttons -->
    <div v-if="editor" id="editor" class="hidden md:flex flex-wrap gap-1 p-2 text-sm font-bold opacity-70 hover:opacity-100 bg-gray-100 border-t border-dashed">
      <!-- Headings -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded text-xs font-bold" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="editor.isActive('heading', { level: 1 }) ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        H1
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded text-xs font-bold" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="editor.isActive('heading', { level: 2 }) ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        H2
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded text-xs font-bold" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="editor.isActive('heading', { level: 3 }) ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        H3
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-300 mx-1"></span>
      <!-- Text Formatting -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleBold().run()" :class="editor.isActive('bold') ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z"></path>
           <path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"></path>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleItalic().run()" :class="editor.isActive('italic') ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="11" y1="5" x2="17" y2="5"></line>
           <line x1="7" y1="19" x2="13" y2="19"></line>
           <line x1="14" y1="5" x2="10" y2="19"></line>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleStrike().run()" :class="editor.isActive('strike') ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="5" y1="12" x2="19" y2="12"></line>
           <path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5"></path>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-300 mx-1"></span>
      <button type="button" class="w-7 h-7 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded" @click="setLink()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path>
           <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded" @click="triggerFileUpload()">
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
      <span class="border-r border-gray-300 mx-1"></span>
      <!-- Blockquote -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleBlockquote().run()" :class="editor.isActive('blockquote') ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
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
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleCodeBlock().run()" :class="editor.isActive('codeBlock') ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <polyline points="7 8 3 12 7 16"></polyline>
           <polyline points="17 8 21 12 17 16"></polyline>
           <line x1="14" y1="4" x2="10" y2="20"></line>
        </svg>
      </button>
      <!-- Horizontal Rule -->
      <button type="button" class="w-7 h-7 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded" @click="editor.chain().focus().setHorizontalRule().run()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-300 mx-1"></span>
      <!-- Lists -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleBulletList().run()" :class="editor.isActive('bulletList') ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="9" y1="6" x2="20" y2="6"></line>
           <line x1="9" y1="12" x2="20" y2="12"></line>
           <line x1="9" y1="18" x2="20" y2="18"></line>
           <line x1="5" y1="6" x2="5" y2="6.01"></line>
           <line x1="5" y1="12" x2="5" y2="12.01"></line>
           <line x1="5" y1="18" x2="5" y2="18.01"></line>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleOrderedList().run()" :class="editor.isActive('orderedList') ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
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
      <span class="border-r border-gray-300 mx-1"></span>
      <!-- Text Alignment -->
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().setTextAlign('left').run()" :class="editor.isActive({ textAlign: 'left' }) ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="4" y1="6" x2="20" y2="6"></line>
           <line x1="4" y1="12" x2="14" y2="12"></line>
           <line x1="4" y1="18" x2="18" y2="18"></line>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().setTextAlign('center').run()" :class="editor.isActive({ textAlign: 'center' }) ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="4" y1="6" x2="20" y2="6"></line>
           <line x1="8" y1="12" x2="16" y2="12"></line>
           <line x1="6" y1="18" x2="18" y2="18"></line>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().setTextAlign('right').run()" :class="editor.isActive({ textAlign: 'right' }) ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="4" y1="6" x2="20" y2="6"></line>
           <line x1="10" y1="12" x2="20" y2="12"></line>
           <line x1="6" y1="18" x2="20" y2="18"></line>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-300 mx-1"></span>
      <!-- Text Color -->
      <input
        type="color"
        @input="editor.chain().focus().setColor($event.target.value).run()"
        :value="editor.getAttributes('textStyle').color || '#000000'"
        class="w-7 h-7 rounded cursor-pointer border border-gray-300"
        title="Text color"
      />
      <!-- Highlight -->
      <input
        type="color"
        @input="editor.chain().focus().toggleHighlight({ color: $event.target.value }).run()"
        class="w-7 h-7 rounded cursor-pointer border border-gray-300"
        title="Highlight color"
      />
      <!-- Divider -->
      <span class="border-r border-gray-300 mx-1"></span>
      <button type="button" class="w-7 h-7 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded" @click="editor.chain().focus().undo().run()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded" @click="editor.chain().focus().redo().run()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M15 13l4 -4l-4 -4m4 4h-11a4 4 0 0 0 0 8h1"></path>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-300 mx-1"></span>
      <!-- Preview Toggle -->
      <button type="button" class="px-3 h-7 hover:text-gray-700 rounded text-xs font-semibold" @click="showPreview = !showPreview" :class="showPreview ? 'text-gray-900 bg-gray-200' : 'text-gray-500 hover:bg-gray-200'">
        <svg v-if="!showPreview" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <circle cx="12" cy="12" r="2"></circle>
           <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
           <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
           <path d="M16 5l3 3"></path>
        </svg>
        {{ showPreview ? 'Edit' : 'Preview' }}
      </button>
    </div>

    <!-- Fake bar while loading -->
    <div v-else class="hidden md:block bg-gray-100 border-t border-dashed h-[45px]"></div>
  </div>
</template>

<script setup>
  const props = defineProps({
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
    }
  });

  import { ref } from 'vue';
  import { Link } from '@tiptap/extension-link';
  import { Image } from '@tiptap/extension-image';
  import { TextAlign } from '@tiptap/extension-text-align';
  import { TextStyle } from '@tiptap/extension-text-style';
  import { Color } from '@tiptap/extension-color';
  import { Highlight } from '@tiptap/extension-highlight';
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import EmojiPicker from './EmojiPicker.vue';

  // Preview toggle state
  const showPreview = ref(false);

  const editor = useEditor({
    // enablePasteRules: false, // disable Markdown when pasting
    // enableInputRules: false, // disable Markdown when typing
    extensions: [
      Link,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true
      }),
      StarterKit
    ]
  });

  const setLink = () => {
      const previousUrl = editor.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()

        return
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }

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
      const response = await fetch('/api/v2/graphql', {
        method: 'POST',
        body: formData,
        credentials: 'include'
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
  @apply bg-gray-100 focus:bg-white dark:bg-gray-900 dark:focus:bg-gray-900 text-lg sm:text-base px-3 py-2 shadow-inner-xs;
}

:deep(.ProseMirror:focus) {
  outline: none;
}

:deep(.ProseMirror>*+*) {
  margin-top: 0.75em;
}

:deep(.mention) {
  @apply inline-flex text-primary leading-4 bg-primary bg-opacity-10 rounded-sm px-1 py-0.5
}

:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
};

:deep(.ProseMirror img.ProseMirror-selectednode) {
  outline: 3px solid #7DD3FC;
}

#editor > button {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>