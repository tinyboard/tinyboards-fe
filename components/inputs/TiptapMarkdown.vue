<template>
  <div class="tiptap-markdown relative h-full">
    <!-- Markdown Textarea -->
    <textarea
      ref="textareaRef"
      v-model="content"
      @input="handleInput"
      @keydown="handleKeydown"
      @click="handleClick"
      :placeholder="placeholder"
      class="w-full h-full p-4 bg-transparent border-none focus:ring-0 focus:outline-none resize-none"
    />

    <!-- Preview (if enabled) -->
    <div v-if="showPreview" class="mt-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded">
      <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview</div>
      <div v-html="renderedMarkdown" class="prose dark:prose-invert max-w-none"></div>
    </div>

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
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import { useEmojiSuggestionsRefactored } from '@/composables/suggestions/useEmojiSuggestionsRefactored'
import { useSuggestionCore } from '@/composables/suggestions/useSuggestionCore'
import { getTextareaCursorPosition, calculateDropdownPosition } from '@/composables/positioning/useCursorPosition'
import SuggestionDropdown from './suggestions/SuggestionDropdown.vue'

const props = defineProps<{
  modelValue: string
  boardId?: number
  placeholder?: string
  minHeight?: string
  height?: string
  showPreview?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const textareaRef = ref<HTMLTextAreaElement>()
const content = ref(props.modelValue)
const mentionType = ref<'user' | 'board' | null>(null)

// Emoji suggestions
const {
  state: emojiState,
  search: searchEmoji,
  hide: hideEmoji,
  selectCurrent: selectCurrentEmoji,
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
  selectCurrent: selectCurrentMention,
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
  selectCurrent: selectCurrentBoard,
  handleKeydown: handleBoardKeydown
} = useSuggestionCore(searchBoards, { minQueryLength: 0 })

// Calculate positions
const emojiPosition = computed(() => {
  if (!emojiState.isVisible || !textareaRef.value) return { top: 0, left: 0 }
  const cursorPos = getTextareaCursorPosition(textareaRef.value, textareaRef.value.selectionStart)
  return calculateDropdownPosition(cursorPos)
})

const mentionPosition = computed(() => {
  const state = mentionType.value === 'user' ? mentionState : boardState
  if (!state.isVisible || !textareaRef.value) return { top: 0, left: 0 }
  const cursorPos = getTextareaCursorPosition(textareaRef.value, textareaRef.value.selectionStart)
  return calculateDropdownPosition(cursorPos)
})

// Markdown rendering
const renderedMarkdown = computed(() => {
  if (!content.value) return ''
  try {
    return marked.parse(content.value)
  } catch (error) {
    console.error('Markdown parsing error:', error)
    return content.value
  }
})

// Input handling
const handleInput = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  const text = textarea.value
  const cursorPos = textarea.selectionStart

  checkForEmoji(text, cursorPos)
  checkForMentions(text, cursorPos)

  emit('update:modelValue', text)
}

const checkForEmoji = (text: string, cursorPos: number) => {
  const textBefore = text.substring(0, cursorPos)
  const match = textBefore.match(/:([a-zA-Z0-9_+-]*)$/)

  if (match && match[1].length >= 1) {
    searchEmoji(match[1], cursorPos - match[0].length)
  } else {
    hideEmoji()
  }
}

const checkForMentions = (text: string, cursorPos: number) => {
  const textBefore = text.substring(0, cursorPos)

  // Check for user mention (@)
  const userMatch = textBefore.match(/@([a-zA-Z0-9_]*)$/)
  if (userMatch) {
    mentionType.value = 'user'
    searchMention(userMatch[1], cursorPos - userMatch[0].length)
    hideBoard()
    return
  }

  // Check for board mention (b/)
  const boardMatch = textBefore.match(/b\/([a-zA-Z0-9_]*)$/)
  if (boardMatch) {
    mentionType.value = 'board'
    searchBoard(boardMatch[1], cursorPos - boardMatch[0].length)
    hideMention()
    return
  }

  // No matches
  hideMention()
  hideBoard()
  mentionType.value = null
}

const handleClick = () => {
  if (!textareaRef.value) return
  checkForEmoji(textareaRef.value.value, textareaRef.value.selectionStart)
  checkForMentions(textareaRef.value.value, textareaRef.value.selectionStart)
}

// Keyboard handling
const handleKeydown = (event: KeyboardEvent) => {
  // Emoji suggestions take priority
  if (emojiState.isVisible) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault()
      handleEmojiSelect(emojiState.selectedIndex)
      return
    }
    if (handleEmojiKeydown(event)) {
      return
    }
  }

  // Then user mentions
  if (mentionState.isVisible) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault()
      handleMentionSelect(mentionState.selectedIndex)
      return
    }
    if (handleMentionKeydown(event)) {
      return
    }
  }

  // Then board mentions
  if (boardState.isVisible) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault()
      handleBoardSelect(boardState.selectedIndex)
      return
    }
    if (handleBoardKeydown(event)) {
      return
    }
  }
}

// Selection handlers
const handleEmojiSelect = (index: number) => {
  if (!textareaRef.value) return

  const emoji = emojiState.suggestions[index]
  if (!emoji) return

  const startPos = emojiState.triggerPos
  const endPos = textareaRef.value.selectionStart

  const before = content.value.substring(0, startPos)
  const after = content.value.substring(endPos)
  content.value = `${before}:${emoji.shortcode}:${after}`

  emit('update:modelValue', content.value)
  hideEmoji()

  // Restore cursor position
  const newCursorPos = startPos + emoji.shortcode.length + 2
  textareaRef.value.selectionStart = newCursorPos
  textareaRef.value.selectionEnd = newCursorPos
  textareaRef.value.focus()
}

const handleMentionSelect = (index: number) => {
  if (!textareaRef.value) return

  const user = mentionState.suggestions[index]
  if (!user) return

  const startPos = mentionState.triggerPos
  const endPos = textareaRef.value.selectionStart

  const before = content.value.substring(0, startPos)
  const after = content.value.substring(endPos)
  content.value = `${before}@${user.name}${after}`

  emit('update:modelValue', content.value)
  hideMention()

  const newCursorPos = startPos + user.name.length + 1
  textareaRef.value.selectionStart = newCursorPos
  textareaRef.value.selectionEnd = newCursorPos
  textareaRef.value.focus()
}

const handleBoardSelect = (index: number) => {
  if (!textareaRef.value) return

  const board = boardState.suggestions[index]
  if (!board) return

  const startPos = boardState.triggerPos
  const endPos = textareaRef.value.selectionStart

  const before = content.value.substring(0, startPos)
  const after = content.value.substring(endPos)
  content.value = `${before}b/${board.name}${after}`

  emit('update:modelValue', content.value)
  hideBoard()

  const newCursorPos = startPos + board.name.length + 2
  textareaRef.value.selectionStart = newCursorPos
  textareaRef.value.selectionEnd = newCursorPos
  textareaRef.value.focus()
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
  }
})
</script>
