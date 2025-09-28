<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog
            as="div"
            @close="modalStore.closeModal"
            class="modal relative z-50"
        >
            <!-- Backdrop -->
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/80" />
            </TransitionChild>
            <!-- Modal -->
            <div class="fixed inset-0 overflow-y-auto">
                <div
                    class="flex min-h-full items-center justify-center p-2.5 sm:p-4 text-center"
                >
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]"
                        enter-from="opacity-0 scale-90"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-90"
                    >
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all"
                        >
                            <!-- Body -->
                            <div class="text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-24 h-24 inline text-red-500"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                    />
                                    <path
                                        d="M17.67 17.667a12 12 0 0 1 -5.67 3.333a12 12 0 0 1 -8.5 -15c.794 .036 1.583 -.006 2.357 -.124m3.128 -.926a11.997 11.997 0 0 0 3.015 -1.95a12 12 0 0 0 8.5 3a12 12 0 0 1 -1.116 9.376"
                                    />
                                    <path d="M3 3l18 18" />
                                </svg>
                                <h3 class="text-xl text-gray-700 font-bold">
                                    Step down as mod
                                </h3>
                                <p class="text-gray-600">
                                    Are you sure you want to resign as a
                                    moderator of {{ board.name }}?
                                    <br />
                                    <br />
                                    You can become a moderator again when
                                    someone invites you back to the team.
                                </p>
                            </div>

                            <!-- Footer -->
                            <div class="mt-4 flex flex-col space-y-2">
                                <button
                                    class="button red w-full"
                                    @click="leave"
                                >
                                    Confirm, step down
                                </button>
                                <button
                                    type="button"
                                    class="button white"
                                    @click="modalStore.closeModal"
                                >
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
import { useToastStore } from "@/stores/StoreToast";
import { useModalStore } from "@/stores/StoreModal";
//import { useSiteStore } from "@/stores/StoreSite";
import { useBoardStore } from "@/stores/StoreBoard";
import { useLoggedInUser } from "@/stores/StoreAuth";
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from "@headlessui/vue";

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    /*username: {
      type: String,
      default: null,
      required: true
    },*/
    options: {
        type: Object,
    },
});

//const site = useSiteStore();
const modalStore = useModalStore();
const boardStore = useBoardStore();
const userStore = useLoggedInUser();
const toast = useToastStore();

const board = boardStore.board;
const u = userStore.user;

const leave = async () => {
    await useAPI(`/boards/${board.id}/mods/${u.id}`, {
        body: {},
        method: "DELETE",
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
                        header: "You have resigned as a mod",
                        message: "So long!",
                        type: "success",
                    });
                }, 400);
            } else {
                // Show error toast.
                setTimeout(() => {
                    toast.addNotification({
                        header: "Failed to resign.",
                        message:
                            "Something went wrong. Try again a bit later, or verify that you're still a mod.",
                        type: "error",
                    });
                }, 400);
            }
        })
        .finally(() => {
            // Close the modal.
            modalStore.closeModal();
        });
};
</script>
