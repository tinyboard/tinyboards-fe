import { ref, type Ref } from "vue";
import { useGraphQLMutation } from "@/composables/useGraphQL";
import { useToastStore } from "@/stores/StoreToast";

export interface SubscribeResult {
  isSubscribed: Ref<boolean>;
  subscribe: (boardId: number, boardName: string) => Promise<void>;
  isLoading: Ref<boolean>;
}

/**
 * Composable for subscribing/unsubscribing from boards using GraphQL
 */
export function useSubscribe(initialSubscribedState: boolean = false): SubscribeResult {
  const isSubscribed = ref(initialSubscribedState);
  const isLoading = ref(false);
  const toast = useToastStore();

  const subscribe = async (boardId: number, boardName: string): Promise<void> => {
    if (isLoading.value) return;

    isLoading.value = true;
    const originalState = isSubscribed.value;

    // Optimistically update the state
    isSubscribed.value = !isSubscribed.value;

    try {
      const mutation = isSubscribed.value
        ? `mutation SubscribeToBoard($boardId: Int!) {
             subscribeToBoard(boardId: $boardId)
           }`
        : `mutation UnsubscribeFromBoard($boardId: Int!) {
             unsubscribeFromBoard(boardId: $boardId)
           }`;

      const { data, error } = await useGraphQLMutation(mutation, {
        variables: { boardId }
      });

      const mutationKey = isSubscribed.value ? 'subscribeToBoard' : 'unsubscribeFromBoard';

      if (error.value || !data.value?.[mutationKey]) {
        // Revert optimistic update on error
        isSubscribed.value = originalState;

        toast.addNotification({
          header: `${isSubscribed.value ? 'Joining' : 'Leaving'} failed`,
          message: error.value?.message || `Failed to ${isSubscribed.value ? 'join' : 'leave'} ${boardName}.`,
          type: "error",
        });
      } else {
        // Success
        toast.addNotification({
          header: `${isSubscribed.value ? 'Joined' : 'Left'} ${boardName}!`,
          message: `You are ${isSubscribed.value ? 'now a member of' : 'no longer a member of'} ${boardName}.`,
          type: "success",
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      isSubscribed.value = originalState;

      console.error(`Error ${isSubscribed.value ? 'subscribing to' : 'unsubscribing from'} board:`, error);
      toast.addNotification({
        header: `${isSubscribed.value ? 'Joining' : 'Leaving'} failed`,
        message: `Failed to ${isSubscribed.value ? 'join' : 'leave'} ${boardName}. Please try again.`,
        type: "error",
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isSubscribed,
    subscribe,
    isLoading,
  };
}