<template>
    <main id="page-feed" class="flex flex-col pt-12 sm:pt-10">
        <!-- Sub Navigation & Banner -->
        <section
            class="flex-col"
            :class="route.params.board ? 'flex' : 'hidden md:flex'"
        >
            <NavigationNavbarSub
                :links="links"
                class="sm:order-first sm:hidden"
            />
            <div
                class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6"
            >
                <!-- Banner -->
                <LazyCardsBoardBanner
                    v-if="route.params.board"
                    :board="board"
                    class="col-span-full"
                />
                <LazyCardsBanner
                    v-else
                    title="Feed"
                    sub-title="Welcome to the awesome and exciting front page."
                    image-url="/img/artwork/front-page.jpeg"
                    class="col-span-full"
                />
            </div>
        </section>
        <!-- Main Content -->
        <section class="container mx-auto max-w-8xl sm:my-6 px-4">
            <div class="bg-white rounded p-2 my-4">
                <div
                    class="flex flex-row justify-around divide-x border-b pb-2"
                >
                    <div class="flex flex-grow flex-col text-center">
                        <p class="text-lg text-gray-900 font-bold">
                            {{ board.subscribers }}
                        </p>
                        <p class="text-sm text-gray-400">Members</p>
                    </div>
                    <div class="flex flex-grow flex-col text-center">
                        <p class="text-lg text-gray-900 font-bold">
                            {{ board.posts }}
                        </p>
                        <p class="text-sm text-gray-400">Posts</p>
                    </div>
                    <div class="flex flex-grow flex-col text-center">
                        <p class="text-lg text-gray-900 font-bold">
                            {{ board.comments }}
                        </p>
                        <p class="text-sm text-gray-400">Comments</p>
                    </div>
                </div>
                <div class="text-gray-400 pt-2 text-center">
                    Board since
                    <span class="text-gray-900">{{
                        format(parseISO(board.creationDate), "yyyy MMM. dd")
                    }}</span>
                </div>
            </div>
            <div class="prose prose-sm text-gray-900">
                <div v-if="board.sidebar_html" v-html="board.sidebar_html" />
                <p v-else>{{ board.description }}</p>
            </div>
            <!-- List mods -->
            <div>
                <h2 class="font-bold leading-5 text-base pb-1 border-b">
                    <span>Moderators</span>
                </h2>
                <ul
                    class="flex flex-col mt-4 space-y-2 divide-y divide-gray-200/50"
                >
                    <li
                        v-for="mod in mods.slice(0, 6)"
                        :key="mod.moderator.id"
                        class="pt-2 first:pt-0"
                    >
                        <NuxtLink
                            :to="`/@${mod.moderator.name}`"
                            class="flex space-x-2"
                        >
                            <img
                                loading="lazy"
                                class="p-0.5 w-9 h-9 object-cover bg-white border hover:bg-gray-200"
                                :src="
                                    mod.moderator.avatar ??
                                    'https://placekitten.com/36/36'
                                "
                            />
                            <div
                                class="flex flex-col justify-center leading-normal"
                            >
                                <div class="flex">
                                    <strong class="text-sm">{{
                                        mod.moderator.display_name ??
                                        mod.moderator.name
                                    }}</strong>
                                    <!-- Role -->
                                    <span
                                        v-if="mod.moderator.is_admin"
                                        class="ml-1 badge badge-red"
                                        >Admin</span
                                    >
                                </div>
                                <small class="text-gray-400 block">
                                    {{ mod.moderator.name }}
                                </small>
                            </div>
                        </NuxtLink>
                    </li>
                </ul>
                <NuxtLink
                    v-if="mods.length > 7"
                    :to="`/+${board.name}/mod/mods`"
                    >View {{ mods.length - 7 }} more</NuxtLink
                >
            </div>
        </section>
    </main>
</template>
<script setup>
import { usePostsStore } from "@/stores/StorePosts";
import { getListing } from "@/composables/listing";
// import { getBoard } from "@/composables/board";
import { useBoardStore } from "@/stores/StoreBoard";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { format, parseISO } from "date-fns";

// Import sidebar components
const Sidebar = defineAsyncComponent(
    () => import("@/components/containers/Sidebar"),
);
const SidebarBoard = defineAsyncComponent(
    () => import("@/components/containers/SidebarBoard"),
);

const router = useRouter();
const route = useRoute();
const userStore = useLoggedInUser();
const boardStore = useBoardStore();
const v = userStore.user;
//const boardView = boardStore.boardView;
const board = boardStore.board;
//const board = boardView.counts;
const mods = board.moderators;

console.log("stores have been set up");

definePageMeta({
    alias: ["/+:board/s", "/+:board/sidebar"],
    key: (route) => route.fullPath,
});

const title = board.is_removed
    ? `+${board.name}: Banned`
    : `${board.title ?? board.name} (+${board.name})`;

useHead({
    title,
});

// Links for sub navbar
const links = [
    { name: "Posts", href: `/+${board.name}` },
    { name: "About", href: `/+${board.name}/sidebar` },
];
</script>
