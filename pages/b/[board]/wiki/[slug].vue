<template>
  <main id="page-wiki-view" class="flex flex-col pt-12 sm:pt-10">
    <!-- Banner Section -->
    <section class="flex-col">
      <div class="container mx-auto max-w-8xl grid grid-cols-12 sm:mt-20 sm:px-4 md:px-6">
        <CardsBoardBanner
          v-if="shouldShowBoardBanner"
          :board="board"
          :section-links="links"
          :key="board?.id"
          class="col-span-full"
        />
      </div>
    </section>

    <!-- Wiki Page Content -->
    <section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
      <div class="col-span-full flex gap-6">
        <div class="w-full">
          <!-- Page Header -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6 mb-4">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ page?.title }}</h1>
                <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Created by {{ page?.creator?.username || 'Unknown' }}</span>
                  <span v-if="page?.updated">Last edited {{ formatDate(page.updated) }}</span>
                  <button
                    @click="showHistory = true"
                    class="text-blue-600 hover:underline"
                  >
                    View History ({{ page?.revisionCount || 0 }} revisions)
                  </button>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button
                  v-if="page?.canEdit"
                  @click="navigateTo(`/b/${board?.name}/wiki/${slug}/edit`)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>

                <!-- More Actions Dropdown (for mods) -->
                <div v-if="canModerate" class="relative">
                  <button
                    @click="showModActions = !showModActions"
                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  <!-- Dropdown Menu -->
                  <div
                    v-if="showModActions"
                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
                  >
                    <button
                      @click="toggleLock"
                      class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {{ page?.isLocked ? 'Unlock' : 'Lock' }} Page
                    </button>
                    <button
                      @click="deletePage"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Delete Page
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Lock Notice -->
            <div v-if="page?.isLocked" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md p-3 mb-4">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span class="text-sm text-yellow-800 dark:text-yellow-200">This page is locked. Only moderators can edit it.</span>
              </div>
            </div>

            <!-- Page Content -->
            <div
              v-html="page?.bodyHTML"
              class="prose dark:prose-invert max-w-none mt-6"
            ></div>
          </div>

          <!-- Child Pages (if any) -->
          <div v-if="page?.children && page.children.length > 0" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Sub-pages</h2>
            <ul class="space-y-2">
              <li v-for="child in page.children" :key="child.id">
                <NuxtLink
                  :to="`/b/${board?.name}/wiki/${child.slug}`"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ child.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar -->
        <component :is="SidebarBoard" />
      </div>
    </section>

    <!-- History Modal -->
    <DialogsWikiHistory
      v-if="showHistory"
      :page-id="page?.id"
      :board-name="boardName"
      :slug="slug"
      @close="showHistory = false"
    />
  </main>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/stores/StoreBoard'
import { useToastStore } from '@/stores/StoreToast'
import CardsBoardBanner from '@/components/cards/BoardBanner.vue'

const route = useRoute()
const boardStore = useBoardStore()
const toastStore = useToastStore()
const boardName = route.params.board as string
const slug = route.params.slug as string

const showHistory = ref(false)
const showModActions = ref(false)

// Fetch board and page data
const { data: boardData } = await useAsyncData(
  `board-${boardName}`,
  async () => {
    const query = `
      query GetBoard($name: String!) {
        board(name: $name) {
          id
          name
          title
          hasFeed
          hasThreads
          hasWiki
          wikiEnabled
          sectionOrder
          defaultSection
          myModPermissions
        }
      }
    `

    const result = await useGraphQLQuery(query, { variables: { name: boardName } })
    return result.data?.board
  }
)

const { data: pageData, error: pageError, refresh: refreshPage } = await useAsyncData(
  `wiki-page-${boardName}-${slug}`,
  async () => {
    const query = `
      query WikiPage($boardName: String!, $slug: String!) {
        wikiPage(boardName: $boardName, slug: $slug) {
          id
          boardId
          slug
          title
          body
          bodyHTML
          creatorId
          creationDate
          updated
          lastEditedBy
          isLocked
          canEdit
          revisionCount
          creator { username }
          lastEditor { username }
          children { id title slug }
          parent { id title slug }
        }
      }
    `

    const result = await useGraphQLQuery(query, { variables: { boardName, slug } })
    return result.data?.wikiPage
  }
)

if (pageError.value || !pageData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Wiki page "${slug}" not found`,
  })
}

const board = boardData.value
const page = computed(() => pageData.value)

boardStore.setBoard(board)

const shouldShowBoardBanner = computed(() => boardStore.hasBoard && board?.id)

const canModerate = computed(() => {
  const modPerms = board?.myModPermissions || 0
  return (modPerms & 128) > 0 || (modPerms & 8191) === 8191
})

const getSectionLinks = () => {
  const baseLinks = []
  const sectionOrder = board?.sectionOrder?.split(',').filter((s: string) => s.trim()) || []

  for (const section of sectionOrder) {
    if (section === 'feed' && board?.hasFeed) {
      baseLinks.push({ name: 'Feed', href: `/b/${board.name}/feed` })
    } else if (section === 'threads' && board?.hasThreads) {
      baseLinks.push({ name: 'Threads', href: `/b/${board.name}/threads` })
    } else if (section === 'wiki' && board?.hasWiki) {
      baseLinks.push({ name: 'Wiki', href: `/b/${board.name}/wiki` })
    }
  }

  return baseLinks
}

const links = computed(() => getSectionLinks())

// Actions
const toggleLock = async () => {
  const mutation = page.value?.isLocked ? 'UnlockWikiPage' : 'LockWikiPage'
  const mutationQuery = `
    mutation ${mutation}($pageId: Int!) {
      ${mutation === 'LockWikiPage' ? 'lockWikiPage' : 'unlockWikiPage'}(pageId: $pageId) {
        id
        isLocked
      }
    }
  `

  try {
    await useGraphQLMutation(mutationQuery, { variables: { pageId: page.value?.id } })
    toastStore.addNotification({
      header: page.value?.isLocked ? 'Page unlocked' : 'Page locked',
      type: 'success'
    })
    showModActions.value = false
    await refreshPage()
  } catch (error) {
    toastStore.addNotification({
      header: 'Error',
      message: 'Failed to toggle page lock',
      type: 'error'
    })
  }
}

const deletePage = async () => {
  if (!confirm('Are you sure you want to delete this page? It can be restored later.')) return

  const mutationQuery = `
    mutation DeleteWikiPage($pageId: Int!) {
      deleteWikiPage(pageId: $pageId)
    }
  `

  try {
    await useGraphQLMutation(mutationQuery, { variables: { pageId: page.value?.id } })
    toastStore.addNotification({
      header: 'Page deleted',
      type: 'success'
    })
    navigateTo(`/b/${board?.name}/wiki`)
  } catch (error) {
    toastStore.addNotification({
      header: 'Error',
      message: 'Failed to delete page',
      type: 'error'
    })
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

const SidebarBoard = defineAsyncComponent(() => import('@/components/containers/SidebarBoard.vue'))

definePageMeta({
  key: (route) => route.fullPath,
})

useHead({
  title: computed(() => `${page.value?.title || slug} - ${board?.title} Wiki`),
})
</script>
