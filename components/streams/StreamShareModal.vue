<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Share Stream
          </h3>
          <button
            @click="$emit('close')"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Stream info -->
        <div class="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div
            v-if="stream.icon"
            class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
          >
            <img :src="stream.icon" :alt="stream.name" class="w-full h-full object-cover">
          </div>
          <div
            v-else
            class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            :style="{ backgroundColor: stream.color || '#3B82F6' }"
          >
            {{ stream.name.charAt(0).toUpperCase() }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="font-semibold text-gray-900 dark:text-gray-100">
              {{ stream.name }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              by @{{ stream.creator.username }}
            </div>
          </div>
        </div>

        <!-- Public stream link -->
        <div v-if="stream.isPublic" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Public Link
          </label>
          <div class="flex gap-2">
            <input
              :value="publicUrl"
              readonly
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
            <button
              @click="copyPublicUrl"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <svg v-if="!copiedPublic" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ copiedPublic ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Anyone with this link can view the stream
          </p>
        </div>

        <!-- Private stream tokens -->
        <div v-else class="mb-6">
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Private Stream
                </p>
                <p class="text-sm text-yellow-700 dark:text-yellow-300">
                  Generate a share token to grant access to specific users
                </p>
              </div>
            </div>
          </div>

          <!-- Generate token -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Token Expiration
              </label>
              <select
                v-model="tokenExpiration"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option :value="1">1 day</option>
                <option :value="7">7 days</option>
                <option :value="30">30 days</option>
                <option :value="null">Never expires</option>
              </select>
            </div>

            <button
              @click="generateToken"
              :disabled="generatingToken"
              class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="!generatingToken" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ generatingToken ? 'Generating...' : 'Generate Share Token' }}
            </button>
          </div>

          <!-- Generated token -->
          <div v-if="shareToken" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share URL
            </label>
            <div class="flex gap-2">
              <input
                :value="shareTokenUrl"
                readonly
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm"
              >
              <button
                @click="copyShareToken"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg v-if="!copiedToken" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ copiedToken ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ shareToken.expiresAt ? `Expires ${formatDate(shareToken.expiresAt)}` : 'Never expires' }}
            </p>
          </div>
        </div>

        <!-- Social sharing -->
        <div v-if="stream.isPublic" class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Share on
          </label>
          <div class="flex gap-3">
            <button
              @click="shareOnTwitter"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              Twitter
            </button>
            <button
              @click="shareOnReddit"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
              </svg>
              Reddit
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Stream, StreamShareToken } from '~/types/stream'

interface Props {
  stream: Stream
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { generateShareToken: generateShareTokenAction } = useStreamMutations()

const tokenExpiration = ref<number | null>(7)
const shareToken = ref<StreamShareToken | null>(null)
const generatingToken = ref(false)
const copiedPublic = ref(false)
const copiedToken = ref(false)

const publicUrl = computed(() => {
  return `${window.location.origin}/streams/@${props.stream.creator.username}/${props.stream.slug}`
})

const shareTokenUrl = computed(() => {
  if (!shareToken.value) return ''
  return `${window.location.origin}/s/${shareToken.value.token}`
})

const copyPublicUrl = async () => {
  try {
    await navigator.clipboard.writeText(publicUrl.value)
    copiedPublic.value = true
    setTimeout(() => {
      copiedPublic.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const copyShareToken = async () => {
  try {
    await navigator.clipboard.writeText(shareTokenUrl.value)
    copiedToken.value = true
    setTimeout(() => {
      copiedToken.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const generateToken = async () => {
  if (generatingToken.value) return

  generatingToken.value = true

  try {
    const token = await generateShareTokenAction(
      props.stream.id,
      tokenExpiration.value || undefined
    )
    shareToken.value = token
  } catch (err) {
    console.error('Error generating token:', err)
  } finally {
    generatingToken.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const shareOnTwitter = () => {
  const text = `Check out my custom stream: ${props.stream.name}`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(publicUrl.value)}`
  window.open(url, '_blank', 'width=550,height=420')
}

const shareOnReddit = () => {
  const url = `https://reddit.com/submit?url=${encodeURIComponent(publicUrl.value)}&title=${encodeURIComponent(props.stream.name)}`
  window.open(url, '_blank')
}
</script>
