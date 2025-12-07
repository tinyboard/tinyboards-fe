<template>
  <div class="tiptap-richtext relative h-full w-full">
    <!-- TipTap Editor -->
    <EditorContent :editor="editor" class="tiptap-editor h-full w-full" />

    <!-- Emoji Suggestions -->
    <SuggestionDropdown
      :visible="emojiState.isVisible"
      :items="emojiState.suggestions"
      :position="emojiPosition"
      :selected-index="emojiState.selectedIndex"
      title="Emoji suggestions"
      @select="handleEmojiSelect"
    >
      <template #item="{ item }">
        <img
          :src="item.imageUrl"
          :alt="item.altText"
          class="w-5 h-5 mr-2 object-contain"
        />
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm truncate">:{{ item.shortcode }}:</div>
          <div class="text-xs opacity-75 truncate">{{ item.altText }}</div>
        </div>
      </template>
    </SuggestionDropdown>

    <!-- User Mention Suggestions -->
    <SuggestionDropdown
      v-if="mentionState.isVisible && mentionType === 'user'"
      :visible="mentionState.isVisible"
      :items="mentionState.suggestions"
      :position="mentionPosition"
      :selected-index="mentionState.selectedIndex"
      title="User suggestions"
      :display-key="(user: any) => `@${user.name}`"
      @select="handleMentionSelect"
    />

    <!-- Board Mention Suggestions -->
    <SuggestionDropdown
      v-if="boardState.isVisible && mentionType === 'board'"
      :visible="boardState.isVisible"
      :items="boardState.suggestions"
      :position="mentionPosition"
      :selected-index="boardState.selectedIndex"
      title="Board suggestions"
      :display-key="(board: any) => `b/${board.name}`"
      @select="handleBoardSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { useEmojiSuggestionsRefactored } from '@/composables/suggestions/useEmojiSuggestionsRefactored'
import { useSuggestionCore } from '@/composables/suggestions/useSuggestionCore'
import { getTipTapCursorPosition, calculateDropdownPosition } from '@/composables/positioning/useCursorPosition'
import SuggestionDropdown from './suggestions/SuggestionDropdown.vue'

const props = defineProps<{
  modelValue: string
  boardId?: number
  placeholder?: string
  minHeight?: string
  height?: string
}>()

const emit = defineEmits(['update:modelValue', 'editor-ready'])

const mentionType = ref<'user' | 'board' | null>(null)

// Emoji suggestions
const {
  state: emojiState,
  search: searchEmoji,
  hide: hideEmoji,
  handleKeydown: handleEmojiKeydown
} = useEmojiSuggestionsRefactored(props.boardId)

// User mention suggestions
const searchUsers = async (query: string) => {
  try {
    const gqlQuery = `
      query SearchUsernames($query: String!, $limit: Int) {
        searchUsernames(query: $query, limit: $limit)
      }
    `
    const { data } = await useGraphQLQuery(gqlQuery, { variables: { query, limit: 5 } })
    const usernames = data.value?.searchUsernames || []
    // Convert strings to objects for the suggestion dropdown
    return usernames.map((name: string) => ({ id: name, name }))
  } catch {
    return []
  }
}

const {
  state: mentionState,
  search: searchMention,
  hide: hideMention,
  handleKeydown: handleMentionKeydown
} = useSuggestionCore(searchUsers, { minQueryLength: 0 })

// Board mention suggestions
const searchBoards = async (query: string) => {
  try {
    const gqlQuery = `
      query ListBoards($searchTerm: String, $limit: Int) {
        listBoards(searchTerm: $searchTerm, limit: $limit) {
          id
          name
          description
        }
      }
    `
    const { data } = await useGraphQLQuery(gqlQuery, { variables: { searchTerm: query, limit: 5 } })
    return data.value?.listBoards || []
  } catch {
    return []
  }
}

const {
  state: boardState,
  search: searchBoard,
  hide: hideBoard,
  handleKeydown: handleBoardKeydown
} = useSuggestionCore(searchBoards, { minQueryLength: 0 })

// TipTap Editor initialization
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6]
      }
    }),
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: 'highlighted'
      }
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'tiptap-table'
      }
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: 'tiptap-table-row'
      }
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: 'tiptap-table-cell'
      }
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: 'tiptap-table-header'
      }
    }),
    Link.extend({ name: 'customLink' }).configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary hover:underline'
      }
    }),
    Image.extend({ name: 'customImage' }).configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto'
      }
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert max-w-none focus:outline-none p-4 bg-transparent h-full w-full',
    },
    handleKeyDown: (view, event) => {
      // Handle suggestion navigation
      if (emojiState.isVisible) {
        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault()
          handleEmojiSelect(emojiState.selectedIndex)
          return true
        }
        if (handleEmojiKeydown(event)) {
          return true
        }
      }

      if (mentionState.isVisible) {
        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault()
          handleMentionSelect(mentionState.selectedIndex)
          return true
        }
        if (handleMentionKeydown(event)) {
          return true
        }
      }

      if (boardState.isVisible) {
        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault()
          handleBoardSelect(boardState.selectedIndex)
          return true
        }
        if (handleBoardKeydown(event)) {
          return true
        }
      }

      return false
    }
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)

    // Check for triggers
    checkForTriggers()
  }
})

