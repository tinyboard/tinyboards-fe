<template>
  <TransitionRoot appear :show="true" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
              >
                Page History
              </DialogTitle>

              <!-- Loading State -->
              <div v-if="loading" class="text-center py-8">
                <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading history...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="text-center py-8">
                <p class="text-red-600 dark:text-red-400">Failed to load page history</p>
              </div>

              <!-- History List -->
              <div v-else class="space-y-2 max-h-96 overflow-y-auto">
                <div
                  v-for="revision in revisions"
                  :key="revision.id"
                  class="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-gray-900 dark:text-white">
                          Revision #{{ revision.revisionNumber }}
                        </span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          by {{ revision.editor?.username || 'Unknown' }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {{ formatDate(revision.timestamp) }}
                      </p>
                      <p v-if="revision.editSummary" class="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        {{ revision.editSummary }}
                      </p>
                    </div>
                    <div class="flex gap-2">
                      <button
                        @click="viewRevision(revision)"
                        class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                      <button
                        v-if="canRevert"
                        @click="revertToRevision(revision)"
                        class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Revert
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex justify-end">
                <button
                  @click="$emit('close')"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useToastStore } from '@/stores/StoreToast'

const props = defineProps<{
  pageId: number
  boardName: string
  slug: string
}>()

const emit = defineEmits(['close'])

const toastStore = useToastStore()
const revisions = ref([])
const loading = ref(true)
const error = ref(false)
const canRevert = ref(false)

// Fetch revision history
onMounted(async () => {
  try {
    const query = `
      query WikiPageHistory($pageId: Int!) {
        wikiPageHistory(pageId: $pageId) {
          id
          pageId
          revisionNumber
          editorId
          editSummary
          body
          bodyHTML
          timestamp
          editor {
            username
          }
        }
      }
    `

    const result = await useGraphQLQuery(query, { variables: { pageId: props.pageId } })
    revisions.value = result.data?.wikiPageHistory || []

    // Check if user can revert (wiki permission)
    // This would need to be passed from parent or fetched
    canRevert.value = false // Set based on permissions

    loading.value = false
  } catch (err) {
    error.value = true
    loading.value = false
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

const viewRevision = (revision: any) => {
  // Open in new window or modal
  const newWindow = window.open('', '_blank', 'width=800,height=600')
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>Revision #${revision.revisionNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { font-size: 24px; margin-bottom: 10px; }
            .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
            .content { line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>Revision #${revision.revisionNumber}</h1>
          <div class="meta">
            By ${revision.editor?.username || 'Unknown'} on ${formatDate(revision.timestamp)}
            ${revision.editSummary ? `<br>Summary: ${revision.editSummary}` : ''}
          </div>
          <div class="content">${revision.bodyHTML}</div>
        </body>
      </html>
    `)
    newWindow.document.close()
  }
}

const revertToRevision = async (revision: any) => {
  if (!confirm(`Are you sure you want to revert to revision #${revision.revisionNumber}?`)) {
    return
  }

  const mutationQuery = `
    mutation RevertWikiPage($input: RevertWikiPageInput!) {
      revertWikiPage(input: $input) {
        id
        revisionCount
      }
    }
  `

  try {
    await useGraphQLMutation(mutationQuery, {
      variables: {
        input: {
          pageId: props.pageId,
          revisionNumber: revision.revisionNumber,
        }
      }
    })

    toastStore.addNotification({
      header: 'Page reverted',
      message: `Reverted to revision #${revision.revisionNumber}`,
      type: 'success'
    })

    emit('close')

    // Reload the page to show reverted content
    window.location.href = `/b/${props.boardName}/wiki/${props.slug}`
  } catch (error) {
    toastStore.addNotification({
      header: 'Error',
      message: 'Failed to revert page',
      type: 'error'
    })
  }
}
</script>
