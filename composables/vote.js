// vote.js

import { ref } from "vue";

export function useVote(type = 0) {
	let voteType = ref(0);

	function vote(type) {
		voteType.value = voteType.value === type ? 0 : type;
	}

	return {
		voteType,
		vote
	};
}