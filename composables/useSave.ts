import { ref, type Ref } from "vue";
import { useGraphQLMutation } from "@/composables/useGraphQL";
import { useToastStore } from "@/stores/StoreToast";

export interface SaveResult {
  isSaved: Ref<boolean>;
  save: (id: number, type: 'post' | 'comment') => Promise<void>;
  isLoading: Ref<boolean>;
}

/**
 * Composable for saving/unsaving posts and comments using GraphQL
 */
export function useSave(initialSavedState: boolean = false): SaveResult {
  const isSaved = ref(initialSavedState);
  const isLoading = ref(false);
  const toast = useToastStore();

  const save = async (id: number, type: 'post' | 'comment'): Promise<void> => {
    if (isLoading.value) return;

    isLoading.value = true;
    const originalState = isSaved.value;

    // Optimistically update the state
    isSaved.value = !isSaved.value;

    try {
      const mutation = `mutation Save${type.charAt(0).toUpperCase() + type.slice(1)}($${type}Id: Int!, $save: Boolean!) {
         save${type.charAt(0).toUpperCase() + type.slice(1)}(${type}Id: $${type}Id, save: $save)
       }`;

      const variables = type === 'post'
        ? { postId: id, save: isSaved.value }
        : { commentId: id, save: isSaved.value };

      const { data, error } = await useGraphQLMutation(mutation, { variables });

      const mutationKey = `save${type.charAt(0).toUpperCase() + type.slice(1)}`;

      if (error.value || !data.value?.[mutationKey]) {
        // Revert optimistic update on error
        isSaved.value = originalState;

        toast.addNotification({
          header: `${isSaved.value ? 'Saving' : 'Unsaving'} failed`,
          message: error.value?.message || `Failed to ${isSaved.value ? 'save' : 'unsave'} the ${type}.`,
          type: "error",
        });
      } else {
        // Success
        toast.addNotification({
          header: `${type.charAt(0).toUpperCase() + type.slice(1)} ${isSaved.value ? 'saved' : 'unsaved'}`,
          message: `The ${type} was ${isSaved.value ? 'saved' : 'removed from saved items'}!`,
          type: "success",
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      isSaved.value = originalState;

      console.error(`Error ${isSaved.value ? 'saving' : 'unsaving'} ${type}:`, error);
      toast.addNotification({
        header: `${isSaved.value ? 'Saving' : 'Unsaving'} failed`,
        message: `Failed to ${isSaved.value ? 'save' : 'unsave'} the ${type}. Please try again.`,
        type: "error",
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isSaved,
    save,
    isLoading,
  };
}