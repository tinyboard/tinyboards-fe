import { ref, computed } from 'vue'

interface CustomEmoji {
  id: number
  shortcode: string
  imageUrl: string
  altTextDisplay: string
  category: string
  emojiScope: string
  isActive: boolean
  usageCount: number
}

interface EmojiSuggestion extends CustomEmoji {
  displayText: string
}

export const useEmojiSuggestions = (boardId?: number) => {
  const suggestions = ref<EmojiSuggestion[]>([])
  const isVisible = ref(false)
  const position = ref({ top: 0, left: 0 })
  const selectedIndex = ref(0)
  const currentQuery = ref('')
  const triggerPosition = ref(0)

  // Cache for loaded emojis to avoid repeated API calls
  const emojiCache = ref<CustomEmoji[]>([])
  const cacheLoaded = ref(false)

  const loadEmojis = async () => {
    if (cacheLoaded.value) return

    try {
      const query = `
        query ListEmojis($input: ListEmojisInput) {
          listEmojis(input: $input) {
            id
            shortcode
            imageUrl
            altTextDisplay
            category
            emojiScope
            isActive
            usageCount
          }
        }
      `

      const variables = {
        input: {
          boardId: boardId,
          scope: boardId ? "BOARD" : "SITE",
          activeOnly: true,
          limit: 200,
          offset: 0
        }
      }

      const { useGraphQLQuery } = await import('@/composables/useGraphQL')
      const { data, error } = await useGraphQLQuery(query, { variables })

      if (error.value) {
        console.error('Failed to load emojis for suggestions:', error.value)
        return
      }

      if (data.value?.listEmojis) {
        emojiCache.value = data.value.listEmojis
        cacheLoaded.value = true
      }
    } catch (error) {
      console.error('Failed to load emojis for suggestions:', error)
    }
  }

  // Search emojis with backend query
  const searchEmojis = async (query: string): Promise<EmojiSuggestion[]> => {
    if (!query) return []

    try {
      const queryGql = `
        query ListEmojis($input: ListEmojisInput) {
          listEmojis(input: $input) {
            id
            shortcode
            imageUrl
            altTextDisplay
            category
            emojiScope
            isActive
            usageCount
          }
        }
      `

      const variables = {
        input: {
          boardId: boardId,
          scope: boardId ? "BOARD" : "SITE",
          activeOnly: true,
          limit: 10,
          offset: 0,
          search: query
        }
      }

      const { useGraphQLQuery } = await import('@/composables/useGraphQL')
      const { data, error } = await useGraphQLQuery(queryGql, { variables })

      if (error.value) {
        console.error('Failed to search emojis:', error.value)
        return []
      }

      if (data.value?.listEmojis) {
        return data.value.listEmojis.map((emoji: CustomEmoji) => ({
          ...emoji,
          displayText: `:${emoji.shortcode}:`
        }))
      }

      return []
    } catch (error) {
      console.error('Failed to search emojis:', error)
      return []
    }
  }

  const detectEmojiTrigger = (text: string, cursorPosition: number): { query: string; position: number } | null => {
    // Look backwards from cursor to find the last ':'
    let colonPos = -1
    for (let i = cursorPosition - 1; i >= 0; i--) {
      if (text[i] === ':') {
        colonPos = i
        break
      }
      // Stop if we hit whitespace or another colon (incomplete emoji)
      if (text[i] === ' ' || text[i] === '\n' || text[i] === '\t') {
        break
      }
    }

    if (colonPos === -1) return null

    // Extract the query between the colon and cursor
    const query = text.substring(colonPos + 1, cursorPosition)

    // Only show suggestions if we have at least 1 character and no spaces
    if (query.length >= 1 && !query.includes(' ') && !query.includes('\n')) {
      return { query, position: colonPos }
    }

    return null
  }

  const showSuggestions = async (text: string, cursorPosition: number, element: HTMLElement) => {
    const trigger = detectEmojiTrigger(text, cursorPosition)

    if (!trigger) {
      hideSuggestions()
      return
    }

    currentQuery.value = trigger.query
    triggerPosition.value = trigger.position

    // Calculate position for suggestions dropdown
    const rect = element.getBoundingClientRect()
    position.value = {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    }

    // Search for emojis with the current query
    const searchResults = await searchEmojis(trigger.query)
    suggestions.value = searchResults
    selectedIndex.value = 0
    isVisible.value = suggestions.value.length > 0
  }

  const hideSuggestions = () => {
    isVisible.value = false
    suggestions.value = []
    currentQuery.value = ''
    selectedIndex.value = 0
  }

  const selectSuggestion = (index?: number): EmojiSuggestion | null => {
    const suggestionIndex = index !== undefined ? index : selectedIndex.value
    const suggestion = suggestions.value[suggestionIndex]

    if (suggestion) {
      hideSuggestions()
      return suggestion
    }

    return null
  }

  const navigateUp = () => {
    if (selectedIndex.value > 0) {
      selectedIndex.value--
    }
  }

  const navigateDown = () => {
    if (selectedIndex.value < suggestions.value.length - 1) {
      selectedIndex.value++
    }
  }

  const replaceEmojiInText = (text: string, cursorPosition: number, emoji: EmojiSuggestion) => {
    const beforeEmoji = text.substring(0, triggerPosition.value)
    const afterEmoji = text.substring(cursorPosition)

    return {
      newText: beforeEmoji + emoji.displayText + afterEmoji,
      newCursorPosition: triggerPosition.value + emoji.displayText.length
    }
  }

  // Auto-load emojis when composable is first used
  if (process.client && !cacheLoaded.value) {
    loadEmojis()
  }

  return {
    suggestions,
    isVisible,
    position,
    selectedIndex,
    currentQuery,
    showSuggestions,
    hideSuggestions,
    selectSuggestion,
    navigateUp,
    navigateDown,
    replaceEmojiInText,
    loadEmojis
  }
}