// Emit editor when ready
onMounted(() => {
  if (editor.value) {
    emit('editor-ready', editor.value)
  }
})

// Calculate positions
const emojiPosition = computed(() => {
  if (!emojiState.isVisible || !editor.value) return { top: 0, left: 0 }
  const cursorPos = getTipTapCursorPosition(editor.value)
  if (!cursorPos) return { top: 0, left: 0 }
  return calculateDropdownPosition(cursorPos)
})

const mentionPosition = computed(() => {
  const state = mentionType.value === 'user' ? mentionState : boardState
  if (!state.isVisible || !editor.value) return { top: 0, left: 0 }
  const cursorPos = getTipTapCursorPosition(editor.value)
  if (!cursorPos) return { top: 0, left: 0 }
  return calculateDropdownPosition(cursorPos)
})

// Trigger detection
const checkForTriggers = () => {
  if (!editor.value) return

  const { state } = editor.value
  const { from } = state.selection
  const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, '\n', ' ')

  // Check for emoji trigger
  const emojiMatch = textBefore.match(/:([a-zA-Z0-9_+-]*)$/)
  if (emojiMatch && emojiMatch[1].length >= 1) {
    searchEmoji(emojiMatch[1], from - emojiMatch[0].length)
    hideMention()
    hideBoard()
    return
  } else {
    hideEmoji()
  }

  // Check for user mention
  const userMatch = textBefore.match(/@([a-zA-Z0-9_]*)$/)
  if (userMatch) {
    mentionType.value = 'user'
    searchMention(userMatch[1], from - userMatch[0].length)
    hideBoard()
    return
  }

  // Check for board mention
  const boardMatch = textBefore.match(/b\/([a-zA-Z0-9_]*)$/)
  if (boardMatch) {
    mentionType.value = 'board'
    searchBoard(boardMatch[1], from - boardMatch[0].length)
    hideMention()
    return
  }

  // No matches
  hideMention()
  hideBoard()
  mentionType.value = null
}

// Selection handlers
const handleEmojiSelect = (index: number) => {
  if (!editor.value) return

  const emoji = emojiState.suggestions[index]
  if (!emoji) return

  const { state, view } = editor.value
  const { from } = state.selection

  // Find the start of the emoji trigger
  const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, '\n', ' ')
  const match = textBefore.match(/:([a-zA-Z0-9_+-]*)$/)
  if (!match) return

  const startPos = from - match[0].length
  const endPos = from

  // Replace with emoji shortcode
  const transaction = state.tr.insertText(`:${emoji.shortcode}:`, startPos, endPos)
  view.dispatch(transaction)

  hideEmoji()
  editor.value.commands.focus()
}

const handleMentionSelect = (index: number) => {
  if (!editor.value) return

  const user = mentionState.suggestions[index]
  if (!user) return

  const { state, view } = editor.value
  const { from } = state.selection

  // Find the start of the mention trigger
  const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, '\n', ' ')
  const match = textBefore.match(/@([a-zA-Z0-9_]*)$/)
  if (!match) return

  const startPos = from - match[0].length
  const endPos = from

  // Insert plain text mention
  const transaction = state.tr.insertText(`@${user.name}`, startPos, endPos)
  view.dispatch(transaction)

  hideMention()
  editor.value.commands.focus()
}

const handleBoardSelect = (index: number) => {
  if (!editor.value) return

  const board = boardState.suggestions[index]
  if (!board) return

  const { state, view } = editor.value
  const { from } = state.selection

  // Find the start of the board mention trigger
  const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, '\n', ' ')
  const match = textBefore.match(/b\/([a-zA-Z0-9_]*)$/)
  if (!match) return

  const startPos = from - match[0].length
  const endPos = from

  // Insert plain text board mention
  const transaction = state.tr.insertText(`b/${board.name}`, startPos, endPos)
  view.dispatch(transaction)

  hideBoard()
  editor.value.commands.focus()
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (!editor.value) return
  const currentValue = editor.value.getHTML()
  if (newValue !== currentValue) {
    editor.value.commands.setContent(newValue)
  }
})

// Cleanup
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.tiptap-editor .ProseMirror {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

.tiptap-editor .ProseMirror:focus {
  outline: none;
}

/* Emoji rendering */
.tiptap-editor img.emoji {
  display: inline-block;
  width: 1.25em;
  height: 1.25em;
  margin: 0 0.05em 0 0.1em;
  vertical-align: -0.1em;
  object-fit: contain;
}

/* Table styling */
.tiptap-editor table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

.tiptap-editor table td,
.tiptap-editor table th {
  border: 1px solid rgb(var(--color-gray-300));
  padding: 0.5rem;
}

.dark .tiptap-editor table td,
.dark .tiptap-editor table th {
  border-color: rgb(var(--color-gray-700));
}

.tiptap-editor table th {
  background-color: rgb(var(--color-gray-100));
  font-weight: 600;
}

.dark .tiptap-editor table th {
  background-color: rgb(var(--color-gray-800));
}
</style>
