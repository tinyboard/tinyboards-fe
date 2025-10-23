import type { StreamPost } from '~/types/stream'

interface StreamFeedState {
  posts: StreamPost[]
  page: number
  hasMore: boolean
  total: number
  loading: boolean
  error: string | null
}

export const useStreamFeed = (streamId: Ref<number> | number) => {
  const store = useStreamStore()
  const streamIdRef = isRef(streamId) ? streamId : ref(streamId)

  const state = reactive<StreamFeedState>({
    posts: [],
    page: 1,
    hasMore: false,
    total: 0,
    loading: false,
    error: null,
  })

  const fetchPosts = async (reset: boolean = false) => {
    if (state.loading) return

    state.loading = true
    state.error = null

    if (reset) {
      state.page = 1
      state.posts = []
    }

    try {
      const result = await store.getStreamPosts(streamIdRef.value, state.page)

      if (result) {
        if (state.page === 1) {
          state.posts = result.posts
        } else {
          state.posts = [...state.posts, ...result.posts]
        }

        state.hasMore = result.hasMore
        state.total = result.total
      }
    } catch (err: any) {
      state.error = err.message || 'Failed to fetch posts'
    } finally {
      state.loading = false
    }
  }

  const loadMore = async () => {
    if (!state.hasMore || state.loading) return

    state.page++
    await fetchPosts()
  }

  const refresh = async () => {
    await fetchPosts(true)
  }

  // Auto-fetch on mount
  onMounted(() => {
    fetchPosts(true)
  })

  // Watch for stream ID changes
  watch(streamIdRef, () => {
    fetchPosts(true)
  })

  return {
    posts: computed(() => state.posts),
    page: computed(() => state.page),
    hasMore: computed(() => state.hasMore),
    total: computed(() => state.total),
    loading: computed(() => state.loading),
    error: computed(() => state.error),

    fetchPosts,
    loadMore,
    refresh,
  }
}

// Infinite scroll composable
export const useStreamInfiniteScroll = (
  streamId: Ref<number> | number,
  options: {
    threshold?: number
    enabled?: Ref<boolean> | boolean
  } = {}
) => {
  const { threshold = 200, enabled = true } = options
  const enabledRef = isRef(enabled) ? enabled : ref(enabled)

  const feed = useStreamFeed(streamId)
  const containerRef = ref<HTMLElement | null>(null)

  const handleScroll = () => {
    if (!enabledRef.value || !containerRef.value || feed.loading.value || !feed.hasMore.value) {
      return
    }

    const container = containerRef.value
    const scrollPosition = container.scrollTop + container.clientHeight
    const scrollHeight = container.scrollHeight

    if (scrollHeight - scrollPosition < threshold) {
      feed.loadMore()
    }
  }

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', handleScroll)
    }
  })

  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    ...feed,
    containerRef,
  }
}
