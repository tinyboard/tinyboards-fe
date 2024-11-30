<template>
    <div
        v-if="
            !(
                postsStore.posts.length < postsStore.options.limit &&
                postsStore.options.page == 1
            )
        "
        class="mt-2 flex w-full justify-between"
    >
        <div class="flex flex-row space-x-2">
            <NuxtLink
                custom
                :to="movePage(-1)"
                v-slot="{ navigate }"
                class="button white text-gray-700"
                :class="{ 'opacity-70 cursor-not-allowed': isBackDisabled }"
                :disabled="isBackDisabled"
            >
                <button
                    @click="() => navigate(movePage(-1))"
                    class="button white text-gray-700"
                    :class="{ 'opacity-70 cursor-not-allowed': isBackDisabled }"
                    :disabled="isBackDisabled"
                >
                    Prev
                </button>
            </NuxtLink>
            <NuxtLink
                custom
                :to="movePage(1)"
                v-slot="{ navigate }"
                class="button white text-gray-700"
                :class="{ 'opacity-70 cursor-not-allowed': isNextDisabled }"
                :disabled="isNextDisabled"
            >
                <button
                    @click="() => navigate(movePage(1))"
                    class="button white text-gray-700"
                    :class="{ 'opacity-70 cursor-not-allowed': isNextDisabled }"
                    :disabled="isNextDisabled"
                >
                    Next
                </button>
            </NuxtLink>
        </div>
        <button
            :disabled="isLoading"
            class="button white text-gray-700"
            @click="loadMore"
        >
            {{ isLoading ? "Loading" : "Load more" }}
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { usePostsStore } from "@/stores/StorePosts";
import { usePagination } from "@/composables/posts";

const route = useRoute();
const postsStore = usePostsStore();

const { loading: isLoading, loadMore } = usePagination();

const props = defineProps({
    /*posts: {
        type: Array,
        default: [],
    },
    queryParams: {
        type: Object,
        default: {
            page: ref(1),
            limit: 25,
        },
        },*/
    /*isLoading: {
        type: Boolean,
        default: false,
        },*/
});

const isBackDisabled = ref(postsStore.options.page == 1);
const isNextDisabled = ref(postsStore.posts.length < postsStore.options.limit);

const movePage = (direction) =>
    `${route.path}?page=${postsStore.options.page + direction}&limit=${postsStore.options.limit}&sort=${postsStore.options.sort}#banner`;
</script>
