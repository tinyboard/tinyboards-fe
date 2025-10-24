<template>
  <div class="stream-wizard max-w-4xl mx-auto">
    <!-- Progress indicator -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex-1 flex items-center"
        >
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                currentStep > index
                  ? 'bg-green-500 text-white'
                  : currentStep === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              ]"
            >
              <svg
                v-if="currentStep > index"
                class="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>

            <div class="hidden sm:block">
              <div
                :class="[
                  'text-sm font-medium',
                  currentStep >= index
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400'
                ]"
              >
                {{ step.title }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ step.description }}
              </div>
            </div>
          </div>

          <div
            v-if="index < steps.length - 1"
            :class="[
              'flex-1 h-1 mx-4',
              currentStep > index
                ? 'bg-green-500'
                : 'bg-gray-200 dark:bg-gray-700'
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Step content -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <!-- Step 1: Basic Info -->
      <div v-show="currentStep === 0" class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Basic Information
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Give your stream a name and customize its appearance
          </p>
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stream Name
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="My Custom Feed"
            maxlength="50"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ formData.name.length }}/50 characters
          </p>
        </div>

        <!-- Slug (auto-generated) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL Slug
          </label>
          <div class="flex items-center gap-2">
            <span class="text-gray-500 dark:text-gray-400">/streams/@username/</span>
            <input
              v-model="formData.slug"
              type="text"
              placeholder="my-custom-feed"
              maxlength="50"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Leave blank to auto-generate from name
          </p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            placeholder="Describe what this stream is about..."
            maxlength="500"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ formData.description?.length || 0 }}/500 characters
          </p>
        </div>

        <!-- Icon & Color -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Icon -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon URL
            </label>
            <input
              v-model="formData.icon"
              type="url"
              placeholder="https://example.com/icon.png"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Optional custom icon
            </p>
          </div>

          <!-- Color -->
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
                placeholder="#3B82F6"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="formData.name" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preview:
          </p>
          <div class="flex items-center gap-3">
            <div
              v-if="formData.icon"
              class="w-12 h-12 rounded-full overflow-hidden"
            >
              <img :src="formData.icon" :alt="formData.name" class="w-full h-full object-cover">
            </div>
            <div
              v-else
              class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
              :style="{ backgroundColor: formData.color || '#3B82F6' }"
            >
              {{ formData.name.charAt(0).toUpperCase() }}
            </div>

            <div>
              <div class="font-semibold text-gray-900 dark:text-gray-100">
                {{ formData.name }}
              </div>
              <div v-if="formData.description" class="text-sm text-gray-600 dark:text-gray-400">
                {{ formData.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Add Subscriptions -->
      <div v-show="currentStep === 1" class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Add Subscriptions
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Choose which content to include in your stream
          </p>
        </div>

        <StreamSubscriptionSelector
          v-model:flair-selections="formData.flairSelections"
          v-model:board-selections="formData.boardSelections"
        />

        <!-- Warning if no subscriptions -->
        <div v-if="totalSubscriptions === 0" class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="font-medium text-yellow-800 dark:text-yellow-200">
                No subscriptions selected
              </p>
              <p class="text-sm text-yellow-700 dark:text-yellow-300">
                Your stream needs at least one subscription to display content
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Configure Feed -->
      <div v-show="currentStep === 2" class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Configure Feed
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Customize how posts are sorted and displayed
          </p>
        </div>

        <!-- Sort Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Sort
          </label>
          <select
            v-model="formData.sortType"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="HOT">Hot</option>
            <option value="NEW">New</option>
            <option value="TOP">Top</option>
            <option value="RISING">Rising</option>
          </select>
        </div>

        <!-- Time Range (for TOP sort) -->
        <div v-if="formData.sortType === 'TOP'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Range
          </label>
          <select
            v-model="formData.timeRange"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="DAY">Today</option>
            <option value="WEEK">This Week</option>
            <option value="MONTH">This Month</option>
            <option value="YEAR">This Year</option>
            <option value="ALL">All Time</option>
          </select>
        </div>

        <!-- NSFW Setting -->
        <div>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="formData.showNsfw"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
            >
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100">
                Show NSFW content
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Include posts marked as Not Safe For Work
              </div>
            </div>
          </label>
        </div>

        <!-- Privacy Settings -->
        <div class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">
            Privacy Settings
          </h3>

          <div>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="formData.isPublic"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
              >
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">
                  Public stream
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Anyone can view this stream
                </div>
              </div>
            </label>
          </div>

          <div v-if="formData.isPublic">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="formData.isDiscoverable"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
              >
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">
                  Discoverable
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Show in public stream discovery
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Navbar Setting -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="formData.addedToNavbar"
              type="checkbox"
              class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
            >
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100">
                Pin to navbar
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Quick access from the navigation bar
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          v-if="currentStep > 0"
          @click="previousStep"
          :disabled="loading"
          class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>

        <div class="flex items-center gap-3 ml-auto">
          <button
            v-if="currentStep < steps.length - 1"
            @click="nextStep"
            :disabled="!canProceed || loading"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>

          <button
            v-else
            @click="createStream"
            :disabled="!canProceed || loading"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{{ loading ? 'Creating...' : 'Create Stream' }}</span>
          </button>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
      </div>
    </div>

    <!-- Success modal -->
    <Teleport to="body">
      <div
        v-if="showSuccess"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="closeSuccess"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>

            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Stream Created!
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Your custom stream "{{ formData.name }}" has been created successfully.
            </p>

            <div class="flex gap-3">
              <button
                @click="viewStream"
                class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Stream
              </button>
              <button
                @click="closeSuccess"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { CreateStreamInput } from '~/types/stream'
import StreamSubscriptionSelector from './StreamSubscriptionSelector.vue'

interface Emits {
  (e: 'success', stream: any): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const { createStream: createStreamAction } = useStream()
const router = useRouter()

const currentStep = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)
const showSuccess = ref(false)
const createdStream = ref<any>(null)

const steps = [
  {
    title: 'Basic Info',
    description: 'Name and appearance',
    isValid: false,
    isComplete: false,
  },
  {
    title: 'Subscriptions',
    description: 'Choose content sources',
    isValid: false,
    isComplete: false,
  },
  {
    title: 'Configure',
    description: 'Feed settings',
    isValid: false,
    isComplete: false,
  },
]

const formData = reactive({
  name: '',
  slug: '',
  description: '',
  icon: '',
  color: '#3B82F6',
  sortType: 'HOT',
  timeRange: 'WEEK',
  showNsfw: false,
  isPublic: true,
  isDiscoverable: true,
  addedToNavbar: false,
  flairSelections: [] as any[],
  boardSelections: [] as any[],
})

const totalSubscriptions = computed(() => {
  const flairCount = formData.flairSelections.reduce((sum, s) => sum + s.flairIds.length, 0)
  return flairCount + formData.boardSelections.length
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return formData.name.trim().length > 0
    case 1:
      return totalSubscriptions.value > 0
    case 2:
      return true
    default:
      return false
  }
})

const nextStep = () => {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
    error.value = null
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    error.value = null
  }
}

