// Manually define GraphQL enum types that were previously generated
export enum CommentSortType {
  HOT = "hot",
  NEW = "new",
  OLD = "old",
  TOP = "top"
}

export enum ListingType {
  ALL = "all",
  LOCAL = "local",
  SUBSCRIBED = "subscribed",
  MODERATED = "moderated"
}

export enum SortType {
  ACTIVE = "active",
  HOT = "hot",
  NEW = "new",
  OLD = "old",
  TOP_DAY = "topDay",
  TOP_WEEK = "topWeek",
  TOP_MONTH = "topMonth",
  TOP_YEAR = "topYear",
  TOP_ALL = "topAll",
  MOST_COMMENTS = "mostComments",
  NEW_COMMENTS = "newComments",
  CONTROVERSIAL = "controversial"
}

// Define GraphQL response types manually
export interface GetPostQuery {
  post: Post;
}

export interface GetSiteQuery {
  site: Site;
}

export interface UserProfileQuery {
  user: User;
}

export interface GetConversationsQuery {
  conversations: Conversation[];
}

export interface GetConversationQuery {
  conversation: Conversation;
}

export interface SendMessageMutation {
  sendMessage: Message;
}

export interface EditMessageMutation {
  editMessage: Message;
}

// Message and conversation types
export interface Message {
  id: number;
  content: string;
  creationDate: string;
  updated?: string;
  sender: User;
  recipient: User;
  conversationId: number;
}

export interface Conversation {
  id: number;
  participants: User[];
  messages: Message[];
  creationDate: string;
  updated: string;
}

export type PostFragment = {
    id: number;
    title: string;
    titleChunk: string;
    isDeleted: boolean;
    isLocked: boolean;
    creatorId: number;
}

// Define core types that reference other GraphQL types
export interface Post {
  id: number;
  title: string;
  content?: string;
  url?: string;
  isLocked: boolean;
  isStickied: boolean;
  isNSFW: boolean;
  isFeatured: boolean;
  isRemoved: boolean;
  creationDate: string;
  updated: string;
  voteScore: number;
  userVote?: number;
  author: User;
  board?: Board;
  commentCount: number;
  image?: string;
  body?: string;
  bodyHTML?: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  isRemoved: boolean;
  creationDate: string;
  updated: string;
  voteScore: number;
  userVote?: number;
  author: User;
  depth: number;
  parentId?: number;
  childCount: number;
  replies?: Comment[];
  post?: PostFragment;
}

export interface User {
  id: number;
  name: string;
  displayName?: string;
  avatar?: string;
  banner?: string;
  profileBackground?: string;
  bio?: string;
  bioHTML?: string;
  isAdmin?: boolean;
  isBanned?: boolean;
  isBlocked?: boolean;
  creationDate: string;
  postCount?: number;
  commentCount?: number;
  reputation?: number;
  rep?: number;
  adminLevel?: number;
}

// User interaction types
export type UserFollowersResponse = {
    userFollowers: User[];
};

export type UserFollowingResponse = {
    userFollowing: User[];
};

export type PendingFollowRequestsResponse = {
    pendingFollowRequests: User[];
};

export interface Site {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  enableBoards: boolean;
  isPrivate: boolean;
  requireRegistrationCode: boolean;
}

export interface Board {
  id: number;
  name: string;
  title?: string;
  description?: string;
  icon?: string;
  banner?: string;
  isNSFW: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  hoverColor?: string;
  myModPermissions?: number;
  subscribers: number;
  exclude_from_all?: boolean;
  isBanned?: boolean;
  subscribedType?: string;
}

export type BoardFragment = {
    id: number;
    name: string;
    title: string;
    icon?: string | null;
    subscribers: number;
    primaryColor?: string;
    secondaryColor?: string;
    hoverColor?: string;
    myModPermissions?: number;
};

export type ContentType = "post" | "comment";

