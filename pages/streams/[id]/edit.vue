<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <NuxtLink
        :to="`/streams/@${stream?.creator?.username}/${stream?.slug}`"
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
    <div v-if="loading && !stream" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
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
            :to="`/streams/@${stream.creator.username}/${stream.slug}`"
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

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { fetchStream, updateStream, deleteStream, loading } = useStream()

const stream = computed(() => useStreamStore().currentStream)
const saving = ref(false)
const editError = ref<string | null>(null)

const formData = reactive({
  name: '',
  description: '',
  icon: '',
  color: '#3B82F6',
  showNsfw: false,
  isPublic: true,
  isDiscoverable: true,
  addedToNavbar: false,
})

const hasChanges = computed(() => {
  if (!stream.value) return false
  return (
    formData.name !== stream.value.name ||
    formData.description !== stream.value.description ||
    formData.icon !== stream.value.icon ||
    formData.color !== stream.value.color ||
    formData.showNsfw !== stream.value.showNsfw ||
    formData.isPublic !== stream.value.isPublic ||
    formData.isDiscoverable !== stream.value.isDiscoverable ||
    formData.addedToNavbar !== stream.value.addedToNavbar
  )
})

const handleSave = async () => {
  if (!stream.value || saving.value || !hasChanges.value) return

  saving.value = true
  editError.value = null

  try {
    const input: UpdateStreamInput = {
      name: formData.name,
      description: formData.description || undefined,
      icon: formData.icon || undefined,
      color: formData.color,
      showNsfw: formData.showNsfw,
      isPublic: formData.isPublic,
      isDiscoverable: formData.isPublic && formData.isDiscoverable,
      addedToNavbar: formData.addedToNavbar,
    }

    await updateStream(stream.value.id, input)
    router.push(`/streams/@${stream.value.creator.username}/${stream.value.slug}`)
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
  if (id) {
    await fetchStream(id)

    if (stream.value) {
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
    }
  }
})

useHead({
  title: 'Edit Stream',
})
</script>
