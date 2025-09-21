// Mock GraphQL exports for build time when nuxt-graphql-client is disabled
// This prevents build errors when SKIP_GQL_GENERATE=true

// Mock all possible GraphQL query and mutation types
export type GetPostQuery = any;
export type GetSiteQuery = any;
export type UserProfileQuery = any;
export type GetConversationsQuery = any;
export type GetConversationQuery = any;
export type SendMessageMutation = any;
export type EditMessageMutation = any;
export type EditCommentMutation = any;
export type EditPostMutation = any;
export type LoadPostsQuery = any;

// Mock all possible GraphQL operations and SDKs
export const GqlFollowUser = null;
export const GqlUnfollowUser = null;
export const GqlIsFollowingUser = null;
export const GqlGetSite = null;
export const GqlGetBoard = null;
export const GqlGetUser = null;
export const GqlListPosts = null;
export const GqlListComments = null;
export const GqlCreatePost = null;
export const GqlCreateComment = null;
export const GqlVotePost = null;
export const GqlVoteComment = null;
export const GqlLogin = null;
export const GqlRegister = null;
export const GqlLogout = null;
export const GqlSubscribeToBoard = null;
export const GqlUnsubscribeFromBoard = null;
export const GqlCreateBoard = null;
export const GqlEditBoard = null;
export const GqlDeleteBoard = null;
export const GqlBanUserFromBoard = null;
export const GqlTransferBoardOwnership = null;
export const GqlUnblockBoard = null;
export const GqlGetConversations = null;
export const GqlGetConversation = null;
export const GqlGetUnreadMessageCount = null;
export const GqlMarkConversationRead = null;
export const GqlSendMessage = null;
export const GqlEditMessage = null;
export const GqlDeleteMessage = null;
export const GqlListMembers = null;
export const GqClientOps = null;
export const GqlSdks = null;

// Mock default export for dynamic imports
export default {};