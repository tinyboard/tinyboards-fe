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
                <div class="fixed min-h-full text-center">
                    <TransitionChild as="template" enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]"
                        enter-from="opacity-0 bottom-[-300px]" enter-to="opacity-100 bottom-[-20px]"
                        leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]" leave-from="bottom-[-0px]"
                        leave-to="opacity-0 bottom-[-300px]">
                        <DialogPanel
                            class="w-full fixed bottom-0 overflow-hidden rounded-t-md bg-white p-4 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="div"
                                class="relative text-xl font-bold leading-6 text-gray-900 text-center py-2">
                                Options
                                <button class="absolute top-0 right-0 text-gray-600" @click="modalStore.closeModal">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" width="24" height="24"
                                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                        <path d="M10 10l4 4m0 -4l-4 4"></path>
                                    </svg>
                                </button>
                            </DialogTitle>
                            <div class="modal-body mt-2">
                                <div class="bg-gray-100 rounded-lg text-lg text-gray-800">
                                    <ul class="divide-y divide-gray-300 font-semibold">
                                        <li>
                                            <button :disabled="!config.public.use_https"
                                                class="text-gray-800 w-full px-5 py-3 flex items-center" @click="copyLink"
                                                :class="{ 'line-through': !config.public.use_https }">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-4" width="24" height="24"
                                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                    stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path
                                                        d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z">
                                                    </path>
                                                    <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2">
                                                    </path>
                                                </svg>
                                                Copy link to {{ props.type }}
                                            </button>
                                        </li>
                                        <li v-if="props.type == 'comment'">
                                            <NuxtLink :to="permalink + '?context=3'"
                                                class="text-gray-800 px-5 py-3 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-4" width="24" height="24"
                                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                    stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path>
                                                    <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path>
                                                    <path d="M3 6l0 13"></path>
                                                    <path d="M12 6l0 13"></path>
                                                    <path d="M21 6l0 13"></path>
                                                </svg>
                                                Context
                                            </NuxtLink>
                                        </li>
                                        <li v-if="isAuthed && !isAuthor">
                                            <button class="w-full px-5 py-3 flex items-center" @click="confirmReport">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-4" width="24" height="24"
                                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                    stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
                                                </svg>
                                                Report {{ props.type }}
                                            </button>
                                        </li>
                                        <li v-if="isAuthor">
                                            <button class="w-full px-5 py-3 text-red-600 flex items-center"
                                                @click="confirmDelete">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-4" width="24" height="24"
                                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                    stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M4 7l16 0"></path>
                                                    <path d="M10 11l0 6"></path>
                                                    <path d="M14 11l0 6"></path>
                                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                                                </svg>
                                                Delete {{ props.type }}
                                            </button>
                                        </li>
                                        <li v-if="isAdmin && (props.options.object.report_count || isRemoved)">
                                            <button class="w-full px-5 py-3 text-green-600 flex items-center"
                                                @click="() => confirmRemoveOrApprove(true)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-4" width="24" height="24"
                                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                    stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                                    <path d="M9 12l2 2l4 -4"></path>
                                                </svg>
                                                Approve {{ props.type }}
                                            </button>
                                        </li>
                                        <li v-if="isAdmin">
                                            <button class="w-full px-5 py-3 text-red-600 flex items-center"
                                                @click="() => confirmRemoveOrApprove(false)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-4" width="24" height="24"
                                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                    stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                                    <path d="M5.7 5.7l12.6 12.6"></path>
                                                </svg>
                                                Remove {{ props.type }}
                                            </button>
                                        </li>
                                        <li v-if="isAdmin && !isAuthor && !creator.isBanned">
                                            <button class="w-full px-5 py-3 text-red-600 flex items-center"
                                                @click="confirmBan">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-4" width="24" height="24"
                                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                    stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path
                                                        d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385">
                                                    </path>
                                                    <path d="M6 9l4 4"></path>
                                                    <path d="M13 10l-4 -4"></path>
                                                    <path d="M3 21h7"></path>
                                                    <path
                                                        d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z">
                                                    </path>
                                                </svg>
                                                Ban @{{ creator.name }}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
  
<script setup>
import { ref, computed, watch } from 'vue'
// import { baseURL } from "@/server/constants";
import { useToastStore } from '@/stores/StoreToast';
import { useModalStore } from '@/stores/StoreModal';
import { useLoggedInUser } from '@/stores/StoreAuth';
import { usePostsStore } from '@/stores/StorePosts';
import { useAPI } from '@/composables/api';
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue';

const config = useRuntimeConfig();

const props = defineProps({
    isOpen: {
        type: Boolean
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
const userStore = useLoggedInUser();
const toast = useToastStore();

const creator = computed(() => props.options.object.creator);
const isAuthed = userStore.isAuthed;

// Author
const isAuthor = computed(() => {
    if (userStore.user && creator.value) {
        return userStore.user.name === creator.value.name;
    } else {
        return false;
    }
});

// Admin
const isAdmin = computed(() => {
    return !!userStore.user && userStore.user.isAdmin;
});

// Is removed
const isRemoved = computed(() => {
    return props.type == 'post' ? props.options.object.post.isRemoved : props.options.object.comment.isRemoved;
})


const postId = computed(() => {
    return props.type == 'comment' ? props.options.object.post.id : undefined;
})

// Link
const permalink = computed(() => {
    const base = `${config.public.use_https ? "https" : "http"}://${config.public.domain}`;

    return props.type == 'post' ? base + `/p/${props.id}` : base + `/p/${postId.value}/${props.id}`;
})

// Copy link
const copyLink = async () => {
    modalStore.closeModal();

    try {
        await navigator.clipboard.writeText(permalink.value);
        toast.addNotification({
            header: "Link copied",
            message: `Link to ${props.type} was copied to clipboard.`,
            type: "success",
        });
    } catch (err) {
        console.error("Failed to copy: " + err);
    }
}

// Delete
const confirmDelete = () => {
    modalStore.setModal({
        modal: "ModalDelete",
        id: props.id,
        contentType: props.type,
        isOpen: true,
    });
};

// Report
const confirmReport = () => {
    modalStore.setModal({
        modal: "ModalReport",
        id: props.id,
        contentType: props.type,
        isOpen: true,
    });
};

// Remove
const confirmRemoveOrApprove = approve => {
    modalStore.setModal({
        modal: "ModalRemoveOrApprove",
        id: props.id,
        contentType: props.type,
        isOpen: true,
        options: {
            approve
        }
    });
};


// Ban & Unban
const confirmBan = () => {
    modalStore.setModal({
        modal: 'ModalBan',
        id: creator.value.id,
        isOpen: true,
        options: {
            'isBanned': creator.value.isBanned,
            'user': creator.value
        }
    });
};
</script>
  