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
                <button :class="props.options.approve ? 'button green' : 'button red'" @click="toggleItemRemove">
                  Yes, {{ props.options.approve ? 'approve' : 'remove' }} this {{ type ?? 'post' }}
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
  // import { baseURL } from "@/server/constants";
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
    },
    options: {
      type: Object
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

  const toggleItemRemove = async () => {
    const type = props.type;
    const id = props.id;
    await useApi(`/${type === 'post' ? 'post' : 'comment'}s/${id}/removed`, {
      body: {
          //"target_id": id,
          "reason": "Violating community rules.",
          "value": !props.options.approve
      },
      method: "PATCH",
    })
    .then(({ data }) => {
      if (data.value) {
        // Update state.
        /*if (type === 'post') {
          postsStore.updatePost(id, {
            is_removed: !props.options.approve
          });
        } else {
          commentsStore.updateComment(id, {
            is_removed: !props.options.approve
          }); 
        };*/
        // Parse response.
        data = JSON.parse(JSON.stringify(data.value));
        console.log(data);
        // Show success toast.
        setTimeout(() => {
          toast.addNotification({
            header:`${type} ${props.options.approve ? 'approved' : 'removed'}.`,
            message:`The ${type} was ${props.options.approve ? 'approved' : 'removed'}.`,
            type:'success'
          });
        }, 400);
      } else {
        // Show error toast.
        setTimeout(() => {
          toast.addNotification({
            header:'Operation failed',
            message:`Failed to ${props.options.approve ? 'approve' : 'remove'} ${type}. Please try again.`,
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
