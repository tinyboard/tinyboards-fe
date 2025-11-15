<template>
  <div v-if="displayFlairs.length > 0" class="user-flair inline-flex items-center">
    <FlairDisplayFlairStack
      :flairs="displayFlairs"
      :size="size"
      :clickable="false"
      :removable="false"
      layout="horizontal"
      :max-visible="2"
      :collapsible="true"
    />
  </div>
</template>

<script setup lang="ts">
import type { FlairSize, Flair } from '~/types/flair'

interface UserFlair {
  id: number
  userId?: number
  boardId?: number
  templateId?: number
  textDisplay: string
  backgroundColor?: string
  textColor?: string
  styleConfig?: string
  template?: any
  style?: any
}

interface User {
  id: number
  flairs?: UserFlair[]
}

interface Props {
  user: User
  boardId?: number
  size?: FlairSize
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  boardId: undefined
})

const { parseBackendStyle } = useFlairStyle()

/**
 * Filter and display flairs based on context:
 * - If boardId is provided, show board-specific flairs + site-wide flairs
 * - If boardId is not provided, show only site-wide flairs
 */
const displayFlairs = computed(() => {
  if (!props.user.flairs || props.user.flairs.length === 0) {
    return []
  }

  // Transform UserFlair backend structure to Flair frontend structure
  const flairs = props.user.flairs.map((userFlair: UserFlair) => {
    // Parse styleConfig JSON into style object
    const parsedStyle = userFlair.template?.styleConfig
      ? parseBackendStyle(userFlair.template.styleConfig)
      : (userFlair.styleConfig ? parseBackendStyle(userFlair.styleConfig) : parseBackendStyle(null))

    return {
      id: userFlair.id,
      text: userFlair.textDisplay || userFlair.template?.textDisplay || '',
      style: parsedStyle,
      boardId: userFlair.boardId,
      isUserSelectable: true,
      isModOnly: false,
      creationDate: '',
      updated: ''
    } as Flair
  })

  // Filter flairs based on board context
  const filteredFlairs = flairs.filter(flair => {
    // Debug logging
    if (process.dev) {
      console.log('UserFlair filtering:', {
        flairId: flair.id,
        flairText: flair.text,
        flairBoardId: flair.boardId,
        propsBoardId: props.boardId,
        shouldShow: !flair.boardId || (props.boardId !== undefined && flair.boardId === props.boardId)
      })
    }

    // Site-wide flair (no boardId)
    if (!flair.boardId) {
      return true
    }

    // Board-specific flair
    if (props.boardId !== undefined) {
      return flair.boardId === props.boardId
    }

    // If no boardId provided, don't show board-specific flairs
    return false
  })

  // Sort: site-wide flairs first, then board-specific
  return filteredFlairs.sort((a, b) => {
    if (!a.boardId && b.boardId) return -1
    if (a.boardId && !b.boardId) return 1
    return 0
  })
})
</script>

<style scoped>
.user-flair {
  user-select: none;
}
</style>
