<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="modalStore.closeModal" class="relative z-50">
      <!-- Backdrop -->
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80" />
      </TransitionChild>
      <!-- Modal -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]" enter-from="opacity-0 scale-90" enter-to="opacity-100 scale-100" leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-90">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900">
                Remove this {{ type ?? 'post' }}?
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  This {{ type ?? 'post' }} will be removed and invisible to the community.
                  <br/>
                  You can undo this action.
                </p>
              </div>
              <div class="mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  No, cancel
                </button>
                <button class="button red" @click="removeItem">
                  Yes, remove this {{ type ?? 'post' }}
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
  import { baseURL } from "@/server/constants";
  import { useApi } from '@/composables/api';
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

  // Removal
  const authCookie = useCookie("token").value;
  const toast = useToastStore();

  const removeItem = async () => {
    const type = props.type;
    const id = type === 'post' ? item.value.post.id : item.value.comment.id;
    await useApi("/remove", {
      body: {
          "target_fullname": `${type === 'post' ? 't3' : 't1'}_${id}`,
          "reason": "Violating community rules.",
      },
      method: "post",
    })
    .then(({ data }) => {
      if (data.value) {
        // Update state.
        if (type === 'post') {
          postsStore.updatePost(id, {
            is_removed: true
          });
        } else {
          commentsStore.updateComment(id, {
            is_removed: true
          });
        };
        // Parse response.
        data = JSON.parse(JSON.stringify(data.value));
        console.log(data);
        // Show success toast.
        setTimeout(() => {
          toast.addNotification({
            header:`${type} removed.`,
            message:`The ${type} was removed.`,
            type:'success'
          });
        }, 400);
      } else {
        // Show error toast.
        setTimeout(() => {
          toast.addNotification({
            header:'Removal failed',
            message:`Failed to removed ${type}. Please try again.`,
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
