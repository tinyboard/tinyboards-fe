<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="modalStore.closeModal" class="modal relative z-50">
            <!-- Backdrop -->
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/80" />
            </TransitionChild>
            <!-- Modal -->
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-2.5 sm:p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]"
                        enter-from="opacity-0 scale-90" enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-90">
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all">
                            <!-- Body -->
                            <div class="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 inline text-red-500" width="24"
                                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M18 18h-13l-1.865 -9.327a.25 .25 0 0 1 .4 -.244l4.465 3.571l1.6 -2.4m1.596 -2.394l.804 -1.206l4 6l4.464 -3.571a.25 .25 0 0 1 .401 .244l-1.363 6.818" />
                                    <path d="M3 3l18 18" />
                                </svg>
                                <h3 class="text-xl text-gray-700 font-bold">Step down as admin</h3>
                                <p class="text-gray-600">Are you sure you want to resign as an admin of {{ site.name }}?
                                    <br />
                                    <br />
                                    You won't be able to reclaim your current admin privileges unless another admin gives
                                    them
                                    back.
                                </p>
                            </div>

                            <!-- Footer -->
                            <div class="mt-4 flex flex-col space-y-2">
                                <button class="button red w-full" @click="leave">
                                    Confirm, step down
                                </button>
                                <button type="button" class="button gray" @click="modalStore.closeModal">
                                    No, cancel
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
import { useAPI } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';
import { useModalStore } from '@/stores/StoreModal';
import { useSiteStore } from '@/stores/StoreSite';
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
    /*username: {
      type: String,
      default: null,
      required: true
    },*/
    options: {
        type: Object
    }
});

const site = useSiteStore();
const modalStore = useModalStore();
const toast = useToastStore();

const leave = async () => {
    await useAPI('/admin/leave_admin', {
        body: {},
        method: "post"
    })
        .then(({ data }) => {
            if (data.value) {
                // Parse response.
                /*data = JSON.parse(JSON.stringify(data.value));
                console.log(data);*/
                // Show success toast.
                setTimeout(() => {
                    window.location.reload(true);

                    toast.addNotification({
                        header: "You have resigned as admin",
                        message: 'So long!',
                        type: 'success'
                    });
                }, 400);
            } else {
                // Show error toast.
                setTimeout(() => {
                    toast.addNotification({
                        header: "Failed to leave admin",
                        message: "Something went wrong. Try again a bit later, or verify that you're still an admin.",
                        type: 'error'
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