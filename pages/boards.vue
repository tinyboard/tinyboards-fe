<template>
  <main class="flex flex-col pt-12 sm:pt-10">
    <!-- Page Header -->
    <section class="flex-col">
      <div class="container mx-auto max-w-8xl grid grid-cols-12 sm:mt-8 sm:px-4 md:px-6">
        <!-- Banner -->
        <div class="bg-white dark:bg-gray-950 border dark:border-gray-800 shadow-inner-xs sm:border sm:rounded-md overflow-hidden col-span-full">
          <div class="relative h-32 sm:h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500">
            <!-- Overlay for better text readability -->
            <div class="absolute inset-0 bg-black bg-opacity-20"></div>

            <!-- Content overlay -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center text-white">
                <div class="flex justify-center mb-3">
                  <div class="bg-white bg-opacity-20 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold mb-2">
                  Discover Boards
                </h1>
                <p class="text-sm sm:text-base opacity-90">
                  Explore communities and find your next favorite discussion.
                </p>
              </div>
            </div>

            <!-- Decorative SVG elements -->
            <div class="absolute top-4 left-4 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="absolute top-4 right-4 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div class="absolute bottom-4 left-6 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="absolute bottom-4 right-6 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
      <div class="col-span-full">

        <!-- Search and Filters -->
        <div class="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-6 shadow-sm">
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Search Input -->
            <div class="flex-1">
              <label for="search" class="sr-only">Search boards</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search boards by name or description..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <!-- Sort Dropdown -->
            <div class="flex-shrink-0 relative">
              <select
                v-model="sortBy"
                class="appearance-none block w-full px-3 py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm cursor-pointer"
              >
                <option value="subscribers">Most Members</option>
                <option value="posts">Most Posts</option>
                <option value="name">Alphabetical</option>
                <option value="created">Newest</option>
                <option value="active">Most Active</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {{ filteredBoards.length }} of {{ allBoards.length }} boards
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="n in 8" :key="n" class="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4 animate-pulse">
            <div class="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div class="space-y-3">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-medium mb-2">Failed to load boards</h3>
            <p class="text-sm">There was an error loading the board list. Please try again later.</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredBoards.length === 0 && searchQuery" class="text-center py-12">
          <div class="text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="text-lg font-medium mb-2">No boards found</h3>
            <p class="text-sm">Try adjusting your search terms or browse all boards.</p>
            <button
              @click="searchQuery = ''"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary bg-opacity-10 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Clear search
            </button>
          </div>
        </div>

        <!-- Board Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CardsBoardCard
            v-for="board in filteredBoards"
            :key="board.id"
            :board="board"
          />
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore && !pending" class="text-center mt-8">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loadingMore" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loadingMore ? 'Loading...' : 'Load More Boards' }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGraphQLQuery } from '@/composables/useGraphQL'
import CardsBoardCard from '@/components/cards/BoardCard.vue'

definePageMeta({
  title: 'Boards',
  key: (route) => route.fullPath,
})

useHead({
  title: 'Boards',
  meta: [
    { name: 'description', content: 'Explore and discover all the boards available on the platform. Find communities that match your interests.' }
  ]
})

// Reactive state
const searchQuery = ref('')
const sortBy = ref('subscribers')
const limit = ref(20)
const loadingMore = ref(false)

// Fetch boards data
const { data: boardsData, pending, error, refresh } = await useGraphQLQuery(`
  query GetAllBoards($limit: Int!) {
    listBoards(limit: $limit) {
      id
      name
      title
      description
      icon
      banner
      primaryColor
      secondaryColor
      hoverColor
      subscribers
      postCount
      commentCount
      usersActiveDay
      usersActiveWeek
      usersActiveMonth
      creationDate
      isNSFW
    }
  }
`, {
  variables: { limit: limit.value }
})

const allBoards = computed(() => boardsData.value?.listBoards || [])
const hasMore = computed(() => allBoards.value.length >= limit.value)

// Filtered and sorted boards
const filteredBoards = computed(() => {
  let boards = [...allBoards.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    boards = boards.filter(board =>
      board.name.toLowerCase().includes(query) ||
      board.title?.toLowerCase().includes(query) ||
      board.description?.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  boards.sort((a, b) => {
    switch (sortBy.value) {
      case 'subscribers':
        return (b.subscribers || 0) - (a.subscribers || 0)
      case 'posts':
        return (b.postCount || 0) - (a.postCount || 0)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'created':
        return new Date(b.creationDate) - new Date(a.creationDate)
      case 'active':
        return (b.usersActiveDay || 0) - (a.usersActiveDay || 0)
      default:
        return 0
    }
  })

  return boards
})

// Load more boards
const loadMore = async () => {
  if (loadingMore.value) return

  loadingMore.value = true
  try {
    const newLimit = limit.value + 20
    const { data: moreData } = await useGraphQLQuery(`
      query GetMoreBoards($limit: Int!) {
        listBoards(limit: $limit) {
          id
          name
          title
          description
          icon
          banner
          primaryColor
          secondaryColor
          hoverColor
          subscribers
          postCount
          commentCount
          usersActiveDay
          usersActiveWeek
          usersActiveMonth
          creationDate
          isNSFW
        }
      }
    `, {
      variables: { limit: newLimit }
    })

    if (moreData.value) {
      boardsData.value = moreData.value
      limit.value = newLimit
    }
  } catch (error) {
    console.error('Failed to load more boards:', error)
  } finally {
    loadingMore.value = false
  }
}

// Watch for search changes and clear results to show immediate feedback
watch(searchQuery, () => {
  // Debounce could be added here if needed
})
</script>