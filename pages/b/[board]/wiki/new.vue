<template>
  <main id="page-wiki-new" class="flex flex-col pt-12 sm:pt-10">
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

    <!-- Wiki Page Creation -->
    <section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
      <div class="col-span-full flex gap-6">
        <div class="w-full">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Wiki Page</h1>

            <WikiWikiEditor
              @save="handleSave"
              @cancel="handleCancel"
            />
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
import { useToastStore } from '@/stores/StoreToast'
import CardsBoardBanner from '@/components/cards/BoardBanner.vue'

const route = useRoute()
const boardStore = useBoardStore()
const toastStore = useToastStore()
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

// Check if user can create pages
const modPerms = board.myModPermissions || 0
const canCreatePage = (modPerms & 128) > 0 || (modPerms & 8191) === 8191

if (!canCreatePage) {
  throw createError({
    statusCode: 403,
    statusMessage: 'You do not have permission to create wiki pages',
  })
}

boardStore.setBoard(board)

const shouldShowBoardBanner = computed(() => boardStore.hasBoard && board?.id)

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

const handleSave = async (data: { title: string; body: string; editSummary: string }) => {
  const mutationQuery = `
    mutation CreateWikiPage($input: CreateWikiPageInput!) {
      createWikiPage(input: $input) {
        id
        slug
        title
        bodyHTML
      }
    }
  `

  try {
    const result = await useGraphQLMutation(mutationQuery, {
      variables: {
        input: {
          boardId: board.id,
          title: data.title,
          body: data.body,
        }
      }
    })

    if (result.data?.createWikiPage) {
      toastStore.addNotification({
        header: 'Wiki page created',
        type: 'success'
      })
      navigateTo(`/b/${board.name}/wiki/${result.data.createWikiPage.slug}`)
    }
  } catch (error) {
    toastStore.addNotification({
      header: 'Error',
      message: 'Failed to create wiki page',
      type: 'error'
    })
  }
}

const handleCancel = () => {
  navigateTo(`/b/${board.name}/wiki`)
}

const SidebarBoard = defineAsyncComponent(() => import('@/components/containers/SidebarBoard.vue'))

definePageMeta({
  key: (route) => route.fullPath,
})

useHead({
  title: computed(() => `Create Wiki Page - ${board?.title} Wiki`),
})
</script>
