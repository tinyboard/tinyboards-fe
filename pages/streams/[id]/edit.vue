<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 sm:pt-24">
    <div class="mb-8">
      <NuxtLink
        :to="`/streams/@${stream?.creator?.name}/${stream?.slug}`"
        class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Stream
      </NuxtLink>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Edit Stream
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Update your stream settings and subscriptions
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-800 dark:text-red-200">{{ loadError }}</p>
      <NuxtLink
        to="/streams"
        class="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
      >
        Back to Streams
      </NuxtLink>
    </div>

    <!-- Edit Form -->
    <div v-else-if="stream" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
      <!-- Basic Info -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Stream Name
        </label>
        <input
          v-model="formData.name"
          type="text"
          maxlength="50"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          v-model="formData.description"
          rows="3"
          maxlength="500"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
      </div>

      <!-- Icon & Color -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Icon URL
          </label>
          <input
            v-model="formData.icon"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Accent Color
          </label>
          <div class="flex items-center gap-3">
            <input
              v-model="formData.color"
              type="color"
              class="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            >
            <input
              v-model="formData.color"
              type="text"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
          </div>
        </div>
      </div>

      <!-- Subscriptions -->
      <div class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100">Subscriptions</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Manage which boards and flairs appear in this stream
        </p>

        <StreamSubscriptionSelector
          v-model:flair-selections="formData.flairSelections"
          v-model:board-selections="formData.boardSelections"
        />
      </div>

      <!-- Settings -->
      <div class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100">Settings</h3>

        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="formData.showNsfw"
            type="checkbox"
            class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
          >
          <div>
            <div class="font-medium text-gray-900 dark:text-gray-100">Show NSFW content</div>
          </div>
        </label>

        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="formData.isPublic"
            type="checkbox"
            class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
          >
          <div>
            <div class="font-medium text-gray-900 dark:text-gray-100">Public stream</div>
          </div>
        </label>

        <label v-if="formData.isPublic" class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="formData.isDiscoverable"
            type="checkbox"
            class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
          >
          <div>
            <div class="font-medium text-gray-900 dark:text-gray-100">Discoverable</div>
          </div>
        </label>

        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="formData.addedToNavbar"
            type="checkbox"
            class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
          >
          <div>
            <div class="font-medium text-gray-900 dark:text-gray-100">Pin to navbar</div>
          </div>
        </label>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="handleDelete"
          :disabled="saving"
          class="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
        >
          Delete Stream
        </button>

        <div class="flex gap-3">
          <NuxtLink
            :to="`/streams/@${stream.creator.name}/${stream.slug}`"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </NuxtLink>

          <button
            @click="handleSave"
            :disabled="saving || !hasChanges"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="saving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </div>

      <!-- Error -->
      <div v-if="editError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-800 dark:text-red-200">{{ editError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UpdateStreamInput } from '~/types/stream'
import StreamSubscriptionSelector from '@/components/streams/StreamSubscriptionSelector.vue'

definePageMeta({
  hasAuthRequired: true,
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { fetchStream, updateStream, deleteStream, addFlairSubscriptions, addBoardSubscriptions, removeFlairSubscription, removeBoardSubscription } = useStream()

const stream = computed(() => useStreamStore().currentStream)
const isLoading = ref(true)
const saving = ref(false)
const editError = ref<string | null>(null)
const loadError = ref<string | null>(null)

const formData = reactive({
  name: '',
  description: '',
  icon: '',
  color: '#3B82F6',
  showNsfw: false,
  isPublic: true,
  isDiscoverable: true,
  addedToNavbar: false,
  flairSelections: [] as any[],
  boardSelections: [] as any[],
})

// Track initial subscriptions to detect changes
const initialFlairIds = ref<number[]>([])
const initialBoardIds = ref<number[]>([])

const hasChanges = computed(() => {
  if (!stream.value) return false

  // Check basic field changes
  const basicChanges = (
    formData.name !== stream.value.name ||
    formData.description !== stream.value.description ||
    formData.icon !== stream.value.icon ||
    formData.color !== stream.value.color ||
    formData.showNsfw !== stream.value.showNsfw ||
    formData.isPublic !== stream.value.isPublic ||
    formData.isDiscoverable !== stream.value.isDiscoverable ||
    formData.addedToNavbar !== stream.value.addedToNavbar
  )

  // Check subscription changes
  const currentFlairIds = formData.flairSelections.flatMap(s => s.flairIds).sort()
  const currentBoardIds = formData.boardSelections.map(b => b.id).sort()

  const flairChanges = JSON.stringify(currentFlairIds) !== JSON.stringify(initialFlairIds.value.sort())
  const boardChanges = JSON.stringify(currentBoardIds) !== JSON.stringify(initialBoardIds.value.sort())

  return basicChanges || flairChanges || boardChanges
})

const handleSave = async () => {
  if (!stream.value || saving.value || !hasChanges.value) return

  saving.value = true
  editError.value = null

  try {
    // Update stream settings
    const input: UpdateStreamInput = {
      name: formData.name,
      description: formData.description || undefined,
      icon: formData.icon || undefined,
      color: formData.color,
      showNsfw: formData.showNsfw,
      isPublic: formData.isPublic,
      isDiscoverable: formData.isPublic && formData.isDiscoverable,
    }

    await updateStream(stream.value.id, input)

    // Handle navbar settings separately if changed
    if (formData.addedToNavbar !== stream.value.addedToNavbar) {
      const streamStore = useStreamStore()
      await streamStore.updateStreamNavbarSettings(stream.value.id, {
        addToNavbar: formData.addedToNavbar,
        navbarPosition: stream.value.navbarSettings?.navbarPosition,
      })
    }

    // Handle subscription changes
    const currentFlairIds = formData.flairSelections.flatMap(s => s.flairIds)
    const currentBoardIds = formData.boardSelections.map(b => b.id)

    // Find flairs to add and remove
    const flairsToAdd = currentFlairIds.filter(id => !initialFlairIds.value.includes(id))
    const flairsToRemove = initialFlairIds.value.filter(id => !currentFlairIds.includes(id))

    // Find boards to add and remove
    const boardsToAdd = currentBoardIds.filter(id => !initialBoardIds.value.includes(id))
    const boardsToRemove = initialBoardIds.value.filter(id => !currentBoardIds.includes(id))

    // Add new subscriptions
    if (flairsToAdd.length > 0) {
      await addFlairSubscriptions(stream.value.id, flairsToAdd)
    }
    if (boardsToAdd.length > 0) {
      await addBoardSubscriptions(stream.value.id, boardsToAdd)
    }

    // Remove subscriptions
    for (const flairId of flairsToRemove) {
      await removeFlairSubscription(stream.value.id, flairId)
    }
    for (const boardId of boardsToRemove) {
      await removeBoardSubscription(stream.value.id, boardId)
    }

    router.push(`/streams/@${stream.value.creator.name}/${stream.value.slug}`)
  } catch (err: any) {
    editError.value = err.message || 'Failed to update stream'
  } finally {
    saving.value = false
  }
}

const handleDelete = async () => {
  if (!stream.value || !confirm('Are you sure you want to delete this stream? This action cannot be undone.')) {
    return
  }

  saving.value = true
  editError.value = null

  try {
    await deleteStream(stream.value.id)
    router.push('/streams')
  } catch (err: any) {
    editError.value = err.message || 'Failed to delete stream'
  } finally {
    saving.value = false
  }
}

// Load stream and populate form
onMounted(async () => {
  const id = parseInt(route.params.id as string)
  console.log('Loading stream for edit, ID:', id)

  if (id && !isNaN(id)) {
    try {
      await fetchStream(id)
      console.log('Stream loaded:', stream.value)

      if (stream.value) {
        // Populate basic fields
        Object.assign(formData, {
          name: stream.value.name,
          description: stream.value.description || '',
          icon: stream.value.icon || '',
          color: stream.value.color || '#3B82F6',
          showNsfw: stream.value.showNsfw,
          isPublic: stream.value.isPublic,
          isDiscoverable: stream.value.isDiscoverable,
          addedToNavbar: stream.value.addedToNavbar,
        })

        // Load current subscriptions
        // Group flair subscriptions by board
        const flairsByBoard = new Map<number, any>()
        if (stream.value.flairSubscriptions && stream.value.flairSubscriptions.length > 0) {
          for (const sub of stream.value.flairSubscriptions) {
            const boardId = sub.board.id
            if (!flairsByBoard.has(boardId)) {
              flairsByBoard.set(boardId, {
                boardId: boardId,
                boardName: sub.board.name,
                flairIds: [],
                flairs: [],
              })
            }
            const boardFlairs = flairsByBoard.get(boardId)!
            boardFlairs.flairIds.push(sub.flair.id)
            boardFlairs.flairs.push(sub.flair)
          }
        }

        formData.flairSelections = Array.from(flairsByBoard.values())
        formData.boardSelections = stream.value.boardSubscriptions?.map(sub => sub.board) || []

        // Store initial IDs for change detection
        initialFlairIds.value = formData.flairSelections.flatMap(s => s.flairIds)
        initialBoardIds.value = formData.boardSelections.map(b => b.id)

        console.log('Form data populated:', formData)
        console.log('Initial flair IDs:', initialFlairIds.value)
        console.log('Initial board IDs:', initialBoardIds.value)
      } else {
        loadError.value = 'Stream not found'
      }
    } catch (err: any) {
      console.error('Error loading stream:', err)
      loadError.value = err.message || 'Failed to load stream'
    } finally {
      isLoading.value = false
    }
  } else {
    loadError.value = 'Invalid stream ID'
    isLoading.value = false
  }
})

useHead({
  title: 'Edit Stream',
})
</script>
