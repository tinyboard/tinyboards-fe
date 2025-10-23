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

interface User {
  id: number
  flairs?: Array<{
    id: number
    flairId: number
    flair: Flair
  }>
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

/**
 * Filter and display flairs based on context:
 * - If boardId is provided, show board-specific flairs + site-wide flairs
 * - If boardId is not provided, show only site-wide flairs
 */
const displayFlairs = computed(() => {
  if (!props.user.flairs || props.user.flairs.length === 0) {
    return []
  }

  const flairs = props.user.flairs.map(assignment => assignment.flair)

  // Filter flairs based on board context
  const filteredFlairs = flairs.filter(flair => {
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
