<template>
    <main id="page-feed" class="flex flex-col pt-12 sm:pt-10">
        <!-- Sub Navigation & Banner -->
        <section class="flex-col" :class="route.params?.board ? 'flex' : 'hidden md:flex'">
            <!--<NavigationNavbarSub :links="links" class="sm:order-first" />-->

            <div
                class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-8 sm:px-4 md:px-6">
                <LazyCardsBanner title="Feed"
                    sub-title="This is the feed where everything ends up. All content from all boards."
                    :image-url="site.homepageBanner || '/img/artwork/front-page.jpeg'" class="col-span-full" />
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
                    <div v-else
                        class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
                        <p>
                            <span class="font-medium">
                                Awkward silence...
                            </span>
                            <br />
                            {{ site.name }} has no posts yet. At all.
                        </p>
                    </div>
                    <!-- Pagination -->
                    <LazyNavigationPaginate2 @paginate="loadMore" :is-loading="loading" />
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
import { usePosts } from "@/composables/posts";
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
    alias: ["/all/:sort?"],
    key: (route) => route.fullPath,
    title: "All",
});

const preferCardView = useCookie("preferCardView") ?? false;

const { hasPosts, error, queryParams, loadMore, loading } = await usePosts(
    mapToListingType("all")
);
</script>
