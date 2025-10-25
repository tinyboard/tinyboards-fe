<template>
  <main id="page-stream" class="flex flex-col pt-12 sm:pt-10">
    <!-- Error State -->
    <div v-if="error && initialLoadComplete" class="container mx-auto max-w-8xl p-4">
      <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
        <NuxtLink
          to="/streams"
          class="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to Streams
        </NuxtLink>
      </div>
    </div>

    <!-- Stream Feed -->
    <template v-else-if="stream && initialLoadComplete">
      <!-- Banner Section -->
      <section v-if="stream" class="flex-col flex">
        <div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-8 sm:px-4 md:px-6">
          <LazyCardsBanner
            :title="stream.name || 'Stream'"
            :sub-title="stream.description || `Custom content stream by @${stream.creator?.name || 'Unknown'}`"
            :image-url="site.homepageBanner"
            :icon-type="site.homepageBanner ? undefined : 'posts'"
            class="col-span-full"
          />
        </div>
      </section>

      <!-- Main Content -->
      <section v-if="stream" class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
        <div class="col-span-full flex flex-col md:flex-row gap-6">
          <div class="w-full md:flex-1 flex flex-col gap-4">
          <!-- Feed/Threads Tabs -->
          <div class="flex items-center gap-2 p-2 bg-white dark:bg-gray-950 border-b sm:border sm:shadow-inner-white sm:rounded-t-md dark:border-gray-800 dark:shadow-none">
            <button
              @click="activeTab = 'feed'"
              :class="[
                'px-4 py-2 rounded-md font-medium text-sm transition-colors',
                activeTab === 'feed'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
            >
              Feed
            </button>
            <button
              @click="activeTab = 'threads'"
              :class="[
                'px-4 py-2 rounded-md font-medium text-sm transition-colors',
                activeTab === 'threads'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
            >
              Threads
            </button>
          </div>

          <!-- Sort & View Options -->
          <div class="flex items-center p-2.5 sm:px-4 sm:py-3 bg-white dark:bg-gray-950 border-b sm:border sm:shadow-inner-white dark:border-gray-800 dark:shadow-none">
            <MenusSort :current-sort="sortType" @update:sort="sortType = $event" />
            <div class="ml-auto flex space-x-2">
              <button @click="preferCardView = true">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="preferCardView ? 'text-primary' : 'text-gray-500'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <rect x="4" y="4" width="16" height="6" rx="2"></rect>
                  <rect x="4" y="14" width="16" height="6" rx="2"></rect>
                </svg>
              </button>
              <button @click="preferCardView = false">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="preferCardView ? 'text-gray-500' : 'text-primary'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- Posts -->
          <div v-if="currentPostsLoading && currentPosts.length === 0" class="flex justify-center py-12 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md dark:border-gray-800">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>

          <template v-else-if="currentPosts.length > 0">
            <!-- Posts List -->
            <div class="flex flex-col" :class="preferCardView ? 'space-y-2 sm:space-y-4' : 'border-y sm:border-x rounded-md divide-y'">
              <CardsPost
                v-for="post in currentPosts"
                :key="post.id"
                :post="post"
                :is-compact="!preferCardView"
              />
            </div>

            <!-- Load More -->
            <div v-if="currentHasMore" class="flex justify-center py-6">
              <button
                v-if="!currentPostsLoading"
                @click="loadMore"
                class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Load More
              </button>
              <div v-else class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </template>

          <div v-else class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
            <p>
              <span class="font-medium">No {{ activeTab === 'feed' ? 'feed posts' : 'threads' }} yet</span>
              <br />
              {{ activeTab === 'feed' ? 'Feed posts' : 'Threads' }} from subscribed sources will appear here
            </p>
          </div>
          </div>

          <!-- Sidebar -->
          <ContainersStreamSidebar
            v-if="stream"
            :stream="stream"
            :is-owner="isOwner"
            :follow-loading="followLoading"
            @edit="handleEdit"
            @delete="handleDelete"
            @toggle-follow="toggleFollow"
          />
        </div>
      </section>
    </template>

    <!-- Loading State (default fallback) -->
    <div v-else class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Post } from '@/types/types'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { fetchStream, loading, error } = useStream()
const authStore = useLoggedInUser()
const site = useSiteStore()

const stream = computed(() => useStreamStore().currentStream)
const currentUser = computed(() => authStore.user)
const initialLoadComplete = ref(false)

// Active tab state
const activeTab = ref<'feed' | 'threads'>('feed')

// Feed posts state
const feedPosts = ref<Post[]>([])
const feedLoading = ref(false)
const feedHasMore = ref(true)
const feedOffset = ref(0)

