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
              isDiscoverable
              sortType
              timeRange
              showNsfw
              addedToNavbar
              isFollowedByMe
              creator {
                id
                name
                displayName
                avatar
                isAdmin
                adminLevel
              }
              aggregates {
                id
                streamId
                followers
                flairSubscriptionCount
                boardSubscriptionCount
              }
              creationDate
              updated
            }
          }
        `)

        if (error.value) throw error.value
        if (data.value?.myStreams) {
          this.streams = data.value.myStreams
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch streams'
        console.error('Error fetching my streams:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchStream(idOrSlug: number | string) {
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
                addedToNavbar
                isFollowedByMe
                creator {
                  id
                  username
                  avatar
                  isAdmin
                }
                flairSubscriptions {
                  id
                  streamId
                  flair {
                    id
                    boardId
                    displayName
                    name
                    color
                    bgColor
                  }
                  board {
                    id
                    name
                    title
                    description
                    icon
                    subscriberCount
                  }
                  addedAt
                }
                boardSubscriptions {
                  id
                  streamId
                  board {
                    id
                    name
                    title
                    description
                    icon
                    subscriberCount
                  }
                  addedAt
                }
                aggregates {
                  id
                  streamId
                  followers
                  flairSubscriptionCount
                  boardSubscriptionCount
                }
                creationDate
                updated
              }
            }
          `
          : `
            query GetStreamBySlug($slug: String!) {
              stream(slug: $slug) {
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
                addedToNavbar
                isFollowedByMe
                creator {
                  id
                  username
                  avatar
                  isAdmin
                }
                flairSubscriptions {
                  id
                  streamId
                  flair {
                    id
                    boardId
                    displayName
                    name
                    color
                    bgColor
                  }
                  board {
                    id
                    name
                    title
                    description
                    icon
                    subscriberCount
                  }
                  addedAt
                }
                boardSubscriptions {
                  id
                  streamId
                  board {
                    id
                    name
                    title
                    description
                    icon
                    subscriberCount
                  }
                  addedAt
                }
                aggregates {
                  id
                  streamId
                  followers
                  flairSubscriptionCount
                  boardSubscriptionCount
                }
                creationDate
                updated
              }
            }
          `

        const variables = typeof idOrSlug === 'number' ? { id: idOrSlug } : { slug: idOrSlug }
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
              addedToNavbar
              isFollowedByMe
              creator {
                id
                name
                displayName
                avatar
                isAdmin
                adminLevel
              }
              aggregates {
                id
                streamId
                followers
                flairSubscriptionCount
                boardSubscriptionCount
              }
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
        const { data, error } = await useDirectGraphQLRequest<{ updateStream: Stream }>(`
          mutation UpdateStream($id: Int!, $input: UpdateStreamInput!) {
            updateStream(id: $id, input: $input) {
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
              addedToNavbar
              isFollowedByMe
              aggregates {
                id
                streamId
                followers
                flairSubscriptionCount
                boardSubscriptionCount
              }
              updated
            }
          }
        `, { id, input })

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
        const { data, error } = await useDirectGraphQLRequest<{ deleteStream: { success: boolean } }>(`
          mutation DeleteStream($id: Int!) {
            deleteStream(id: $id) {
              success
            }
          }
        `, { id })

        if (error.value) throw error.value
        if (data.value?.deleteStream?.success) {
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

    async addFlairSubscriptions(streamId: number, flairIds: number[]) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ addFlairSubscriptions: Stream }>(`
          mutation AddFlairSubscriptions($streamId: Int!, $flairIds: [Int!]!) {
            addFlairSubscriptions(streamId: $streamId, flairIds: $flairIds) {
              id
              flairSubscriptions {
                id
                streamId
                flair {
                  id
                  boardId
                  displayName
                  name
                  color
                  bgColor
                }
                board {
                  id
                  name
                  title
                }
                addedAt
              }
              aggregates {
                id
                streamId
                followers
                flairSubscriptionCount
                boardSubscriptionCount
              }
            }
          }
        `, { streamId, flairIds })

        if (error.value) throw error.value
        if (data.value?.addFlairSubscriptions) {
          const updated = data.value.addFlairSubscriptions
          this.updateLocalStream(streamId, updated)
          return updated
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to add flair subscriptions'
        console.error('Error adding flair subscriptions:', err)
        throw err
      }
    },

    async addBoardSubscriptions(streamId: number, boardIds: number[]) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ addBoardSubscriptions: Stream }>(`
          mutation AddBoardSubscriptions($streamId: Int!, $boardIds: [Int!]!) {
            addBoardSubscriptions(streamId: $streamId, boardIds: $boardIds) {
              id
              boardSubscriptions {
                id
                streamId
                board {
                  id
                  name
                  title
                  description
                  icon
                  subscriberCount
                }
                addedAt
              }
              aggregates {
                id
                streamId
                followers
                flairSubscriptionCount
                boardSubscriptionCount
              }
            }
          }
        `, { streamId, boardIds })

        if (error.value) throw error.value
        if (data.value?.addBoardSubscriptions) {
          const updated = data.value.addBoardSubscriptions
          this.updateLocalStream(streamId, updated)
          return updated
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to add board subscriptions'
        console.error('Error adding board subscriptions:', err)
        throw err
      }
    },

    async removeFlairSubscription(streamId: number, flairId: number) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ removeFlairSubscription: Stream }>(`
          mutation RemoveFlairSubscription($streamId: Int!, $flairId: Int!) {
            removeFlairSubscription(streamId: $streamId, flairId: $flairId) {
              id
              flairSubscriptions {
                id
                streamId
                flair {
                  id
                  displayName
                }
              }
              aggregates {
                id
                streamId
                flairSubscriptionCount
                boardSubscriptionCount
              }
            }
          }
        `, { streamId, flairId })

        if (error.value) throw error.value
        if (data.value?.removeFlairSubscription) {
          const updated = data.value.removeFlairSubscription
          this.updateLocalStream(streamId, updated)
          return updated
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to remove flair subscription'
        console.error('Error removing flair subscription:', err)
        throw err
      }
    },

    async removeBoardSubscription(streamId: number, boardId: number) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ removeBoardSubscription: Stream }>(`
          mutation RemoveBoardSubscription($streamId: Int!, $boardId: Int!) {
            removeBoardSubscription(streamId: $streamId, boardId: $boardId) {
              id
              boardSubscriptions {
                id
                streamId
                board {
                  id
                  name
                }
              }
              aggregates {
                id
                streamId
                flairSubscriptionCount
                boardSubscriptionCount
              }
            }
          }
        `, { streamId, boardId })

        if (error.value) throw error.value
        if (data.value?.removeBoardSubscription) {
          const updated = data.value.removeBoardSubscription
          this.updateLocalStream(streamId, updated)
          return updated
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to remove board subscription'
        console.error('Error removing board subscription:', err)
        throw err
      }
    },

    async followStream(streamId: number) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ followStream: Stream }>(`
          mutation FollowStream($streamId: Int!) {
            followStream(streamId: $streamId) {
              id
              isFollowedByMe
              aggregates {
                id
                streamId
                followers
                flairSubscriptionCount
                boardSubscriptionCount
              }
            }
          }
        `, { streamId })

        if (error.value) throw error.value
        if (data.value?.followStream) {
          const updated = data.value.followStream
          this.updateLocalStream(streamId, { isFollowedByMe: true, aggregates: updated.aggregates })
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to follow stream'
        console.error('Error following stream:', err)
        throw err
      }
    },

    async unfollowStream(streamId: number) {
      try {
        const { data, error } = await useDirectGraphQLRequest<{ unfollowStream: Stream }>(`
          mutation UnfollowStream($streamId: Int!) {
            unfollowStream(streamId: $streamId) {
              id
              isFollowedByMe
              aggregates {
                id
                streamId
                followers
                flairSubscriptionCount
                boardSubscriptionCount
              }
            }
          }
        `, { streamId })

        if (error.value) throw error.value
        if (data.value?.unfollowStream) {
          const updated = data.value.unfollowStream
          this.updateLocalStream(streamId, { isFollowedByMe: false, aggregates: updated.aggregates })

          // Remove from followed streams
          this.followedStreams = this.followedStreams.filter(s => s.id !== streamId)
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
        const { data, error } = await useDirectGraphQLRequest<{
          streamPosts: {
            posts: StreamPost[]
            hasMore: boolean
            total: number
          }
        }>(`
          query GetStreamPosts($streamId: Int!, $page: Int!, $limit: Int!) {
            streamPosts(streamId: $streamId, page: $page, limit: $limit) {
              posts {
                id
                title
                body
                url
                thumbnail
                score
                commentCount
                isNsfw
                creationDate
                creator {
                  id
                  username
                  avatar
                  isAdmin
                }
                board {
                  id
                  name
                  title
                  icon
                }
                flair {
                  id
                  displayName
                  color
                  bgColor
                }
              }
              hasMore
              total
            }
          }
        `, { streamId, page, limit })

        if (error.value) throw error.value
        if (data.value?.streamPosts) {
          const { posts, hasMore, total } = data.value.streamPosts

          if (page === 1) {
            this.currentStreamPosts = posts
          } else {
            this.currentStreamPosts = [...this.currentStreamPosts, ...posts]
          }

          this.hasMorePosts = hasMore
          this.totalPosts = total

          return { posts, hasMore, total }
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
          query GetFollowedStreams {
            followedStreams {
              id
              name
              slug
              description
              icon
              color
              isFollowedByMe
              creator {
                id
                username
                avatar
              }
              aggregates {
                id
                streamId
                followers
                flairSubscriptionCount
                boardSubscriptionCount
              }
              creationDate
            }
          }
        `)

        if (error.value) throw error.value
        if (data.value?.followedStreams) {
          this.followedStreams = data.value.followedStreams
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
