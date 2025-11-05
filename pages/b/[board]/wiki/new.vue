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

            <WikiEditor
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
import WikiEditor from '@/components/wiki/WikiEditor.vue'

const route = useRoute()
const boardStore = useBoardStore()
const toastStore = useToastStore()
const boardName = route.params.board as string

// Fetch board data
const boardQuery = `
  query GetBoard($name: String!) {
    board(name: $name) {
      id
      name
      title
      description
      icon
      banner
      primaryColor
      secondaryColor
      subscribers
      postCount
      commentCount
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

try {
  const { data: boardData, error: boardError } = await useGraphQLQuery(boardQuery, {
    variables: { name: boardName }
  })

  if (boardError.value || !boardData.value?.board) {
    throw createError({
      statusCode: 404,
      statusMessage: `Board "${boardName}" not found`,
      fatal: true
    })
  }

  const boardResult = boardData.value.board

  // Check if wiki is enabled
  if (!boardResult.hasWiki || !boardResult.wikiEnabled) {
    throw createError({
      statusCode: 403,
      statusMessage: `Wiki is not enabled for /b/${boardName}`,
      fatal: true
    })
  }

  // Check if user can create pages
  const modPerms = boardResult.myModPermissions || 0
  const canCreatePage = (modPerms & 128) > 0 || (modPerms & 8191) === 8191

  if (!canCreatePage) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to create wiki pages',
      fatal: true
    })
  }

  boardStore.setBoard(boardResult)
} catch (error) {
  console.error('Error fetching board:', error)
  throw createError({
    statusCode: 404,
    statusMessage: `Board "${boardName}" not found`,
    fatal: true
  })
}

const board = computed(() => boardStore.board)
const shouldShowBoardBanner = computed(() => boardStore.hasBoard && board.value?.id)

const getSectionLinks = () => {
  const baseLinks = []
  const sectionOrder = board.value?.sectionOrder?.split(',').filter((s: string) => s.trim()) || []

  for (const section of sectionOrder) {
    if (section === 'feed' && board.value?.hasFeed) {
      baseLinks.push({ name: 'Feed', href: `/b/${board.value.name}/feed` })
    } else if (section === 'threads' && board.value?.hasThreads) {
      baseLinks.push({ name: 'Threads', href: `/b/${board.value.name}/threads` })
    } else if (section === 'wiki' && board.value?.hasWiki && board.value?.wikiEnabled) {
      baseLinks.push({ name: 'Wiki', href: `/b/${board.value.name}/wiki` })
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
          boardId: board.value.id,
          title: data.title,
          body: data.body,
        }
      }
    })

    if (result.error?.value) {
      console.error('GraphQL error:', result.error.value)
      toastStore.addNotification({
        header: 'Error',
        message: result.error.value.message || 'Failed to create wiki page',
        type: 'error'
      })
      return
    }

    if (result.data?.createWikiPage) {
      toastStore.addNotification({
        header: 'Wiki page created',
        type: 'success'
      })
      await navigateTo(`/b/${board.value.name}/wiki/${result.data.createWikiPage.slug}`)
    } else {
      console.error('No data returned from mutation')
      toastStore.addNotification({
        header: 'Error',
        message: 'No response from server',
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Mutation error:', error)
    toastStore.addNotification({
      header: 'Error',
      message: 'Failed to create wiki page',
      type: 'error'
    })
  }
}

const handleCancel = () => {
  navigateTo(`/b/${board.value.name}/wiki`)
}

const SidebarBoard = defineAsyncComponent(() => import('@/components/containers/SidebarBoard.vue'))

definePageMeta({
  key: (route) => route.fullPath,
})

useHead({
  title: computed(() => `Create Wiki Page - ${board.value?.title} Wiki`),
})
</script>
