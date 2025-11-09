><template>
  <div class="w-full flex flex-col" :style="{ height: props.height }">
    <!-- Mode Toggle Bar -->
    <div class="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 rounded-t-md">
      <button
        type="button"
        @click="isRichTextMode = !isRichTextMode"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm font-medium transition-colors"
        :class="isRichTextMode
          ? 'bg-primary text-white'
          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'"
        :title="isRichTextMode ? 'Switch to Markdown mode' : 'Switch to Rich Text mode'"
      >
        <!-- Rich Text Mode Icon: Paintbrush/Format -->
        <svg v-if="isRichTextMode" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path d="M3 21v-4a4 4 0 1 1 4 4h-4M21 3a16 16 0 0 0 -12.8 10.2M21 3a16 16 0 0 1 -10.2 12.8M10.6 9a9 9 0 0 1 4.4 4.4" />
        </svg>
        <!-- Markdown Mode Icon: M in box -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
          <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
          <path d="M7 15v-6l2 2l2 -2v6M14 13l2 2l2 -2m-2 2v-6" />
        </svg>
        {{ isRichTextMode ? 'Rich Text' : 'Markdown' }}
      </button>

      <!-- Expand/Collapse for Rich Text Mode -->
      <button
        v-if="isRichTextMode"
        type="button"
        @click="toolbarExpanded = !toolbarExpanded"
        class="px-2 py-1.5 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700"
        :title="toolbarExpanded ? 'Hide advanced formatting options' : 'Show advanced formatting options'"
      >
        {{ toolbarExpanded ? '▲ Hide Advanced' : '▼ More Options' }}
      </button>
    </div>

    <!-- Unified Editor Container -->
    <div class="relative flex flex-col flex-1 border dark:border-gray-700/70 rounded-b-md overflow-hidden transition-all duration-200 ease-in-out">
    <!-- Default Toolbar (Rich Text Mode - Always Visible) -->
    <div v-if="editor && isRichTextMode" class="flex flex-wrap items-center px-3 py-2 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
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
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleStrike().run()" :class="editor.isActive('strike') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Strikethrough">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <line x1="5" y1="12" x2="19" y2="12" /><path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5" />
          </svg>
        </button>
      </div>

      <!-- Divider -->
      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

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

      <!-- Divider -->
      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

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

      <!-- Divider -->
      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <!-- Text Color & Highlight -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
        <!-- Text Color Picker -->
        <div class="relative text-color-picker-container">
          <button type="button" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-600 text-xs font-bold relative transition-colors" :style="{ color: editor.getAttributes('textStyle').color || '#000000' }" @click="showTextColorPicker = !showTextColorPicker" title="Text color">
            A
            <span class="absolute bottom-1 left-1 right-1 h-0.5 rounded" :style="{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }"></span>
          </button>
          <!-- Color Picker Popover -->
          <div v-if="showTextColorPicker" class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 z-50 w-64">
            <div class="grid grid-cols-8 gap-1 mb-2">
              <button v-for="color in textColors" :key="color" type="button" class="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform" :style="`background-color: ${color}`" @click="setTextColor(color)"></button>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="customTextColor" type="color" class="w-full h-8 rounded cursor-pointer" @change="setTextColor(customTextColor)">
              <button type="button" @click="editor.chain().focus().unsetColor().run(); showTextColorPicker = false" class="button secondary px-2 py-1 text-xs whitespace-nowrap">Reset</button>
            </div>
          </div>
        </div>

        <!-- Highlight Color Picker -->
        <div class="relative highlight-color-picker-container">
          <button type="button" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-600 text-xs font-bold transition-colors" :style="{ backgroundColor: editor.isActive('highlight') ? (editor.getAttributes('highlight').color || '#FFEB3B') : 'transparent', color: editor.isActive('highlight') ? '#000' : 'currentColor' }" @click="showHighlightColorPicker = !showHighlightColorPicker" title="Highlight color">
            A
          </button>
          <!-- Highlight Picker Popover -->
          <div v-if="showHighlightColorPicker" class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 z-50 w-64">
            <div class="grid grid-cols-8 gap-1 mb-2">
              <button v-for="color in highlightColors" :key="color" type="button" class="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform" :style="`background-color: ${color}`" @click="setHighlightColor(color)"></button>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="customHighlightColor" type="color" class="w-full h-8 rounded cursor-pointer" @change="setHighlightColor(customHighlightColor)">
              <button type="button" @click="editor.chain().focus().unsetHighlight().run(); showHighlightColorPicker = false" class="button secondary px-2 py-1 text-xs whitespace-nowrap">Remove</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

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
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleOrderedList().run()" :class="editor.isActive('orderedList') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Ordered list">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <path d="M11 6h9M11 12h9M12 18h8M4 16a2 2 0 1 1 4 0c0 .591-.5 1-1 1.5l-3 2.5h4M6 10v-6l-2 2" />
          </svg>
        </button>
      </div>

      <!-- Divider -->
      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <!-- Block Elements -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleBlockquote().run()" :class="editor.isActive('blockquote') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Blockquote (Ctrl+Shift+B)">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <path d="M6 15h15M21 19h-15M15 11h6M21 7h-6M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
          </svg>
        </button>
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleCodeBlock().run()" :class="editor.isActive('codeBlock') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Code block (Ctrl+Alt+C)">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <polyline points="7 8 3 12 7 16"></polyline>
            <polyline points="17 8 21 12 17 16"></polyline>
            <line x1="14" y1="4" x2="10" y2="20"></line>
          </svg>
        </button>
      </div>

      <!-- Divider -->
      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <!-- Insert -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
        <button type="button" class="w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors" @click="setLink()" title="Insert link">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" />
          </svg>
        </button>
        <button type="button" class="w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors" @click="triggerFileUpload()" title="Upload image">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="3"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M4 15l4 -4c.7-.7 1.7-.7 2.5 0l5 5M14 14l1 -1c.7-.7 1.7-.7 2.5 0l2 2" />
          </svg>
        </button>
        <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="handleFileUpload" />
      </div>
    </div>

    <!-- Expandable Formatting Toolbar (Rich Text Mode Only - Advanced Features) -->
    <div v-if="editor && isRichTextMode && toolbarExpanded" class="flex flex-wrap items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
      <!-- Task List, HR & Clear Formatting -->
      <div class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
        <button type="button" class="w-8 h-8 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors" @click="editor.chain().focus().toggleTaskList().run()" :class="editor.isActive('taskList') ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600'" title="Task list">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="2"></rect>
            <path d="M9 14l2 2l4 -4"></path>
          </svg>
        </button>
        <span class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5"></span>
        <button type="button" class="w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors" @click="editor.chain().focus().setHorizontalRule().run()" title="Horizontal rule">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <span class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5"></span>
        <button type="button" class="w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors" @click="editor.chain().focus().clearNodes().unsetAllMarks().run()" title="Clear formatting">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <path d="M17 15l4 4m0 -4l-4 4M7 6v-1h11v1M7 19l4 0M13 5l-4 14" />
          </svg>
        </button>
      </div>

      <!-- Table Group (Rich Text Only) -->
      <div v-if="isRichTextMode" class="flex items-center gap-0.5 px-1.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
        <button type="button" class="w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors" @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()" title="Insert table">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="2"></rect>
            <line x1="4" y1="10" x2="20" y2="10"></line>
            <line x1="10" y1="4" x2="10" y2="20"></line>
          </svg>
        </button>
        <template v-if="editor.isActive('table')">
          <span class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5"></span>
          <!-- Add Column - vertical bars with + -->
          <button type="button" class="w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors" @click="editor.chain().focus().addColumnBefore().run()" title="Add column">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <rect x="4" y="4" width="6" height="16" rx="1"></rect>
              <rect x="14" y="4" width="6" height="16" rx="1"></rect>
              <path d="M12 8v8M8 12h8" stroke-width="2.5"></path>
            </svg>
          </button>
          <!-- Add Row - horizontal bars with + -->
          <button type="button" class="w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors" @click="editor.chain().focus().addRowBefore().run()" title="Add row">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <rect x="4" y="4" width="16" height="6" rx="1"></rect>
              <rect x="4" y="14" width="16" height="6" rx="1"></rect>
              <path d="M12 8v8M8 12h8" stroke-width="2.5"></path>
            </svg>
          </button>
          <span class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5"></span>
          <!-- Delete Column - vertical bar with X -->
          <button type="button" class="w-8 h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" @click="editor.chain().focus().deleteColumn().run()" title="Delete column">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <rect x="9" y="4" width="6" height="16" rx="1"></rect>
              <path d="M11 9l2 6M13 9l-2 6" stroke-width="2.5"></path>
            </svg>
          </button>
          <!-- Delete Row - horizontal bar with X -->
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

    </div>

    <!-- Main Content Area - Split View in Markdown Preview Mode -->
    <div class="relative flex" :class="!isRichTextMode && showPreview ? 'gap-2' : ''">
      <!-- Editor Container -->
      <div
        :class="[
          !isRichTextMode && showPreview ? 'w-1/2' : 'w-full',
          !isRichTextMode ? 'markdown-mode' : ''
        ]"
        class="relative flex flex-col flex-1"
        @drop.prevent="handleDrop"
        @dragover.prevent="handleDragOver"
        @dragenter.prevent="handleDragEnter"
        @dragleave.prevent="handleDragLeave"
      >
        <div v-if="isDragging" class="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded flex items-center justify-center z-20 pointer-events-none">
          <p class="text-primary font-semibold">Drop images here</p>
        </div>
        <!-- Rich Text Editor Content -->
        <editor-content v-if="isRichTextMode && editor" :editor="editor" class="flex-1" />

        <!-- Markdown Editor Content -->
        <div v-if="!isRichTextMode" class="relative flex flex-1 w-full">
          <!-- Markdown Textarea -->
          <div class="relative flex flex-col" :class="showPreview ? 'w-1/2' : 'w-full'">
            <textarea
              ref="markdownTextarea"
              v-model="markdownContent"
              :placeholder="placeholder"
              :disabled="disabled"
              class="block w-full flex-1 bg-gray-100 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-950 px-3 py-3 pb-12 shadow-inner-xs border-0 focus:ring-0 font-mono text-sm resize-none"
              style="min-height: 220px;"
              @input="handleMarkdownInput"
              @keydown="handleMarkdownKeydown"
              @click="handleMarkdownClick"
            />

            <!-- Markdown Mode: Unified Mention Dropdown -->
            <UnifiedMentionDropdown
              :user-suggestions="suggestions"
              :board-suggestions="boardSuggestions"
              :is-user-loading="mentionLoading"
              :is-board-loading="boardLoading"
              :is-visible="unifiedMentionVisible"
              :position="mentionVisible ? mentionPosition : boardPosition"
              :selected-index="mentionVisible ? mentionSelectedIndex : boardSelectedIndex"
              :current-type="currentMentionType"
              @select-user="insertUserMentionMarkdown"
              @select-board="insertBoardMentionMarkdown"
              @update-selection="updateMentionSelection"
            />

            <!-- Markdown Mode: Emoji Suggestions -->
            <EmojiSuggestions
              :suggestions="emojiSuggestions"
              :selected-index="emojiSelectedIndex"
              :is-visible="emojiVisible"
              :position="emojiPositionData"
              @select="insertEmojiSuggestionMarkdown"
            />
          </div>

          <!-- Markdown Preview -->
          <div
            v-if="showPreview"
            class="w-1/2 bg-white dark:bg-gray-950 overflow-auto p-4 border-l border-gray-300 dark:border-gray-600"
            style="min-height: 220px;"
          >
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Preview</div>
            <div v-if="markdownContent" class="prose dark:prose-invert prose-sm max-w-none" v-html="processedPreviewHTML"></div>
            <div v-else class="text-gray-400 italic text-sm">Nothing to preview yet...</div>
          </div>
        </div>

        <!-- Bottom Right Controls (Preview / Help / Emoji) -->
        <div class="absolute bottom-2 right-3 flex items-center gap-2 z-20">
          <!-- Preview Toggle (Markdown only) -->
          <button
            v-if="!isRichTextMode"
            type="button"
            @click="showPreview = !showPreview"
            class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            :class="showPreview ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-400'"
            :title="showPreview ? 'Hide preview' : 'Show preview'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <circle cx="12" cy="12" r="2" />
              <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
            </svg>
          </button>

          <!-- Help -->
          <button
            type="button"
            @click="toggleShortcutsModal"
            class="p-1.5 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Keyboard shortcuts"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="6" y1="8" x2="6.01" y2="8" />
              <line x1="10" y1="8" x2="10.01" y2="8" />
              <line x1="14" y1="8" x2="14.01" y2="8" />
              <line x1="18" y1="8" x2="18.01" y2="8" />
              <line x1="8" y1="12" x2="8.01" y2="12" />
              <line x1="12" y1="12" x2="12.01" y2="12" />
              <line x1="16" y1="12" x2="16.01" y2="12" />
              <line x1="7" y1="16" x2="17" y2="16" />
            </svg>
          </button>

          <!-- Emoji Picker -->
          <div class="flex items-center">
            <EmojiPicker @emoji-selected="insertEmoji" />
          </div>
        </div>

        <!-- Upload progress indicator -->
        <div v-if="uploading" class="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
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
      </div>

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
              ref="linkUrlInput"
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
  </Teleport>

  <!-- Keyboard Shortcuts Help Modal -->
  <Teleport to="body">
    <div
      v-if="showShortcutsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="toggleShortcutsModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
          <button
            type="button"
            @click="toggleShortcutsModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Text Formatting -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Text Formatting</h4>
            <div class="space-y-1">
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Bold</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+B</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Italic</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+I</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Strikethrough</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+Shift+S</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Clear formatting</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+\</kbd>
              </div>
            </div>
          </div>

          <!-- Paragraph Formatting -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Paragraph Formatting</h4>
            <div class="space-y-1">
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Heading 1</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+Alt+1</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Heading 2</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+Alt+2</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Heading 3</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+Alt+3</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Blockquote</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+Shift+B</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Code block</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+Alt+C</kbd>
              </div>
            </div>
          </div>

          <!-- Lists -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Lists</h4>
            <div class="space-y-1">
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Bullet list</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+Shift+8</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Ordered list</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+Shift+7</kbd>
              </div>
            </div>
          </div>

          <!-- Insert -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Insert</h4>
            <div class="space-y-1">
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Link</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+K</kbd>
              </div>
            </div>
          </div>

          <!-- Edit Actions -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Edit Actions</h4>
            <div class="space-y-1">
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Undo</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+Z</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Redo</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+Shift+Z or Ctrl+Y</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Select all</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+A</kbd>
              </div>
            </div>
          </div>

          <!-- Navigation & Other -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Other</h4>
            <div class="space-y-1">
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Show this help</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl+/</kbd>
              </div>
              <div class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">Close modal / dropdown</span>
                <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Esc</kbd>
              </div>
            </div>
          </div>

          <!-- Note about Mac -->
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              <strong>Note:</strong> On Mac, use <kbd class="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Cmd</kbd> instead of <kbd class="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">Ctrl</kbd>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  </div><!-- End Tiptap Wrapper -->
</template>

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
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import { Extension } from '@tiptap/core';
  import { Plugin, PluginKey } from '@tiptap/pm/state';
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
  const processedPreviewHTML = computed(() => {
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

    mentionPosition.value = {
      top: rect.top + top + 20,
      left: rect.left + left
    };

    boardPosition.value = {
      top: rect.top + top + 20,
      left: rect.left + left
    };
  };

  const updateMarkdownEmojiPosition = (textarea) => {
    if (!textarea) return;

    const { top, left } = getTextareaCaretPosition(textarea, textarea.selectionStart);
    const rect = textarea.getBoundingClientRect();

    emojiPositionData.value = {
      top: rect.top + top + 20,
      left: rect.left + left
    };
  };

  // Get caret position in textarea for positioning dropdowns
  const getTextareaCaretPosition = (textarea, caretPos) => {
    const div = document.createElement('div');
    const style = getComputedStyle(textarea);

    // Copy styling
    Array.from(style).forEach(prop => {
      div.style[prop] = style[prop];
    });

    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';

    // Create span at caret position
    const textBeforeCaret = textarea.value.substring(0, caretPos);
    const textNode = document.createTextNode(textBeforeCaret);
    const span = document.createElement('span');
    span.textContent = '|';

    div.appendChild(textNode);
    div.appendChild(span);
    document.body.appendChild(div);

    const rect = span.getBoundingClientRect();
    const divRect = div.getBoundingClientRect();

    const relativeTop = rect.top - divRect.top;
    const relativeLeft = rect.left - divRect.left;

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

/* Ensure editor content wrapper fills full height */
:deep(.editor-content) {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
}

:deep(.ProseMirror) {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
  min-height: 200px;
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

</style>