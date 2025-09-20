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
                {{ props.options.approve ? 'Approve' : 'Remove' }} this {{ type ?? 'post' }}?
              </DialogTitle>
              <div class="modal-body mt-2">
                <p v-if="props.options.approve" class="text-sm text-gray-500">
                  This {{ type ?? 'post' }} will be visible to the community, and reports will be dismissed.
                </p>
                <p v-else class="text-sm text-gray-500">
                  This {{ type ?? 'post' }} will be removed and invisible to the community.
                  <br/>
                  You can undo this action.
                </p>
              </div>
              <div class="modal-footer mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  No, cancel
                </button>
                <button :class="props.options.approve ? 'button green' : 'button red'" @click="toggleItemRemove" :disabled="isLoading">
                  {{ isLoading ? 'Processing...' : `Yes, ${props.options.approve ? 'approve' : 'remove'} this ${type ?? 'post'}` }}
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
  import { ref } from 'vue'
  import { useToastStore } from '@/stores/StoreToast';
  import { useModalStore } from '@/stores/StoreModal';
  import { usePostsStore } from '@/stores/StorePosts';
  import { useCommentsStore } from '@/stores/StoreComments';
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
    },
    options: {
      type: Object
    }
  });

  const modalStore = useModalStore();
  const postsStore = usePostsStore();
  const commentsStore = useCommentsStore();
  const toast = useToastStore();

  const item = computed(() => {
    if (props.type === 'post') {
     return postsStore.getPost(props.id)
    } else {
      return commentsStore.getComment(props.id)
    }
  });

  // Loading state
  const isLoading = ref(false);

  const toggleItemRemove = async () => {
    if (isLoading.value) return;

    isLoading.value = true;
    const type = props.type;
    const id = props.id;

    try {
      let result;

      if (props.options.approve) {
        // Use approve mutations
        if (type === 'post') {
          result = await $fetch('#gql', {
            query: `
              mutation approvePost($postId: Int!) {
                approvePost(postId: $postId) {
                  success
                }
              }
            `,
            variables: { postId: id }
          });
        } else {
          result = await $fetch('#gql', {
            query: `
              mutation approveComment($commentId: Int!) {
                approveComment(commentId: $commentId) {
                  success
                }
              }
            `,
            variables: { commentId: id }
          });
        }

        const mutationKey = type === 'post' ? 'approvePost' : 'approveComment';
        if (result[mutationKey]?.success) {
          toast.addNotification({
            header: `${type} approved`,
            message: `The ${type} was successfully approved.`,
            type: 'success'
          });
        } else {
          throw new Error(`Failed to approve ${type}`);
        }
      } else {
        // Use existing removal mutations
        const { $gql } = useNuxtApp();

        if (type === 'post') {
          result = await $gql.mutation({
            setPostRemoved: {
              __args: {
                id: id,
                value: true
              },
              id: true,
              isRemoved: true
            }
          });
        } else {
          result = await $gql.mutation({
            setCommentRemoved: {
              __args: {
                id: id,
                value: true
              },
              id: true,
              isRemoved: true
            }
          });
        }

        const mutationKey = type === 'post' ? 'setPostRemoved' : 'setCommentRemoved';
        if (result[mutationKey]) {
          toast.addNotification({
            header: `${type} removed`,
            message: `The ${type} was successfully removed.`,
            type: 'success'
          });
        } else {
          throw new Error(`Failed to remove ${type}`);
        }
      }
    } catch (error) {
      console.error(`Error with ${type} operation:`, error);
      toast.addNotification({
        header: 'Operation failed',
        message: `Failed to ${props.options.approve ? 'approve' : 'remove'} ${type}. Please try again.`,
        type: 'error'
      });
    } finally {
      isLoading.value = false;
      modalStore.closeModal();
    }
  };
</script>
