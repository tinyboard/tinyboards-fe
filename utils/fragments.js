// GraphQL fragments
import gql from "graphql-tag";

export const postFragment = gql`
	fragment PostFragment on Post {
		id
		titleChunk
		title
		url
		bodyHTML
		isRemoved
		isLocked
		isNSFW
		featuredBoard
		featuredLocal
		score
		myVote
		commentCount
		creationDate
		updated
	}
`;

export const commentFragment = gql`
	fragment CommentFragment on Comment {
		id
		parentId
		bodyHTML
		isRemoved
		isDeleted
		isLocked
		isPinned
		score
		upvotes
		downvotes
		replyCount
		creationDate
		updated
		myVote
	}
`;

export const userFragment = gql`
	fragment UserFragment on Person {
		id
		name
		displayName
		avatar
		isAdmin
		instance
		creationDate
		rep
		postCount
		commentCount
	}
`;

export const boardFragment = gql`
	fragment BoardFragment on Board {
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
		posts
		comments
		isSubscribed
		isMod
		canCreatePost
	}
`;