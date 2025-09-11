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
                            <DialogTitle
                                as="h3"
                                class="text-lg font-bold leading-6 text-gray-900"
                            >
                                {{ isStickied ? "Unpin" : "Pin" }}
                                this post?
                            </DialogTitle>
                            <div class="modal-body mt-2">
                                <div
                                    v-if="
                                        site.enableBoards &&
                                        isAdminAndMod &&
                                        !isStickied
                                    "
                                >
                                    <h3
                                        class="text-lg text-gray-700 font-semibold"
                                    >
                                        Where to pin?
                                    </h3>
                                    <RadioGroup v-model="pinType">
                                        <div class="space-y-2 mt-2">
                                            <RadioGroupOption
                                                as="template"
                                                value="Board"
                                                v-slot="{ active, checked }"
                                            >
                                                <div
                                                    class="p-2 flex flex-row items-center space-x-2 rounded-md cursor-pointer"
                                                    :class="{
                                                        'bg-primary/40 ring-2 ring-primary':
                                                            checked,
                                                        'bg-primary/20': active,
                                                        '': !active,
                                                    }"
                                                >
                                                    <img
                                                        :src="board.icon"
                                                        class="w-10 h-10 rounded-md"
                                                    />
                                                    <div>
                                                        <RadioGroupLabel
                                                            as="h4"
                                                            class="text-md font-semibold"
                                                            :class="[
                                                                checked
                                                                    ? 'text-primary'
                                                                    : 'text-gray-800 dark:text-gray-100',
                                                            ]"
                                                        >
                                                            Pin to +{{
                                                                board.name
                                                            }}
                                                            as mod
                                                        </RadioGroupLabel>
                                                        <p
                                                            class="text-xs text-gray-600"
                                                        >
                                                            This post will be
                                                            visible at the top
                                                            of your board's post
                                                            listing.
                                                        </p>
                                                    </div>
                                                </div>
                                            </RadioGroupOption>
                                            <RadioGroupOption
                                                as="template"
                                                value="Local"
                                                v-slot="{ active, checked }"
                                            >
                                                <div
                                                    class="p-2 flex flex-row items-center space-x-2 rounded-md cursor-pointer"
                                                    :class="{
                                                        'bg-primary/40 ring-2 ring-primary':
                                                            checked,
                                                        'bg-primary/20': active,
                                                        '': !active,
                                                    }"
                                                >
                                                    <img
                                                        :src="site.icon"
                                                        class="w-10 h-10 rounded-md"
                                                    />
                                                    <div>
                                                        <RadioGroupLabel
                                                            as="h4"
                                                            class="text-md font-semibold"
                                                            :class="[
                                                                checked
                                                                    ? 'text-primary'
                                                                    : 'text-gray-800 dark:text-gray-100',
                                                            ]"
                                                        >
                                                            Pin to
                                                            {{ site.name }} as
                                                            admin
                                                        </RadioGroupLabel>
                                                        <p
                                                            class="text-xs text-gray-600"
                                                        >
                                                            This post will be
                                                            visible at the top
                                                            of the home feed.
                                                        </p>
                                                    </div>
                                                </div>
                                            </RadioGroupOption>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <p v-else class="text-sm text-gray-500">
                                    Pinned posts are visible at the top of
                                    {{
                                        props.options.isMod
                                            ? "the board"
                                            : "everyone's home feed"
                                    }}.
                                    <br />
                                    You can undo this action.
                                </p>
                            </div>
                            <div
                                class="modal-footer mt-4 flex space-x-2 justify-end"
                            >
                                <button
                                    type="button"
                                    class="button gray"
                                    @click="modalStore.closeModal"
                                >
                                    No, cancel
                                </button>
                                <button
                                    class="button"
                                    :class="isStickied ? 'red' : 'green'"
                                    @click="togglePostPin"
                                >
                                    Yes,
                                    {{ isStickied ? "unpin" : "pin" }}
                                    this post.
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
import { ref } from "vue";
// import { baseURL } from "@/server/constants";
import { useAPI } from "@/composables/api";
import { useSiteStore } from "@/stores/StoreSite";
//import { useBoardStore } from "@/stores/StoreBoard";
import { useToastStore } from "@/stores/StoreToast";
import { useModalStore } from "@/stores/StoreModal";
import { usePostsStore } from "@/stores/StorePosts";
import { requirePermission } from "@/composables/admin";
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption,
} from "@headlessui/vue";

const props = defineProps({
    isOpen: {
        type: Boolean,
    },
    id: {
        type: Number,
        default: null,
        required: true,
    },
    options: {
        type: Object,
    },
});

const modalStore = useModalStore();
//const boardStore = useBoardStore();
// const postsStore = usePostsStore();

//const item = computed(() => postsStore.getPost(props.id));

// Sticky
const toast = useToastStore();
const site = useSiteStore();

const pinType = ref(props.options.isMod ? "Board" : "Local");
const board = computed(() => props.options.board);
const isStickied = computed(
    () => props.options.isSitePinned || props.options.isBoardPinned,
);

// Ambiguity: if this is true, make the user pick whether to pin this post to board or site
const isAdminAndMod = computed(
    () => props.options.isMod && requirePermission("content"),
);

const togglePostPin = async () => {
    const id = props.id;

    if (props.options.isSitePinned) {
        pinType.value = "Local";
    }

    await useAPI(`/posts/${id}/featured`, {
        body: {
            //"post_id": id,
            value: !isStickied.value,
            feature_type: pinType.value,
        },
        method: "PATCH",
    })
        .then(({ data }) => {
            if (data.value) {
                // Update post state.
                /*postsStore.updatePost(id, {
          featured_local: !isStickied
        });
        // Parse response.
        data = JSON.parse(JSON.stringify(data.value));*/
                // Show success toast.
                setTimeout(() => {
                    toast.addNotification({
                        header: `Post ${isStickied.value ? "unpinned" : "pinned"}.`,
                        message: `The post ${isStickied ? "is not pinned anymore" : "is pinned to the top"}.`,
                        type: "success",
                    });
                }, 400);
            } else {
                // Show error toast.
                setTimeout(() => {
                    toast.addNotification({
                        header: `${isStickied.value ? "Unpinning" : "Pinning"} failed`,
                        message: `Failed to ${isStickied ? "unpin" : "pin"} the post. Please try again.`,
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
