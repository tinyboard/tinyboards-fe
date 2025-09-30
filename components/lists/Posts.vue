<template>
    <div id="posts-list" class="flex flex-col" :class="isCompact
            ? 'border-y sm:border-x rounded-md divide-y'
            : 'space-y-2 sm:space-y-4'
        ">
        <CardsPost v-for="post in filteredPosts" :post="post" :key="post.id" :isCompact="isCompact"
            :boardPage="boardPage" />
    </div>
</template>
<script setup>
import { computed } from "vue";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { formatDate } from "@/utils/formatDate";
import { usePostsStore } from "@/stores/StorePosts";
import { useAdminContentFilter } from "@/composables/adminFilter";

const route = useRoute();
const postsStore = usePostsStore();
const { filterPosts } = useAdminContentFilter();

// Filter posts based on admin filter preference
const filteredPosts = computed(() => filterPosts(postsStore.posts));

const props = defineProps({
    /*posts: {
        type: Array,
        required: true
    },*/
    isCompact: {
        type: Boolean,
    },
});

const boardPage = computed(() => route.params?.hasOwnProperty("board"));
//console.log(props.boardPage);

/*onBeforeUnmount(() => {
    console.log("Clearing posts store...");
    postsStore.clear()
});*/
</script>
