<template>
    <!-- List of Comments -->
    <ul
        id="comments-list"
        v-if="comments.length"
        class="mt-4 first:mt-0 first-of-type:mt-0"
    >
        <li
            v-for="comment in comments"
            :key="comment.id"
            class="mt-2 first:mt-0"
        >
            <div
                v-if="cards"
                class="bg-white border border-gray-200 p-4 mb-4 rounded"
            >
                <div class="mb-2 text-gray-700">
                    <NuxtLink
                        :to="`/post/${comment.post.id}`"
                        class="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >{{ comment.post.title }}</NuxtLink
                    >
                    in
                    <NuxtLink
                        :to="`/+${comment.board.name}`"
                        class="text-blue-600 hover:text-blue-700 hover:underline"
                        >+{{ comment.board.name }}</NuxtLink
                    >
                </div>
                <component
                    v-if="comment"
                    :comment="comment"
                    :offset="offset"
                    :is="canViewComment(comment) ? Comment : CommentRemoved"
                />
            </div>
            <component
                v-else
                v-if="comment"
                :comment="comment"
                :offset="offset"
                :is="canViewComment(comment) ? Comment : CommentRemoved"
            />
        </li>
    </ul>
</template>

<script setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useBoardStore } from "@/stores/StoreBoard";
import { requirePermission } from "@/composables/admin";
import { requireModPermission } from "@/composables/mod";

const v = useLoggedInUser().user;
const modPermissions = useBoardStore().modPermissions;

const props = defineProps({
    comments: Array,
    offset: {
        type: Number,
        default: 0,
    },
    cards: {
        type: Boolean,
        default: false,
    },
});

// Import comment components.
const Comment = defineAsyncComponent(
    () => import("@/components/cards/Comment"),
);
const CommentRemoved = defineAsyncComponent(
    () => import("@/components/cards/CommentRemoved"),
);

function canViewComment(comment) {
    // Admin or mod
    if (
        requirePermission("content") ||
        requireModPermission(modPermissions, "content")
    ) {
        return true;
    }

    // Own comment
    if (v && comment.isRemoved && v.id == comment.creatorId) {
        return true;
    }

    return !(comment.isDeleted || comment.isRemoved);
}

/*
	let error = props.commentData.error;

	let comments = ref([]);
	//if (!error.value) {
	console.log('getting items');
	comments.value = props.commentData.listing.value.comments;
	console.log('done');*/
//}

// ======================================================================
// TO-DO:
// Decide whether we want to adjust limit based on mobile or desktop.
// Client-side required to calculate window width.
// Use a Nuxt feature to ignore this code during server-side rendering.
// ======================================================================

// let windowWidth = window.innerWidth;
// const txt = '';

// const onResize = () => { // set windowWidth to browser window width
// 	windowWidth = window.innerWidth
// }

// onMounted(() => {
// 	nextTick(() => {
// 		window.addEventListener('resize', onResize);
// 	});
// })

// onBeforeMount(() => {
// 	window.removeEventListener('resize', onResize);
// })
</script>
