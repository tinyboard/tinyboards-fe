// GraphQL fragments
import gql from "graphql-tag";

export const postFragment = gql`
	fragment PostFragment on Post {
		id
		titleChunk
		title
		url
		bodyHtml
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