// Thread posts state
const threadPosts = ref<Post[]>([])
const threadLoading = ref(false)
const threadHasMore = ref(true)
const threadOffset = ref(0)

// View preferences
const sortType = ref<string>('hot')
const preferCardView = ref(true)

// Computed properties for current tab
const currentPosts = computed(() => {
  const posts = activeTab.value === 'feed' ? feedPosts.value : threadPosts.value

  // Add stream context to post URLs for breadcrumb navigation
  if (!stream.value) return posts

  return posts.map(post => {
    if (!post.urlPath) return post

    // Add query params to urlPath for stream context
    const separator = post.urlPath.includes('?') ? '&' : '?'
    const streamParams = `streamSlug=${encodeURIComponent(stream.value.slug)}&streamName=${encodeURIComponent(stream.value.name)}&streamCreator=${encodeURIComponent(stream.value.creator?.name || '')}`

    return {
      ...post,
      urlPath: `${post.urlPath}${separator}${streamParams}`
    }
  })
})

const currentPostsLoading = computed(() => {
  return activeTab.value === 'feed' ? feedLoading.value : threadLoading.value
})

const currentHasMore = computed(() => {
  return activeTab.value === 'feed' ? feedHasMore.value : threadHasMore.value
})

const totalSources = computed(() => {
  if (!stream.value) return 0
  return (stream.value.flairSubscriptionCount || 0) + (stream.value.boardSubscriptionCount || 0)
})

const isOwner = computed(() => {
  if (!currentUser.value || !stream.value) return false
  return currentUser.value.id === stream.value.creatorId
})

// Follow state
const followLoading = ref(false)

