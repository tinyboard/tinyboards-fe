><template>
  <div class="relative flex flex-col bg-gray-100 dark:bg-gray-900 border dark:border-gray-700/70 focus:bg-white dark:focus:bg-gray-950 focus:ring-2 focus:border-primary focus:ring-primary rounded-md overflow-hidden" :style="[ccsProps, 'min-height:210px']">

    <!-- Placeholder -->
    <span class="z-10 absolute top-3 left-3 pointer-events-none text-gray-400">
      <span v-if="editor" v-show="editor.isEmpty">{{ placeholder }}</span>
      <span v-else>{{ placeholder }}</span>
    </span>

    <!-- Editor Container -->
    <div class="relative">
      <editor-content :editor="editor" :style="`min-height:170px`"/>
      <!-- Emoji Picker inside editor -->
      <div class="absolute bottom-3 right-3">
        <EmojiPicker @emoji-selected="insertEmoji" />
      </div>
    </div>

    <!-- Editor Menu Buttons -->
    <div v-if="editor" id="editor" class="hidden md:flex space-x-2 p-2 text-sm font-bold opacity-70 hover:opacity-100 bg-gray-100 border-t border-dashed">
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleBold().run()" :class="editor.isActive('bold') ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z"></path>
           <path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"></path>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleItalic().run()" :class="editor.isActive('italic') ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="11" y1="5" x2="17" y2="5"></line>
           <line x1="7" y1="19" x2="13" y2="19"></line>
           <line x1="14" y1="5" x2="10" y2="19"></line>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleStrike().run()" :class="editor.isActive('strike') ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-200'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="5" y1="12" x2="19" y2="12"></line>
           <path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5"></path>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-300"></span>
      <button type="button" class="w-7 h-7 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded" @click="setLink()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path>
           <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path>
        </svg>
      </button>
      <button type="button" class="w-7 h-7 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded" @click="addImage()">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <line x1="15" y1="8" x2="15.01" y2="8"></line>
           <rect x="4" y="4" width="16" height="16" rx="3"></rect>
           <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5"></path>
           <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2"></path>
        </svg>
      </button>
      <!-- Divider -->
      <span class="border-r border-gray-300"></span>
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleBulletList().run()" :class="editor.isActive('bulletList') ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-200'">
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
      <button type="button" class="w-7 h-7 hover:text-gray-700 rounded" @click="editor.chain().focus().toggleOrderedList().run()" :class="editor.isActive('OrderedList') ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-200'">
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
      <span class="border-r border-gray-300"></span>
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

  import Link from '@tiptap/extension-link';
  import Image from '@tiptap/extension-image';
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import EmojiPicker from './EmojiPicker.vue';

  const editor = useEditor({
    // enablePasteRules: false, // disable Markdown when pasting
    // enableInputRules: false, // disable Markdown when typing
    extensions: [
      Link,
      Image,
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