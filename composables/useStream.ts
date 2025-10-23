import { useDirectGraphQLRequest } from '@/composables/useGraphQL'
import type { CreateStreamInput, UpdateStreamInput } from '~/types/stream'

export const useStream = () => {
  const store = useStreamStore()

  return {
    // State
    streams: computed(() => store.streams),
    followedStreams: computed(() => store.followedStreams),
    navbarStreams: computed(() => store.navbarStreams),
    currentStream: computed(() => store.currentStream),
    loading: computed(() => store.loading),
    error: computed(() => store.error),

    // Getters
    myStreams: computed(() => store.myStreams),
    pinnedStreams: computed(() => store.pinnedStreams),
    unpinnedStreams: computed(() => store.unpinnedStreams),

    // Actions
    fetchMyStreams: () => store.fetchMyStreams(),
    fetchStream: (idOrSlug: number | string) => store.fetchStream(idOrSlug),
    createStream: (input: CreateStreamInput) => store.createStream(input),
    updateStream: (id: number, input: UpdateStreamInput) => store.updateStream(id, input),
    deleteStream: (id: number) => store.deleteStream(id),

    addFlairSubscriptions: (streamId: number, flairIds: number[]) =>
      store.addFlairSubscriptions(streamId, flairIds),
    addBoardSubscriptions: (streamId: number, boardIds: number[]) =>
      store.addBoardSubscriptions(streamId, boardIds),
    removeFlairSubscription: (streamId: number, flairId: number) =>
      store.removeFlairSubscription(streamId, flairId),
    removeBoardSubscription: (streamId: number, boardId: number) =>
      store.removeBoardSubscription(streamId, boardId),

    followStream: (streamId: number) => store.followStream(streamId),
    unfollowStream: (streamId: number) => store.unfollowStream(streamId),

    fetchFollowedStreams: () => store.fetchFollowedStreams(),
    fetchNavbarStreams: () => store.fetchNavbarStreams(),

    clearCurrentStream: () => store.clearCurrentStream(),
    clearError: () => store.clearError(),

    // Helper methods
    getStreamById: (id: number) => store.getStreamById(id),
    getStreamBySlug: (slug: string) => store.getStreamBySlug(slug),
    totalSubscriptionCount: (stream: any) => store.totalSubscriptionCount(stream),
  }
}

export const useStreamMutations = () => {
  const generateShareToken = async (streamId: number, expiresInDays?: number) => {
    try {
      const { data, error } = await useDirectGraphQLRequest<{
        generateShareToken: {
          token: string
          expiresAt?: string
          createdAt: string
        }
      }>(`
        mutation GenerateShareToken($streamId: Int!, $expiresInDays: Int) {
          generateShareToken(streamId: $streamId, expiresInDays: $expiresInDays) {
            token
            expiresAt
            createdAt
          }
        }
      `, { streamId, expiresInDays })

      if (error.value) throw error.value
      if (data.value?.generateShareToken) {
        return data.value.generateShareToken
      }

      throw new Error('Failed to generate share token')
    } catch (err) {
      console.error('Error generating share token:', err)
      throw err
    }
  }

  const revokeShareToken = async (streamId: number) => {
    try {
      const { data, error } = await useDirectGraphQLRequest<{
        revokeShareToken: { success: boolean }
      }>(`
        mutation RevokeShareToken($streamId: Int!) {
          revokeShareToken(streamId: $streamId) {
            success
          }
        }
      `, { streamId })

      if (error.value) throw error.value
      return data.value?.revokeShareToken?.success || false
    } catch (err) {
      console.error('Error revoking share token:', err)
      throw err
    }
  }

  const getStreamByShareToken = async (token: string) => {
    try {
      const { data, error } = await useDirectGraphQLRequest<{
        streamByShareToken: any
      }>(`
        query GetStreamByShareToken($token: String!) {
          streamByShareToken(token: $token) {
            id
            name
            slug
            description
            icon
            color
            sortType
            timeRange
            showNsfw
            creator {
              id
              username
              avatar
            }
            flairSubscriptions {
              id
              flair {
                id
                displayName
                color
                bgColor
              }
              board {
                id
                name
                title
              }
            }
            boardSubscriptions {
              id
              board {
                id
                name
                title
                icon
              }
            }
            aggregates {
              id
              followers
              flairSubscriptionCount
              boardSubscriptionCount
            }
          }
        }
      `, { token })

      if (error.value) throw error.value
      return data.value?.streamByShareToken
    } catch (err) {
      console.error('Error fetching stream by share token:', err)
      throw err
    }
  }

  return {
    generateShareToken,
    revokeShareToken,
    getStreamByShareToken,
  }
}
