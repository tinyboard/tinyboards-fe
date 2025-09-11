import { ref } from "vue";

/**
 * @deprecated DOES NOT WORK! Use the GraphQL API instead.
 */
export function useSubscribe(hasSubscribed) {
  let isSubscribed = ref(hasSubscribed);

  function subscribe() {
    isSubscribed.value = !isSubscribed.value;
  }

  return {
    subscribe,
    isSubscribed,
  };
}