export type ModPermission = 'none' | 'config' | 'appearance' |
    'content' | 'users' | 'emoji' | 'full';

export type AdminPermission = 'none' | 'appearance' | 'config' | 'content' |
    'users' | 'boards' | 'emoji' | 'full' | 'owner' | 'system';

// Input types for board mutations
export type CreateBoardInput = {
    name: string;
    title: string;
    description?: string;
    isNsfw?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    hoverColor?: string;
};

export type UpdateBoardSettingsInput = {
    boardId: number;
    title?: string;
    description?: string;
    isNsfw?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    hoverColor?: string;
    sidebar?: string;
    postingRestrictedToMods?: boolean;
    isHidden?: boolean;
    excludeFromAll?: boolean;
    icon?: string;
    banner?: string;
};

// Response types for board mutations
export type CreateBoardResponse = {
    board: Board;
};

export type UpdateBoardSettingsResponse = {
    board: Board;
};

/*export type SortType = "hot" | "new" | "topAll" | "topMonth" | "topWeek" | "topDay" | "mostComments" | "newComments";
export type ListingType = "all" | "local" | "subscribed" | "moderated";



/**
 * Use to convert a string (from user input) to a SortType
 */
/*export function mapToSortType(sort: string, fallback: SortType = "hot"): SortType {
    if (SORT_TYPES.includes(sort)) {
        return sort as SortType;
    } else {
        return fallback;
    }
}*/

// const SORT_TYPES = [
//     "hot",
//     "new",
//     "topAll",
//     "topMonth",
//     "topWeek",
//     "topDay",
//     "mostComments",
//     "newComments",
// ];

//export type SortType = GqlSortType;

export function mapToSortType(sort: string, fallback: SortType = SortType.HOT): SortType {
    switch (sort.toLowerCase()) {
        case "active":
            return SortType.ACTIVE;
        case "hot":
            return SortType.HOT;
        case "new":
            return SortType.NEW;
        case "old":
            return SortType.OLD;
        case "topday":
            return SortType.TOP_DAY;
        case "topweek":
            return SortType.TOP_WEEK;
        case "topmonth":
            return SortType.TOP_MONTH;
        case "topyear":
            return SortType.TOP_YEAR;
        case "topall":
            return SortType.TOP_ALL;
        case "mostcomments":
            return SortType.MOST_COMMENTS;
        case "newcomments":
            return SortType.NEW_COMMENTS;
        case "controversial":
            return SortType.CONTROVERSIAL;
        default:
            return fallback;
    }
}

export function mapToCommentSortType(sort: string, fallback: CommentSortType = CommentSortType.HOT): CommentSortType {
    switch (sort.toLowerCase()) {
        case "hot":
            return CommentSortType.HOT;
        case "new":
            return CommentSortType.NEW;
        case "old":
            return CommentSortType.OLD;
        case "top":
            return CommentSortType.TOP;
        default:
            return fallback;
    }
}

export function mapToListingType(sort: string, fallback: ListingType = ListingType.LOCAL): ListingType {
    switch (sort.toLowerCase()) {
        case "local":
            return ListingType.LOCAL;
        case "subscribed":
        case "joined":
            return ListingType.SUBSCRIBED;
        case "moderated":
            return ListingType.MODERATED;
        case "all":
            return ListingType.ALL;
        default:
            return fallback;
    }
}

// Message types
export type Message = GetConversationQuery["getConversation"][0];
export type Conversation = GetConversationsQuery["listConversations"][0];

export type SendMessageInput = {
    recipientId: number;
    title: string;
    body: string;
};

export type EditMessageInput = {
    messageId: number;
    title?: string;
    body?: string;
};

export type MarkMessageReadInput = {
    messageId: number;
};

export type DeleteMessageInput = {
    messageId: number;
};

export type SendMessageResponse = SendMessageMutation["sendMessage"];
export type EditMessageResponse = EditMessageMutation["editMessage"];
