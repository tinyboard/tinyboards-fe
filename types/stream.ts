export interface Stream {
  id: number
  name: string
  slug: string
  description?: string
  creator?: User
  creatorId?: number
  icon?: string
  color?: string
  isPublic: boolean
  isDiscoverable?: boolean
  sortType?: SortType
  timeRange?: TimeRange
  showNsfw?: boolean

  // Dual subscription support
  flairSubscriptions?: FlairSubscription[]
  boardSubscriptions?: BoardSubscription[]

  aggregates?: StreamAggregates
  isFollowedByMe?: boolean
  isFollowing?: boolean
  addedToNavbar?: boolean

  // Backend fields
  followerCount?: number
  totalSubscriptions?: number
  flairSubscriptionCount?: number
  boardSubscriptionCount?: number

  creationDate: string
  updated?: string
}

export interface FlairSubscription {
  id: number
  streamId: number
  flair: Flair
  board: Board
  addedAt: string
}

export interface BoardSubscription {
  id: number
  streamId: number
  board: Board
  addedAt: string
}

export interface StreamAggregates {
  id: number
  streamId: number
  followers: number
  flairSubscriptionCount: number
  boardSubscriptionCount: number
}

export interface User {
  id: number
  name: string
  displayName?: string
  avatar?: string
  isAdmin: boolean
  adminLevel?: number
}

export interface Board {
  id: number
  name: string
  title: string
  description?: string
  icon?: string
  subscriberCount: number
}

export interface Flair {
  id: number
  boardId: number
  displayName: string
  name: string
  color?: string
  bgColor?: string
}

export interface StreamPost {
  id: number
  title: string
  body?: string
  url?: string
  thumbnail?: string
  creator: User
  board: Board
  flair?: Flair
  score: number
  commentCount: number
  creationDate: string
  isNsfw: boolean
}

export interface CreateStreamInput {
  name: string
  slug?: string
  description?: string
  icon?: string
  color?: string
  isPublic: boolean
  isDiscoverable: boolean
  sortType: SortType
  timeRange?: TimeRange
  showNsfw: boolean
  addedToNavbar: boolean
  flairSubscriptionIds?: number[]
  boardSubscriptionIds?: number[]
}

export interface UpdateStreamInput {
  name?: string
  slug?: string
  description?: string
  icon?: string
  color?: string
  isPublic?: boolean
  isDiscoverable?: boolean
  sortType?: SortType
  timeRange?: TimeRange
  showNsfw?: boolean
  addedToNavbar?: boolean
}

export enum SortType {
  HOT = 'HOT',
  NEW = 'NEW',
  TOP = 'TOP',
  RISING = 'RISING',
}

export enum TimeRange {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  ALL = 'ALL',
}

export interface StreamShareToken {
  token: string
  expiresAt?: string
  creationDate: string
}

export interface SubscriptionSelection {
  // Flair subscriptions
  flairs: {
    boardId: number
    boardName: string
    flairIds: number[]
    flairs: Flair[]
  }[]

  // Board subscriptions
  boards: Board[]
}

export interface StreamWizardStep {
  title: string
  description: string
  isValid: boolean
  isComplete: boolean
}
