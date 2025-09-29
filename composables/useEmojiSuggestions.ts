import { ref, computed } from 'vue'

interface CustomEmoji {
  id: number
  shortcode: string
  imageUrl: string
  altText: string
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
            altText
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
          scope: boardId ? "Board" : "Site",
          activeOnly: true,
          limit: 200,
          offset: 0
        }
      }

      const response = await $fetch('#gql', {
        method: 'POST',
        body: { query, variables }
      })

      if (response?.data?.listEmojis) {
        emojiCache.value = response.data.listEmojis
        cacheLoaded.value = true
      }
    } catch (error) {
      console.error('Failed to load emojis for suggestions:', error)
    }
  }

  const filteredSuggestions = computed(() => {
    if (!currentQuery.value) return []

    const query = currentQuery.value.toLowerCase()
    return emojiCache.value
      .filter(emoji =>
        emoji.shortcode.toLowerCase().includes(query) ||
        emoji.altText.toLowerCase().includes(query)
      )
      .slice(0, 10) // Limit to 10 suggestions
      .map(emoji => ({
        ...emoji,
        displayText: `:${emoji.shortcode}:`
      }))
      .sort((a, b) => {
        // Prioritize exact matches and usage count
        const aExact = a.shortcode.toLowerCase().startsWith(query)
        const bExact = b.shortcode.toLowerCase().startsWith(query)

        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1

        return b.usageCount - a.usageCount
      })
  })

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
    // Emojis should already be loaded, but check just in case
    if (!cacheLoaded.value) {
      await loadEmojis()
    }

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

    suggestions.value = filteredSuggestions.value
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