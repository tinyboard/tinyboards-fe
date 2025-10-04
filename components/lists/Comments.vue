<template>
    <!-- List of Comments -->
    <!-- Responsive indentation: ml-2 on mobile (8px), ml-4 on tablet+ (16px) -->
    <ul id="comments-list" v-if="comments" class="mt-4 first:mt-0 first-of-type:mt-0 ml-2 sm:ml-4">
        <li v-for="comment in comments" :key="comment.id" class="mt-2 first:mt-0">
            <div v-if="cards" class="bg-white border border-gray-200 p-4 mb-4 rounded">
                <div class="mb-2 text-gray-700" v-if="site.enableBoards">
                    <NuxtLink
                        :to="`/b/${comment.board.name}/p/${comment.post.id}/${comment.post.titleChunk}/${comment.id}?context=1#comment-text-${comment.id}`"
                        class="font-bold text-blue-600 hover:text-blue-700 hover:underline">{{ comment.post.title }}
                    </NuxtLink>
                    in
                    <NuxtLink :to="`/b/${comment.board.name}`" class="text-blue-600 hover:text-blue-700 hover:underline">
                        b/{{ comment.board.name }}</NuxtLink>
                </div>
                <div class="mb-2 text-gray-700" v-else>
                    <NuxtLink
                        :to="`/p/${comment.post.id}/${comment.post.titleChunk}/${comment.id}?context=1#comment-text-${comment.id}`"
                        class="font-bold text-blue-600 hover:text-blue-700 hover:underline">{{ comment.post.title }}
                    </NuxtLink>
                </div>
                <component v-if="comment" :comment="comment" :offset="offset"
                    :is="canViewComment(comment) ? Comment : CommentRemoved" />
            </div>
            <component v-else-if="comment" :comment="comment" :offset="offset"
                :is="canViewComment(comment) ? Comment : CommentRemoved" />
        </li>
    </ul>
</template>

<script setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useSiteStore } from "@/stores/StoreSite";
import { useBoardStore } from "~/stores/StoreBoard";
import { useCommentsStore } from "@/stores/StoreComments";
import { requirePermission } from "@/composables/admin";
import { requireModPermission } from "@/composables/mod";

const v = useLoggedInUser().user;
const modPermissions = useBoardStore().modPermissions;
const site = useSiteStore();
const commentStore = useCommentsStore();

const props = defineProps({
    comments: {
        type: Array,
        default: []
    },
    offset: {
        type: Number,
        default: 0,
    },
    cards: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        default: "tree"
    }
});

//console.log(JSON.stringify(props.comments, null, 4));

// Import comment components.
const Comment = defineAsyncComponent(
    () => import("@/components/cards/Comment"),
);
const CommentRemoved = defineAsyncComponent(
    () => import("@/components/cards/CommentRemoved"),
);

/*
    The "mode" prop specifies whether the comments are displayed in a tree for a post page, or as a list for everything else.
    If set to "tree", it'll pull the list of comments from the specified "comments" prop. If set to "list", it gets the comments from the comment store.
    This is to make pagination and eventually infinite scroll easier.
*/

const comments = computed(() => {
    const baseComments = props.mode === "tree" ? props.comments : commentStore.comments;
    return baseComments;
});

function canViewComment(comment) {
    // Admin or mod
    if (
        requirePermission("content") ||
        requireModPermission(modPermissions, "content")
    ) {
        return true;
    }

    // Own comment
    if (v && comment.isRemoved && v.id == comment.creator.id) {
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
