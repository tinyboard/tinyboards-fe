<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <NuxtLink
        to="/streams"
        class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Streams
      </NuxtLink>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Create Custom Stream
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Build a personalized feed from your favorite flairs and boards
      </p>
    </div>

    <!-- Wizard Component -->
    <StreamWizard
      @success="handleSuccess"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import StreamWizard from '@/components/streams/StreamWizard.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

useHead({
  title: 'Create Stream',
  meta: [
    {
      name: 'description',
      content: 'Create a custom content stream'
    }
  ]
})

const router = useRouter()

const handleSuccess = (stream: any) => {
  // Redirect to the new stream
  router.push(`/streams/@${stream.creator.username}/${stream.slug}`)
}

const handleCancel = () => {
  router.push('/streams')
}
</script>
