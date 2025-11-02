import { ref } from 'vue'

interface CustomEmoji {
  id: number
  shortcode: string
  imageUrl: string
  altTextDisplay: string
  category: string
  emojiScope: string
  isActive: boolean
}

const customEmojis = ref<CustomEmoji[]>([])
const isLoaded = ref(false)

export const useCustomEmojis = () => {
  const loadCustomEmojis = async (boardId?: number) => {
    console.log('[useCustomEmojis] loadCustomEmojis called, isLoaded:', isLoaded.value, 'boardId:', boardId)

    // Skip if already loaded
    if (isLoaded.value) {
      console.log('[useCustomEmojis] Already loaded, returning cache:', customEmojis.value.length, 'emojis')
      return customEmojis.value
    }

    try {
      console.log('[useCustomEmojis] Starting to load emojis...')
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
          }
        }
      `

      const allEmojis: CustomEmoji[] = []

      // Load site emojis
      const { data: siteData, error: siteError } = await useGraphQLQuery(query, {
        variables: {
          input: {
            scope: 'SITE',
            activeOnly: true,
            limit: 100,
            offset: 0
          }
        }
      })

      console.log('[useCustomEmojis] Site emojis response:', {
        data: siteData.value,
        error: siteError.value,
        hasListEmojis: !!siteData.value?.listEmojis,
        count: siteData.value?.listEmojis?.length
      })

      if (!siteError.value && siteData.value?.listEmojis) {
        allEmojis.push(...siteData.value.listEmojis)
      }

      // Load board emojis if boardId is provided
      if (boardId) {
        const { data: boardData, error: boardError } = await useGraphQLQuery(query, {
          variables: {
            input: {
              boardId,
              scope: 'BOARD',
              activeOnly: true,
              limit: 100,
              offset: 0
            }
          }
        })

        if (!boardError.value && boardData.value?.listEmojis) {
          allEmojis.push(...boardData.value.listEmojis)
        }
      }

      customEmojis.value = allEmojis
      isLoaded.value = true

      console.log('[useCustomEmojis] Finished loading. Total emojis:', allEmojis.length)
      console.log('[useCustomEmojis] Emoji shortcodes:', allEmojis.map(e => e.shortcode))

      return customEmojis.value
    } catch (error) {
      console.error('[useCustomEmojis] Failed to load custom emojis:', error)
      return []
    }
  }

  const isCustomEmoji = (emoji: string): boolean => {
    return emoji.startsWith(':') && emoji.endsWith(':')
  }

  const getCustomEmojiUrl = (emojiCode: string): string => {
    if (!isCustomEmoji(emojiCode)) return ''

    const shortcode = emojiCode.slice(1, -1)
    const emoji = customEmojis.value.find(e => e.shortcode === shortcode)
    return emoji?.imageUrl || ''
  }

  return {
    customEmojis,
    loadCustomEmojis,
    isCustomEmoji,
    getCustomEmojiUrl
  }
}
