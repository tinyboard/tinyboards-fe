import { defineStore } from 'pinia'
import { useDirectGraphQLRequest } from '@/composables/useGraphQL'
import type { Stream, StreamPost, CreateStreamInput, UpdateStreamInput } from '~/types/stream'

interface StreamState {
  streams: Stream[]
  followedStreams: Stream[]
  navbarStreams: Stream[]
  currentStream: Stream | null
  currentStreamPosts: StreamPost[]
  hasMorePosts: boolean
  totalPosts: number
  loading: boolean
  error: string | null
}

export const useStreamStore = defineStore('stream', {
  state: (): StreamState => ({
    streams: [],
    followedStreams: [],
    navbarStreams: [],
    currentStream: null,
    currentStreamPosts: [],
    hasMorePosts: false,
    totalPosts: 0,
    loading: false,
    error: null,
  }),

  getters: {
    myStreams: (state) => state.streams,

    pinnedStreams: (state) =>
      state.streams.filter(s => s.addedToNavbar),

    unpinnedStreams: (state) =>
      state.streams.filter(s => !s.addedToNavbar),

    getStreamById: (state) => (id: number) =>
      state.streams.find(s => s.id === id) ||
      state.followedStreams.find(s => s.id === id),

    getStreamBySlug: (state) => (slug: string) =>
      state.streams.find(s => s.slug === slug) ||
      state.followedStreams.find(s => s.slug === slug),

    totalSubscriptionCount: () => (stream: Stream) =>
      stream.aggregates.flairSubscriptionCount + stream.aggregates.boardSubscriptionCount,
  },

  actions: {
    async fetchMyStreams() {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await useDirectGraphQLRequest<{ myStreams: Stream[] }>(`
          query GetMyStreams {
            myStreams {
              id
              name
              slug
              description
              icon
              color
              isPublic
              creatorId
              creator {
                id
                name
                displayName
                avatar
                isAdmin
              }
              creationDate
              updated
              followerCount
              totalSubscriptions
              flairSubscriptionCount
              boardSubscriptionCount
              isFollowing
              addedToNavbar
            }
          }
        `)

        if (error.value) throw error.value
        if (data.value?.myStreams) {
          // Transform the data to match our Store interface
          this.streams = data.value.myStreams.map((stream: any) => ({
            ...stream,
            // Keep the creator object if it exists, otherwise create minimal one
            creator: stream.creator || { id: stream.creatorId },
            isFollowedByMe: stream.isFollowing,
            aggregates: {
              id: stream.id,
              streamId: stream.id,
              followers: stream.followerCount || 0,
              flairSubscriptionCount: stream.flairSubscriptionCount || 0,
              boardSubscriptionCount: stream.boardSubscriptionCount || 0
            }
          }))
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch streams'
        console.error('Error fetching my streams:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchStream(idOrSlug: number | string, creatorUsername?: string) {
      this.loading = true
      this.error = null


      try {
        const query = typeof idOrSlug === 'number'
          ? `
            query GetStreamById($id: Int!) {
              stream(id: $id) {
                id
                name
                slug
                description
                icon
                color
                isPublic
                isDiscoverable
                sortType
                timeRange
                showNsfw
                maxPostsPerBoard
                addedToNavbar
                isFollowing
                creatorId
                creator {
                  id
                  name
                  displayName
                  avatar
                  isAdmin
                }
                followerCount
                totalSubscriptions
                flairSubscriptionCount
                boardSubscriptionCount
                flairSubscriptions {
                  id
                  streamId
                  addedAt
                  board {
                    id
                    name
                    title
                  }
                  flair {
                    id
                    textDisplay
                    backgroundColor
                    textColor
                  }
                }
                boardSubscriptions {
                  id
                  streamId
                  addedAt
                  board {
                    id
                    name
                    title
                    description
                    icon
                  }
                }
                creationDate
                updated
              }
            }
          `
          : `
            query GetStreamBySlug($slug: String!, $creatorUsername: String!) {
              stream(slug: $slug, creatorUsername: $creatorUsername) {
                id
                name
                slug
                description
                icon
                color
                isPublic
                isDiscoverable
                sortType
                timeRange
                showNsfw
                maxPostsPerBoard
                addedToNavbar
                isFollowing
                creatorId
                creator {
                  id
                  name
                  displayName
                  avatar
                  isAdmin
                }
                followerCount
                totalSubscriptions
                flairSubscriptionCount
                boardSubscriptionCount
                flairSubscriptions {
                  id
                  streamId
                  addedAt
                  board {
                    id
                    name
                    title
                  }
                  flair {
                    id
                    textDisplay
                    backgroundColor
                    textColor
                  }
                }
                boardSubscriptions {
                  id
                  streamId
                  addedAt
                  board {
                    id
                    name
                    title
                    description
                    icon
                  }
                }
                creationDate
                updated
              }
            }
          `

        const variables = typeof idOrSlug === 'number'
          ? { id: idOrSlug }
          : { slug: idOrSlug, creatorUsername: creatorUsername || '' }


        const { data, error } = await useDirectGraphQLRequest<{ stream: Stream }>(query, variables)

        if (error.value) throw error.value
        if (data.value?.stream) {
          this.currentStream = data.value.stream
          return data.value.stream
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch stream'
        console.error('Error fetching stream:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async createStream(input: CreateStreamInput): Promise<Stream> {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await useDirectGraphQLRequest<{ createStream: Stream }>(`
          mutation CreateStream($input: CreateStreamInput!) {
            createStream(input: $input) {
              id
              name
              slug
              description
              icon
              color
              isPublic
              isDiscoverable
              sortType
              timeRange
              showNsfw
              maxPostsPerBoard
              creatorId
              creator {
                id
                name
                displayName
                avatar
                isAdmin
              }
              isFollowing
              addedToNavbar
              followerCount
              totalSubscriptions
              flairSubscriptionCount
              boardSubscriptionCount
              creationDate
              updated
            }
          }
        `, { input })

        if (error.value) throw error.value
        if (data.value?.createStream) {
          const newStream = data.value.createStream
          this.streams.push(newStream)
          return newStream
        }

        throw new Error('Failed to create stream')
      } catch (err: any) {
        this.error = err.message || 'Failed to create stream'
        console.error('Error creating stream:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateStream(id: number, input: UpdateStreamInput): Promise<Stream> {
      this.loading = true
      this.error = null

      try {
        // Add stream_id to the input
        const fullInput = {
          streamId: id,
          ...input
        }

        const { data, error } = await useDirectGraphQLRequest<{ updateStream: Stream }>(`
          mutation UpdateStream($input: UpdateStreamInput!) {
            updateStream(input: $input) {
              id
              name
              slug
              description
              icon
              color
              isPublic
              isDiscoverable
              sortType
              timeRange
              showNsfw
              maxPostsPerBoard
              addedToNavbar
              isFollowing
              followerCount
              totalSubscriptions
              flairSubscriptionCount
              boardSubscriptionCount
              updated
            }
          }
        `, { input: fullInput })

        if (error.value) throw error.value
        if (data.value?.updateStream) {
          const updatedStream = data.value.updateStream

          // Update in local state
          const index = this.streams.findIndex(s => s.id === id)
          if (index !== -1) {
            this.streams[index] = { ...this.streams[index], ...updatedStream }
          }

          if (this.currentStream?.id === id) {
            this.currentStream = { ...this.currentStream, ...updatedStream }
          }

          return updatedStream
        }

        throw new Error('Failed to update stream')
      } catch (err: any) {
        this.error = err.message || 'Failed to update stream'
        console.error('Error updating stream:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteStream(id: number) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await useDirectGraphQLRequest<{ deleteStream: boolean }>(`
          mutation DeleteStream($streamId: Int!) {
            deleteStream(streamId: $streamId)
          }
        `, { streamId: id })

        if (error.value) throw error.value
        if (data.value?.deleteStream) {
          // Remove from local state
          this.streams = this.streams.filter(s => s.id !== id)
          this.followedStreams = this.followedStreams.filter(s => s.id !== id)
          this.navbarStreams = this.navbarStreams.filter(s => s.id !== id)

          if (this.currentStream?.id === id) {
            this.currentStream = null
          }
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to delete stream'
        console.error('Error deleting stream:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateStreamNavbarSettings(streamId: number, input: { addToNavbar: boolean; navbarPosition?: number | null }) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ updateStreamNavbarSettings: boolean }>(`
          mutation UpdateStreamNavbarSettings($streamId: Int!, $addToNavbar: Boolean!, $navbarPosition: Int) {
            updateStreamNavbarSettings(input: {
              streamId: $streamId
              addToNavbar: $addToNavbar
              navbarPosition: $navbarPosition
            })
          }
        `, {
          streamId,
          addToNavbar: input.addToNavbar,
          navbarPosition: input.navbarPosition
        })

        if (error.value) throw error.value

        // Update local state
        const stream = this.streams.find(s => s.id === streamId)
        if (stream) {
          stream.addedToNavbar = input.addToNavbar
          if (stream.navbarSettings) {
            stream.navbarSettings.navbarPosition = input.navbarPosition
          }
        }

        if (this.currentStream?.id === streamId) {
          this.currentStream.addedToNavbar = input.addToNavbar
          if (this.currentStream.navbarSettings) {
            this.currentStream.navbarSettings.navbarPosition = input.navbarPosition
          }
        }

        return true
      } catch (err: any) {
        this.error = err.message || 'Failed to update navbar settings'
        console.error('Error updating navbar settings:', err)
        throw err
      }
    },

    async addFlairSubscriptions(streamId: number, flairIds: number[]) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ addFlairSubscriptions: any[] }>(`
          mutation AddFlairSubscriptions($input: AddFlairSubscriptionsInput!) {
            addFlairSubscriptions(input: $input) {
              id
              streamId
              flairId
              boardId
              addedAt
            }
          }
        `, { input: { streamId, flairIds } })

        if (error.value) throw error.value
        if (data.value?.addFlairSubscriptions) {
          // Refresh the stream to get updated subscriptions
          await this.fetchStream(streamId)
          return data.value.addFlairSubscriptions
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to add flair subscriptions'
        console.error('Error adding flair subscriptions:', err)
        throw err
      }
    },

    async addBoardSubscriptions(streamId: number, boardIds: number[]) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ addBoardSubscriptions: any[] }>(`
          mutation AddBoardSubscriptions($input: AddBoardSubscriptionsInput!) {
            addBoardSubscriptions(input: $input) {
              id
              streamId
              boardId
              addedAt
            }
          }
        `, { input: { streamId, boardIds } })

        if (error.value) throw error.value
        if (data.value?.addBoardSubscriptions) {
          // Refresh the stream to get updated subscriptions
          await this.fetchStream(streamId)
          return data.value.addBoardSubscriptions
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to add board subscriptions'
        console.error('Error adding board subscriptions:', err)
        throw err
      }
    },

    async removeFlairSubscription(streamId: number, flairId: number) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ removeFlairSubscription: boolean }>(`
          mutation RemoveFlairSubscription($input: RemoveFlairSubscriptionInput!) {
            removeFlairSubscription(input: $input)
          }
        `, { input: { streamId, flairId } })

        if (error.value) throw error.value
        if (data.value?.removeFlairSubscription) {
          // Refresh the stream to get updated subscriptions
          await this.fetchStream(streamId)
          return true
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to remove flair subscription'
        console.error('Error removing flair subscription:', err)
        throw err
      }
    },

    async removeBoardSubscription(streamId: number, boardId: number) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ removeBoardSubscription: boolean }>(`
          mutation RemoveBoardSubscription($input: RemoveBoardSubscriptionInput!) {
            removeBoardSubscription(input: $input)
          }
        `, { input: { streamId, boardId } })

        if (error.value) throw error.value
        if (data.value?.removeBoardSubscription) {
          // Refresh the stream to get updated subscriptions
          await this.fetchStream(streamId)
          return true
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to remove board subscription'
        console.error('Error removing board subscription:', err)
        throw err
      }
    },

    async followStream(streamId: number, addToNavbar: boolean = false, navbarPosition?: number) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ followStream: boolean }>(`
          mutation FollowStream($input: FollowStreamInput!) {
            followStream(input: $input)
          }
        `, {
          input: {
            streamId,
            addToNavbar,
            navbarPosition
          }
        })

        if (error.value) {
          // Check if already following
          if (error.value.message && error.value.message.includes('Already following')) {
            // Silently update local state to mark as following
            this.updateLocalStream(streamId, { isFollowing: true })
            await this.fetchMyStreams()
            return
          }
          throw error.value
        }

        if (data.value?.followStream) {
          // Update local state to mark as following
          this.updateLocalStream(streamId, { isFollowing: true })

          // Refresh the stream list to get updated follower counts
          await this.fetchMyStreams()
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to follow stream'
        console.error('Error following stream:', err)
        throw err
      }
    },

    async unfollowStream(streamId: number) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ unfollowStream: boolean }>(`
          mutation UnfollowStream($streamId: Int!) {
            unfollowStream(streamId: $streamId)
          }
        `, { streamId })

        if (error.value) throw error.value
        if (data.value?.unfollowStream) {
          // Update local state to mark as not following
          this.updateLocalStream(streamId, { isFollowing: false })

          // Remove from followed streams
          this.followedStreams = this.followedStreams.filter(s => s.id !== streamId)
          this.navbarStreams = this.navbarStreams.filter(s => s.id !== streamId)

          // Refresh the stream list to get updated follower counts
          await this.fetchMyStreams()
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to unfollow stream'
        console.error('Error unfollowing stream:', err)
        throw err
      }
    },

    async getStreamPosts(streamId: number, page: number = 1, limit: number = 25) {
      this.loading = true
      this.error = null

      try {
        const offset = (page - 1) * limit

        const { data, error } = await useDirectGraphQLRequest<{
          streamPosts: StreamPost[]
        }>(`
          query GetStreamPosts($streamId: Int!, $offset: Int!, $limit: Int!) {
            streamPosts(streamId: $streamId, offset: $offset, limit: $limit) {
              id
              title
              body
              url
              score
              commentCount
              isNSFW
              creationDate
              creator {
                id
                name
                displayName
                avatar
                isAdmin
              }
              board {
                id
                name
                title
                icon
              }
              flairs {
                id
                textDisplay
                backgroundColor
                textColor
              }
            }
          }
        `, { streamId, offset, limit })

        if (error.value) throw error.value
        if (data.value?.streamPosts) {
          const posts = data.value.streamPosts

          if (page === 1) {
            this.currentStreamPosts = posts
          } else {
            this.currentStreamPosts = [...this.currentStreamPosts, ...posts]
          }

          // Calculate hasMore based on whether we got a full page
          const hasMore = posts.length === limit
          this.hasMorePosts = hasMore
          this.totalPosts = this.currentStreamPosts.length

          return { posts, hasMore, total: this.currentStreamPosts.length }
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch stream posts'
        console.error('Error fetching stream posts:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchFollowedStreams() {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ followedStreams: Stream[] }>(`
          query GetFollowedStreams($limit: Int, $offset: Int) {
            followedStreams(limit: $limit, offset: $offset) {
              id
              name
              slug
              description
              icon
              color
              isPublic
              creatorId
              creator {
                id
                name
                displayName
                avatar
                isAdmin
              }
              creationDate
              followerCount
              totalSubscriptions
              flairSubscriptionCount
              boardSubscriptionCount
              isFollowing
              addedToNavbar
            }
          }
        `, {
          variables: {
            limit: 50,
            offset: 0
          }
        })

        if (error.value) throw error.value
        if (data.value?.followedStreams) {
          // Transform the data to match our Store interface
          this.followedStreams = data.value.followedStreams.map((stream: any) => ({
            ...stream,
            // Keep the creator object if it exists, otherwise create minimal one
            creator: stream.creator || { id: stream.creatorId },
            isFollowedByMe: stream.isFollowing,
            aggregates: {
              id: stream.id,
              streamId: stream.id,
              followers: stream.followerCount || 0,
              flairSubscriptionCount: stream.flairSubscriptionCount || 0,
              boardSubscriptionCount: stream.boardSubscriptionCount || 0
            }
          }))
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch followed streams'
        console.error('Error fetching followed streams:', err)
      }
    },

    async fetchNavbarStreams() {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ navbarStreams: Stream[] }>(`
          query GetNavbarStreams {
            navbarStreams {
              id
              name
              slug
              icon
              color
              addedToNavbar
              creator {
                id
                name
                displayName
              }
            }
          }
        `)

        if (error.value) throw error.value
        if (data.value?.navbarStreams) {
          this.navbarStreams = data.value.navbarStreams
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch navbar streams'
        console.error('Error fetching navbar streams:', err)
      }
    },

    updateLocalStream(streamId: number, updates: Partial<Stream>) {
      const indices = [
        this.streams.findIndex(s => s.id === streamId),
        this.followedStreams.findIndex(s => s.id === streamId),
      ]

      indices.forEach((index, i) => {
        if (index !== -1) {
          const array = i === 0 ? this.streams : this.followedStreams
          array[index] = { ...array[index], ...updates }
        }
      })

      if (this.currentStream?.id === streamId) {
        this.currentStream = { ...this.currentStream, ...updates }
      }
    },

    clearCurrentStream() {
      this.currentStream = null
      this.currentStreamPosts = []
      this.hasMorePosts = false
      this.totalPosts = 0
    },

    clearError() {
      this.error = null
    },
  },
})