const createStream = async () => {
  if (!canProceed.value || loading.value) return

  loading.value = true
  error.value = null

  try {
    // Prepare stream creation input (without subscriptions)
    const input: CreateStreamInput = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      sortType: formData.sortType.toLowerCase(),
      timeRange: formData.sortType === 'TOP' ? formData.timeRange.toLowerCase() : undefined,
      showNsfw: formData.showNsfw,
      isPublic: formData.isPublic,
      isDiscoverable: formData.isPublic && formData.isDiscoverable,
    }

    // Create the stream first
    const stream = await createStreamAction(input)

    // Add subscriptions after stream creation
    const { addFlairSubscriptions, addBoardSubscriptions } = useStream()

    // Add flair subscriptions if any
    const flairIds = formData.flairSelections.flatMap(s => s.flairIds)
    if (flairIds.length > 0) {
      await addFlairSubscriptions(stream.id, flairIds)
    }

    // Add board subscriptions if any
    const boardIds = formData.boardSelections.map(b => b.id)
    if (boardIds.length > 0) {
      await addBoardSubscriptions(stream.id, boardIds)
    }

    createdStream.value = stream
    showSuccess.value = true
    emit('success', stream)
  } catch (err: any) {
    error.value = err.message || 'Failed to create stream'
    console.error('Error creating stream:', err)
  } finally {
    loading.value = false
  }
}

const viewStream = () => {
  if (createdStream.value) {
    router.push(`/streams/@${createdStream.value.creator.name}/${createdStream.value.slug}`)
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  // Reset form
  Object.assign(formData, {
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    sortType: 'HOT',
    timeRange: 'WEEK',
    showNsfw: false,
    isPublic: true,
    isDiscoverable: true,
    addedToNavbar: false,
    flairSelections: [],
    boardSelections: [],
  })
  currentStep.value = 0
}
</script>

<style scoped>
.stream-wizard {
  @apply w-full;
}
</style>
