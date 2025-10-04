<template>
    <main id="page-feed" class="flex flex-col pt-12 sm:pt-10">
        <!-- Sub Navigation & Banner -->
        <section class="flex-col" :class="route.params?.board ? 'flex' : 'hidden md:flex'">
            <!--<NavigationNavbarSub :links="links" class="sm:order-first" />-->

            <div
                class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-8 sm:px-4 md:px-6">
                <!-- Banner -->
                <LazyCardsBanner :title="isHomeFeed ? 'Home' : 'Feed'"
                    :sub-title="`Welcome to ${isHomeFeed ? 'your own, personalized home feed' : 'the awesome and exciting front page'}.`"
                    image-url="/img/artwork/front-page.jpeg" class="col-span-full" />
            </div>
        </section>
        <!-- Main Content -->
        <section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
            <div class="col-span-full flex gap-6">
                <div class="w-full">
                    <!-- Submission Form -->
                    <!-- Sorts & View Options -->
                    <div
                        class="flex items-center mb-4 p-2.5 sm:px-4 sm:py-3 bg-white dark:bg-gray-950 border-b sm:border sm:shadow-inner-white sm:rounded-md dark:border-gray-800 dark:shadow-none">
                        <MenusSort />
                        <div class="ml-auto flex space-x-2">
                            <button class="ml-auto" @click="preferCardView = true">
                                <!-- Rows Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="preferCardView
                                    ? 'text-primary'
                                    : 'text-gray-500'
                                    " viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <rect x="4" y="4" width="16" height="6" rx="2"></rect>
                                    <rect x="4" y="14" width="16" height="6" rx="2"></rect>
                                </svg>
                            </button>
                            <button class="ml-auto" @click="preferCardView = false">
                                <!-- Cards Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="preferCardView
                                    ? 'text-gray-500'
                                    : 'text-primary'
                                    " viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                                    <line x1="4" y1="12" x2="20" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <!-- Posts -->
                    <LazyListsPosts v-if="hasPosts" :isCompact="!preferCardView" :isLoading="false" :hasError="error" />
                    <!-- Private Instance Error -->
                    <div v-else-if="error?.isPrivateInstance"
                        class="px-4 py-24 text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
                        <div class="max-w-md mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto mb-4 text-gray-400" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                                <circle cx="12" cy="16" r="1"></circle>
                                <path d="m8 11v-4a4 4 0 0 1 8 0v4"></path>
                            </svg>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Private Instance</h3>
                            <p class="mb-4">
                                This is a private TinyBoards instance.
                                <br />
                                You need to log in to view posts and participate.
                            </p>
                            <div class="flex gap-3 justify-center">
                                <NuxtLink to="/login" class="button primary">
                                    Log in
                                </NuxtLink>
                                <NuxtLink to="/register" class="button secondary">
                                    Sign up
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                    <!-- Empty State -->
                    <div v-else-if="isHomeFeed"
                        class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
                        <p>
                            <span class="font-medium">
                                Your home feed is currently empty
                            </span>
                            <br />
                            You can change that by subscribing to some boards!
                            <br />
                            <NuxtLink to="/all">Browse posts</NuxtLink>
                        </p>
                    </div>
                    <div v-else
                        class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
                        <p>
                            <span class="font-medium">
                                There are no posts
                            </span>
                            <br />
                            but you can be the first...
                        </p>
                    </div>
                    <!-- Pagination -->
                    <LazyNavigationPaginate2 :is-loading="loading" @paginate="loadMore" />
                    <!--<div
                        v-if="totalPages > 1"
                        class="w-full mt-4 px-2.5 sm:px-0"
                    >
                        <LazyNavigationPaginate
                            :total-pages="totalPages"
                            :per-page="limit"
                            :current-page="page"
                        />
                    </div>-->
                </div>
                <!-- Sidebar -->
                <LazyContainersSidebar />
            </div>
        </section>
    </main>
</template>

<script lang="ts" setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useSiteStore } from "@/stores/StoreSite";
import { usePostsStore } from "@/stores/StorePosts";
import { usePosts, usePagination } from "@/composables/posts";
import { mapToListingType } from "@/types/types";

// Import sidebar components
const Sidebar = defineAsyncComponent(
    () => import("@/components/containers/Sidebar.vue"),
);
const SidebarBoard = defineAsyncComponent(
    () => import("@/components/containers/SidebarBoard.vue"),
);

const router = useRouter();
const route = useRoute();
const site = useSiteStore();
const userStore = useLoggedInUser();
const v = userStore.user;

definePageMeta({
    alias: ["", "/feed/:sort?"],
    key: (route) => route.fullPath,
    title: "Home",
});

const preferCardView = useCookie("preferCardView") ?? false;

const isHomeFeed = computed(() => userStore.isAuthed && site.enableBoards);

// Fetch initial posts
await usePosts(
    mapToListingType(isHomeFeed.value ? "subscribed" : "local")
);

// Create reactive computed for hasPosts from store
const postsStore = usePostsStore();
const hasPosts = computed(() => postsStore.posts.length > 0);
const error = ref(null);
const { loading, loadMore } = usePagination();

// Watch for route changes and refetch posts
watch(() => route.fullPath, async (newPath, oldPath) => {
    // Only refetch if we're navigating back to feed from elsewhere
    if (newPath.startsWith('/feed') || newPath === '/') {
        await usePosts(
            mapToListingType(isHomeFeed.value ? "subscribed" : "local")
        );
    }
}, { immediate: false });
</script>
