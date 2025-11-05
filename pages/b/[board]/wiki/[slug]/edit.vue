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

            <WikiEditor
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
import WikiEditor from '@/components/wiki/WikiEditor.vue'

const route = useRoute()
const boardStore = useBoardStore()
const toastStore = useToastStore()
const boardName = route.params.board as string
const slug = route.params.slug as string

// Fetch board data
const boardQuery = `
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

  boardStore.setBoard(boardData.value.board)
} catch (error) {
  console.error('Error fetching board:', error)
  throw createError({
    statusCode: 404,
    statusMessage: `Board "${boardName}" not found`,
    fatal: true
  })
}

// Fetch page data
const pageQuery = `
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

const { data: pageData, error: pageError } = await useGraphQLQuery(pageQuery, {
  variables: { boardName, slug }
})

if (pageError.value || !pageData.value?.wikiPage) {
  throw createError({
    statusCode: 404,
    statusMessage: `Wiki page "${slug}" not found`,
    fatal: true
  })
}

const page = pageData.value.wikiPage
const board = computed(() => boardStore.board)

// Check if user can edit
if (!page.canEdit) {
  throw createError({
    statusCode: 403,
    statusMessage: 'You do not have permission to edit this wiki page',
    fatal: true
  })
}

// Check if page is locked
if (page.isLocked) {
  const modPerms = board.value?.myModPermissions || 0
  const canModerate = (modPerms & 128) > 0 || (modPerms & 8191) === 8191

  if (!canModerate) {
    throw createError({
      statusCode: 403,
      statusMessage: 'This page is locked. Only moderators can edit it.',
      fatal: true
    })
  }
}

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
      variables: {
        input: {
          pageId: page.id,
          title: data.title,
          body: data.body,
          editSummary: data.editSummary,
        }
      }
    })

    if (result.data?.editWikiPage) {
      toastStore.addNotification({
        header: 'Wiki page updated',
        type: 'success'
      })
      navigateTo(`/b/${board.value.name}/wiki/${slug}`)
    }
  } catch (error) {
    toastStore.addNotification({
      header: 'Error',
      message: 'Failed to update wiki page',
      type: 'error'
    })
  }
}

const handleCancel = () => {
  navigateTo(`/b/${board.value.name}/wiki/${slug}`)
}

const SidebarBoard = defineAsyncComponent(() => import('@/components/containers/SidebarBoard.vue'))

definePageMeta({
  key: (route) => route.fullPath,
})

useHead({
  title: computed(() => `Edit ${page?.title} - ${board.value?.title} Wiki`),
})
</script>
