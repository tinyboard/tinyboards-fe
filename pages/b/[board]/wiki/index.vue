<template>
  <main id="page-wiki" class="flex flex-col pt-12 sm:pt-10">
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

    <!-- Wiki Index Section -->
    <section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
      <div class="col-span-full flex gap-6">
        <div class="w-full space-y-4">
          <!-- Wiki Page List -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Wiki Pages</h2>
              <button
                v-if="canCreatePage"
                @click="navigateTo(`/b/${board?.name}/wiki/new`)"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Page
              </button>
            </div>

            <!-- Empty State -->
            <div v-if="pages.length === 0 && !loading" class="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No wiki pages yet</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ canCreatePage ? 'Get started by creating a new page.' : 'Check back later when moderators add wiki pages.' }}
              </p>
            </div>

            <!-- Page List -->
            <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <li v-for="page in pages" :key="page.id" class="py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md px-2 transition-colors">
                <NuxtLink :to="`/b/${board?.name}/wiki/${page.slug}`" class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline">{{ page.title }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Created by {{ page.creator?.username || 'Unknown' }}
                      <span v-if="page.updated"> • Last edited {{ formatDate(page.updated) }}</span>
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar -->
        <component :is="SidebarBoard" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/stores/StoreBoard'
import CardsBoardBanner from '@/components/cards/BoardBanner.vue'

const route = useRoute()
const boardStore = useBoardStore()
const boardName = route.params.board as string

// Fetch board data
const { data: boardData, error: boardError } = await useAsyncData(
  `board-${boardName}`,
  async () => {
    const query = `
      query GetBoard($name: String!) {
        board(name: $name) {
          id
          name
          title
          description
          icon
          banner
          hasFeed
          hasThreads
          hasWiki
          wikiEnabled
          sectionOrder
          defaultSection
          myModPermissions
          subscribedType
          subscribers
          postCount
        }
      }
    `

    const result = await useGraphQLQuery(query, { name: boardName })
    return result.data?.board
  }
)

if (boardError.value || !boardData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Board "${boardName}" not found`,
  })
}

const board = boardData.value

// Check if wiki is enabled
if (!board.hasWiki || !board.wikiEnabled) {
  throw createError({
    statusCode: 403,
    statusMessage: `Wiki is not enabled for /b/${boardName}`,
  })
}

// Store board in Pinia
boardStore.setBoard(board)

// Fetch wiki pages
const { data: pagesData, pending: loading } = await useAsyncData(
  `wiki-pages-${boardName}`,
  async () => {
    const query = `
      query ListWikiPages($boardName: String!) {
        listWikiPages(boardName: $boardName) {
          id
          slug
          title
          creationDate
          updated
          creator {
            username
          }
        }
      }
    `

    const result = await useGraphQLQuery(query, { boardName })
    return result.data?.listWikiPages || []
  }
)

const pages = computed(() => pagesData.value || [])

// Check if user can create pages
const canCreatePage = computed(() => {
  const modPerms = board.myModPermissions || 0
  // Wiki permission is bit 128 (bit 7)
  return (modPerms & 128) > 0 || (modPerms & 8191) === 8191 // Wiki or Full perms
})

const shouldShowBoardBanner = computed(() => boardStore.hasBoard && board?.id)

// Generate section links
const getSectionLinks = () => {
  const baseLinks = []
  const sectionOrder = board?.sectionOrder?.split(',').filter((s: string) => s.trim()) || ['feed', 'threads', 'wiki']

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

// Utility function to format dates
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

// Lazy load sidebar
const SidebarBoard = defineAsyncComponent(() => import('@/components/containers/SidebarBoard.vue'))

// Page metadata
definePageMeta({
  key: (route) => route.fullPath,
})

useHead({
  title: computed(() => `${board?.title ?? board?.name ?? 'Unknown Board'} - Wiki`),
})
</script>
