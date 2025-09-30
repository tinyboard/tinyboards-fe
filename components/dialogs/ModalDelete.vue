<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="modalStore.closeModal" class="modal relative z-50">
      <!-- Backdrop -->
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80" />
      </TransitionChild>
      <!-- Modal -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-2.5 sm:p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]" enter-from="opacity-0 scale-90" enter-to="opacity-100 scale-100" leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-90">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900">
                Delete this {{ type ?? 'post' }}?
              </DialogTitle>
              <div class="modal-body mt-2">
                <p class="text-sm text-gray-500">
                  Your {{ type ?? 'post' }} will be forever removed from this TinyBoard.
                  <br/>
                  <strong>You won't be able to recover it.</strong>
                </p>
              </div>
              <div class="modal-footer mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  No, cancel
                </button>
                <button
                  class="button red"
                  @click="deleteItem"
                  :disabled="isDeleting"
                >
                  {{ isDeleting ? 'Deleting...' : `Yes, delete this ${type ?? 'post'}` }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useToastStore } from '@/stores/StoreToast';
  import { useModalStore } from '@/stores/StoreModal';
  import { usePostsStore } from '@/stores/StorePosts';
  import { useCommentsStore } from '@/stores/StoreComments';
  import { useDirectGraphQLRequest } from '@/composables/useGraphQL';
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
  } from '@headlessui/vue';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null,
      required: true
    },
    type: {
      type: String,
      default: 'post'
    }
  });

  const modalStore = useModalStore();
  const postsStore = usePostsStore();
  const commentsStore = useCommentsStore();

  const item = computed(() => {
    if (props.type === 'post') {
      return postsStore.getPost(props.id)
    } else {
      return commentsStore.getComment(props.id)
    }
  });

  // Deletion
  const toast = useToastStore();
  const isDeleting = ref(false);

  const deleteItem = async () => {
    if (isDeleting.value) return;

    isDeleting.value = true;
    const type = props.type;

    try {
      if (type === 'post') {
        // Use GraphQL mutation for post deletion
        const result = await useDirectGraphQLRequest(`
          mutation deletePost($postId: Int!, $deleted: Boolean!) {
            deletePost(postId: $postId, deleted: $deleted) {
              id
              isDeleted
            }
          }
        `, {
          postId: props.id,
          deleted: true
        });

        if (result.data?.deletePost) {
          // Update state
          if (postsStore.updatePost) {
            postsStore.updatePost(props.id, {
              isDeleted: result.data.deletePost.isDeleted
            });
          }

          // Show success toast
          toast.addNotification({
            header: 'Post deleted!',
            message: 'Your post was deleted successfully.',
            type: 'success'
          });

          // Refresh the page to remove the deleted post from view
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        // Use GraphQL mutation for comment deletion
        const result = await useDirectGraphQLRequest(`
          mutation deleteComment($commentId: Int!, $deleted: Boolean!) {
            deleteComment(commentId: $commentId, deleted: $deleted) {
              id
              isDeleted
            }
          }
        `, {
          commentId: props.id,
          deleted: true
        });

        if (result.data?.deleteComment) {
          // Update state
          if (commentsStore.updateComment) {
            commentsStore.updateComment(props.id, {
              isDeleted: result.data.deleteComment.isDeleted
            });
          }

          // Show success toast
          toast.addNotification({
            header: 'Comment deleted!',
            message: 'Your comment was deleted successfully.',
            type: 'success'
          });

          // Refresh the page to remove the deleted comment from view
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      // Show error toast
      toast.addNotification({
        header: 'Deletion failed',
        message: error.message || `Failed to delete ${type}. Please try again.`,
        type: 'error'
      });
    } finally {
      isDeleting.value = false;
      // Close the modal
      modalStore.closeModal();
    }
  };
</script>
