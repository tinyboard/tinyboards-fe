import { ref } from "vue";

export function useSubscribe(hasSubscribed) {
	let isSubscribed = ref(hasSubscribed);

	function subscribe() {
		isSubscribed.value = !isSubscribed.value
	}

	return {
		subscribe,
		isSubscribed
	};
}