// Fetch stream by slug - use onMounted for client-only to avoid SSR auth issues
onMounted(async () => {
  // Skip if already loaded from SSR
  if (initialLoadComplete.value) return

  const slug = route.params.slug as string
  let username = route.params.username as string

  // Always extract username from path since @ is part of the path structure
  if (route.path) {
    const pathMatch = route.path.match(/\/streams\/@([^\/]+)\//)
    if (pathMatch) {
      username = pathMatch[1]
    }
  }

  if (slug && username) {
    try {
      const cleanUsername = username.startsWith('@') ? username.slice(1) : username
      await fetchStream(slug, cleanUsername)

      // Fetch initial posts after stream loads
      if (stream.value) {
        await fetchPosts('feed')
        await fetchPosts('threads')
      }
    } catch (err: any) {
      console.error('Failed to load stream:', err)
      error.value = `Stream not found (searched for @${cleanUsername}/${slug}). It may have been deleted or you don't have permission to view it.`
    } finally {
      initialLoadComplete.value = true
    }
  } else {
    initialLoadComplete.value = true
  }
})

// Also run on server side for SSR
if (process.server) {
  const slug = route.params.slug as string
  let username = route.params.username as string

  if (route.path) {
    const pathMatch = route.path.match(/\/streams\/@([^\/]+)\//)
    if (pathMatch) {
      username = pathMatch[1]
    }
  }

  if (slug && username) {
    try {
      const cleanUsername = username.startsWith('@') ? username.slice(1) : username
      await fetchStream(slug, cleanUsername)

      if (stream.value) {
        await fetchPosts('feed')
        await fetchPosts('threads')
      }
      initialLoadComplete.value = true
    } catch (err: any) {
      console.error('[SSR] Failed to load stream:', err)
      error.value = `Stream not found (searched for @${cleanUsername}/${slug}). It may have been deleted or you don't have permission to view it.`
      initialLoadComplete.value = true
    }
  } else {
    initialLoadComplete.value = true
  }
}

// Fetch posts for a specific type
const fetchPosts = async (postType: 'feed' | 'threads', loadMore = false) => {
  if (!stream.value) return

  const isLoading = postType === 'feed' ? feedLoading : threadLoading
  const currentOffsetRef = postType === 'feed' ? feedOffset : threadOffset
  const postsRef = postType === 'feed' ? feedPosts : threadPosts
  const hasMoreRef = postType === 'feed' ? feedHasMore : threadHasMore

  if (isLoading.value) return

  isLoading.value = true

  try {
    const offset = loadMore ? currentOffsetRef.value : 0

    const { data, error: postsError } = await useGraphQLQuery(`
      query GetStreamPosts($streamId: Int!, $sortType: SortType!, $offset: Int!, $limit: Int!, $postType: String!) {
        streamPosts(streamId: $streamId, sortType: $sortType, offset: $offset, limit: $limit, postType: $postType) {
          id
          title
          titleChunk
          slug
          urlPath
          url
          isLocked
          featuredBoard
          isNSFW
          featuredLocal
          isRemoved
          creationDate
          updated
          score
          upvotes
          downvotes
          myVote
          creatorVote
          board {
            id
            name
            title
            description
            icon
            banner
            isNSFW
            subscribedType
          }
          creator {
            id
            name
            displayName
            avatar
            isAdmin
            isBanned
          }
          commentCount
          isSaved
        }
      }
    `, {
      variables: {
        streamId: stream.value.id,
        sortType: sortType.value.toLowerCase(),
        offset,
        limit: 25,
        postType: postType === 'feed' ? 'feed' : 'thread'
      }
    })

    if (postsError.value) {
      console.error('Failed to fetch posts:', postsError.value)
      useToast().addNotification({
        header: 'Error',
        message: `Failed to load ${postType === 'feed' ? 'feed posts' : 'threads'}`,
        type: 'error'
      })
      return
    }

    if (data.value?.streamPosts) {
      if (loadMore) {
        postsRef.value = [...postsRef.value, ...data.value.streamPosts]
        currentOffsetRef.value += 25
      } else {
        postsRef.value = data.value.streamPosts
        currentOffsetRef.value = 25
      }

      hasMoreRef.value = data.value.streamPosts.length === 25
    }
  } catch (err) {
    console.error('Error fetching posts:', err)
  } finally {
    isLoading.value = false
  }
}

// Load more posts
const loadMore = () => {
  const isLoading = activeTab.value === 'feed' ? feedLoading.value : threadLoading.value
  const hasMore = activeTab.value === 'feed' ? feedHasMore.value : threadHasMore.value

  if (!isLoading && hasMore) {
    fetchPosts(activeTab.value, true)
  }
}

// Refetch when sort changes
watch(sortType, () => {
  feedOffset.value = 0
  threadOffset.value = 0
  fetchPosts('feed')
  fetchPosts('threads')
})

// Refetch when tab changes
watch(activeTab, (newTab) => {
  const posts = newTab === 'feed' ? feedPosts.value : threadPosts.value
  if (posts.length === 0) {
    fetchPosts(newTab)
  }
})

// Toggle follow
const toggleFollow = async () => {
  if (!stream.value || !currentUser.value || followLoading.value) return

  followLoading.value = true

  try {
    if (stream.value.isFollowing) {
      // Unfollow
      const { error: unfollowError } = await useGraphQLMutation(`
        mutation UnfollowStream($streamId: Int!) {
          unfollowStream(streamId: $streamId)
        }
      `, {
        variables: { streamId: stream.value.id }
      })

      if (unfollowError.value) {
        console.error('Failed to unfollow:', unfollowError.value)
        useToast().addNotification({
          header: 'Error',
          message: 'Failed to unfollow stream',
          type: 'error'
        })
        return
      }

      // Update local state
      stream.value.isFollowing = false
      stream.value.followerCount = Math.max(0, (stream.value.followerCount || 0) - 1)

      useToast().addNotification({
        header: 'Success',
        message: 'Unfollowed stream',
        type: 'success'
      })
    } else {
      // Follow
      const { error: followError } = await useGraphQLMutation(`
        mutation FollowStream($input: FollowStreamInput!) {
          followStream(input: $input)
        }
      `, {
        variables: {
          input: {
            streamId: stream.value.id,
            addToNavbar: false
          }
        }
      })

      if (followError.value) {
        console.error('Failed to follow:', followError.value)
        useToast().addNotification({
          header: 'Error',
          message: 'Failed to follow stream',
          type: 'error'
        })
        return
      }

      // Update local state
      stream.value.isFollowing = true
      stream.value.followerCount = (stream.value.followerCount || 0) + 1

      useToast().addNotification({
        header: 'Success',
        message: 'Following stream',
        type: 'success'
      })
    }
  } catch (err) {
    console.error('Error toggling follow:', err)
  } finally {
    followLoading.value = false
  }
}

// Dynamic head based on stream
useHead(() => ({
  title: stream.value ? `${stream.value.name} - Stream` : 'Stream',
  meta: [
    {
      name: 'description',
      content: stream.value?.description || 'Custom content stream'
    }
  ]
}))

const handleEdit = () => {
  if (stream.value) {
    router.push(`/streams/${stream.value.id}/edit`)
  }
}

const handleDelete = () => {
  // Redirect to streams page after deletion
  router.push('/streams')
}

// Clear stream on unmount
onUnmounted(() => {
  useStreamStore().clearCurrentStream()
})
</script>
