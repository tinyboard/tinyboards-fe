<template>
  <div v-if="postFlairs.length > 0" class="post-flair inline-flex items-center gap-2">
    <FlairDisplayFlairStack
      :flairs="postFlairs"
      :size="size"
      :clickable="clickable"
      :removable="false"
      layout="horizontal"
      :max-visible="3"
      :collapsible="true"
      @flair-click="handleFlairClick"
    />

    <button
      v-if="editable && canEdit"
      type="button"
      class="flair-edit-button p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      :class="[
        size === 'xs' || size === 'sm' ? 'p-0.5' : 'p-1'
      ]"
      aria-label="Edit post flair"
      title="Edit post flair"
      @click="openFlairSelector"
    >
      <svg
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
        :class="[
          size === 'xs' ? 'w-3 h-3' : '',
          size === 'sm' ? 'w-3.5 h-3.5' : '',
          size === 'lg' ? 'w-5 h-5' : ''
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { FlairSize } from '~/types/flair'

interface Post {
  id: number
  flairs?: Array<{
    id: number
    templateId: number
    template: any
  }>
  creator?: {
    id: number
  }
  board?: {
    id: number
  }
}

interface Props {
  post: Post
  size?: FlairSize
  clickable?: boolean
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  clickable: true,
  editable: false
})

const emit = defineEmits<{
  'edit-flair': []
  'flair-click': [flairId: number]
}>()

const router = useRouter()

// Get current user from store/auth context
const currentUser = ref<any>(null) // Replace with actual user from auth store

const postFlairs = computed(() => {
  if (!props.post.flairs || props.post.flairs.length === 0) {
    return []
  }
  return props.post.flairs.map(assignment => assignment.template)
})

const canEdit = computed(() => {
  if (!currentUser.value) return false

  // User is post author
  if (props.post.creator?.id === currentUser.value.id) {
    return true
  }

  // User is admin
  if (currentUser.value.isAdmin) {
    return true
  }

  // User is board moderator (would need to check moderator status)
  // This would require additional data from the backend
  return false
})

const handleFlairClick = (flair: any) => {
  if (!props.clickable) return

  // Navigate to board flair filter page
  if (props.post.board && flair.id) {
    router.push({
      path: `/+${props.post.board.id}`,
      query: { flair: flair.id }
    })
    emit('flair-click', flair.id)
  }
}

const openFlairSelector = () => {
  emit('edit-flair')
  // This would typically open a modal or dialog for flair selection
  // Implementation would depend on your modal system
}
</script>

<style scoped>
.post-flair {
  user-select: none;
}

.flair-edit-button {
  flex-shrink: 0;
}

.flair-edit-button:focus {
  outline: none;
  ring: 2px;
  ring-offset: 1px;
  ring-color: rgb(59, 130, 246);
}
</style>
