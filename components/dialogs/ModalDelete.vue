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
                <button class="button red" @click="deleteItem">
                  Yes, delete this {{ type ?? 'post' }}
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
  // import { baseURL } from "@/server/constants";
  import { useAPI } from "@/composables/api";
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
  const authCookie = useCookie("token").value;
  const toast = useToastStore();

  const deleteItem = async () => {
    const type = props.type;
    const id = type === 'post' ? item.value.post.id : item.value.comment.id;
    await useAPI(`/${type}s/${id}`, {
      body: {
        "deleted": true
      },
      method: "delete",
    })
    .then(({ data }) => {
      if (data.value) {
        // Update state.
        if (type === 'post') {
          postsStore.updatePost(id, {
            is_deleted: true
          });
        } else {
          commentsStore.updateComment(id, {
            is_deleted: true
          });
        };
        // Parse response.
        data = JSON.parse(JSON.stringify(data.value));
        // Show success toast.
        setTimeout(() => {
          toast.addNotification({
            header:`${type} deleted!`,
            message:`Your ${type} was removed forever.`,
            type:'success'
          });
        }, 400);
      } else {
        // Show error toast.
        setTimeout(() => {
          toast.addNotification({
            header:'Deletion failed',
            message:`Failed to delete ${type}. Please try again.`,
            type:'error'
          });
        }, 400);
      };
    })
    .finally(() => {
      // Close the modal.
      modalStore.closeModal();
    });
  };
</script>
