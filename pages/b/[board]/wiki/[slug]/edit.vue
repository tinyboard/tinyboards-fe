<template>
  <main id="page-wiki-edit" class="flex flex-col pt-12 sm:pt-10">
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

    <!-- Wiki Page Editing -->
    <section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
      <div class="col-span-full flex gap-6">
        <div class="w-full">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Wiki Page</h1>

            <WikiWikiEditor
              v-if="page"
              :title="page.title"
              :body="page.body"
              :page-id="page.id"
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
const slug = route.params.slug as string

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

    const result = await useGraphQLQuery(query, { name: boardName })
    return result.data?.board
  }
)

const { data: pageData, error: pageError } = await useAsyncData(
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
          isLocked
          canEdit
        }
      }
    `

    const result = await useGraphQLQuery(query, { boardName, slug })
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
const page = pageData.value

// Check if user can edit
if (!page.canEdit) {
  throw createError({
    statusCode: 403,
    statusMessage: 'You do not have permission to edit this wiki page',
  })
}

// Check if page is locked
if (page.isLocked) {
  const modPerms = board?.myModPermissions || 0
  const canModerate = (modPerms & 128) > 0 || (modPerms & 8191) === 8191

  if (!canModerate) {
    throw createError({
      statusCode: 403,
      statusMessage: 'This page is locked. Only moderators can edit it.',
    })
  }
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
    mutation EditWikiPage($input: EditWikiPageInput!) {
      editWikiPage(input: $input) {
        id
        title
        bodyHTML
        updated
        revisionCount
      }
    }
  `

  try {
    const result = await useGraphQLMutation(mutationQuery, {
      input: {
        pageId: page.id,
        title: data.title,
        body: data.body,
        editSummary: data.editSummary,
      }
    })

    if (result.data?.editWikiPage) {
      toastStore.addNotification({
        title: 'Wiki page updated',
        type: 'success'
      })
      navigateTo(`/b/${board.name}/wiki/${slug}`)
    }
  } catch (error) {
    toastStore.addNotification({
      title: 'Error',
      body: 'Failed to update wiki page',
      type: 'error'
    })
  }
}

const handleCancel = () => {
  navigateTo(`/b/${board.name}/wiki/${slug}`)
}

const SidebarBoard = defineAsyncComponent(() => import('@/components/containers/SidebarBoard.vue'))

definePageMeta({
  key: (route) => route.fullPath,
})

useHead({
  title: computed(() => `Edit ${page?.title} - ${board?.title} Wiki`),
})
</script>
