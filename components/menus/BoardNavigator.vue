<template>
    <Menu as="div" id="dropdown-profile" class="dropdown relative inline-block text-left">
        <div>
            <MenuButton class="flex items-center p-1 text-gray-900 font-bold rounded-sm focus:outline-none space-x-2">
                <img v-if="boardStore.hasBoard" :src="icon" class="w-9 h-9 border p-[0.5px] bg-white" />
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="w-8 h-8 text-gray-50" v-html="pageIcon" />
                <div class="flex items-center space-x-1 mr-2">
                    <p class="text-base text-white">
                        <strong>{{ pageTitle }}</strong>
                    </p>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24"
                        stroke-width="2" stroke="currentColor" fill="white" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M6 10l6 6l6 -6h-12"></path>
                    </svg>
                </div>
            </MenuButton>
        </div>
        <transition enter-active-class="transition ease-[cubic-bezier(.2,0,0,1.3)]"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition ease-[cubic-bezier(.2,0,0,1.3)]"
            leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
            <MenuItems
                class="text-md dropdown-menu absolute right-0 w-72 mt-4 origin-top-right bg-white divide-y divide-gray-100 rounded shadow-lg border focus:outline-none max-h-[500px] overflow-y-auto">
                <!-- Search -->
                <MenuItem as="div" @click.prevent="() => { }">
                <div class="px-3.5 py-2 w-full">
                    <input type="text" v-model="searchQuery"
                        class="border border-gray-300 rounded bg-gray-100 focus:ring-1 focus:ring-primary w-full"
                        placeholder="Search..." />
                </div>
                </MenuItem>
                <div v-if="searchQuery !== ''" class="py-2 text-sm">
                    <MenuItem as="div" v-slot="{ active, close }">
                    <!-- Go to board - if search is active -->
                    <NuxtLink :to="`/b/${searchQuery}`" :class="[
                        active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-800',
                        'text-md font-semibold group flex items-center w-full px-4 py-1.5',
                    ]" @click="close">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-2" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
                            <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
                            <path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                        </svg>
                        <span>Go to {{ searchQuery }}</span>
                    </NuxtLink>
                    </MenuItem>
                </div>
                <div v-else class="py-2 text-sm">
                    <!-- Home -->
                    <MenuItem as="div" v-slot="{ active, close }">
                    <NuxtLink to="/home" :class="[
                        active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-800',
                        'text-md font-semibold group flex items-center w-full px-4 py-1.5',
                    ]" @click="close">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-2" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                        </svg>
                        <span>Home</span>
                    </NuxtLink>
                    </MenuItem>
                    <!-- /all -->
                    <MenuItem as="div" v-slot="{ active, close }">
                    <NuxtLink to="/all" :class="[
                        active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-800',
                        'text-md font-semibold group flex items-center w-full px-4 py-1.5',
                    ]" @click="close">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-2" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                            <path d="M3.6 9h16.8" />
                            <path d="M3.6 15h16.8" />
                            <path d="M11.5 3a17 17 0 0 0 0 18" />
                            <path d="M12.5 3a17 17 0 0 1 0 18" />
                        </svg>
                        <span>All Posts</span>
                    </NuxtLink>
                    </MenuItem>
                    <!-- Boards -->
                    <MenuItem as="div" v-slot="{ active, close }">
                    <NuxtLink to="/boards" :class="[
                        active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-800',
                        'text-md font-semibold group flex items-center w-full px-4 py-1.5',
                    ]" @click="close">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-2" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Boards</span>
                    </NuxtLink>
                    </MenuItem>
                </div>
                <div v-if="recentBoards && recentBoards.length > 0" class="py-2 text-sm">
                    <!-- Recently visited boards -->
                    <div class="text-xs flex flex-row justify-between py-1 px-4">
                        <span class="font-semibold text-gray-600 uppercase">Recently visited</span>
                        <a @click="recentBoardsUnfiltered = []" class="cursor-pointer hover:underline">Clear</a>
                    </div>
                    <MenuItem as="div" v-slot="{ isActive, close }">
                    <NuxtLink v-for="board in recentBoards" :key="board.name" :to="`/b/${board.name}`" :class="[
                        isActive ? 'bg-gray-100' : 'hover:bg-gray-100',
                        'group flex items-center w-full px-4 py-1.5',
                    ]" @click="close">
                        <img :src="board.icon" class="w-8 h-8 mr-2 bg-white border p-[0.5px]" />
                        <div>
                            <div class="text-gray-800 text-md font-semibold">
                                {{ board.title ?? board.name }}
                            </div>
                            <span class="text-xs text-gray-600">{{ board.name }}</span>
                        </div>
                    </NuxtLink>
                    </MenuItem>
                </div>
                <div v-if="userStore.isAuthed && followedStreams && followedStreams.length > 0" class="py-2 text-sm">
                    <!-- Followed Streams -->
                    <div class="text-xs font-semibold text-gray-600 uppercase py-1 px-4">
                        Followed Streams
                    </div>
                    <MenuItem as="div" v-slot="{ isActive, close }">
                    <NuxtLink v-for="stream in followedStreams" :key="stream.id" :to="`/streams/@${stream.creator?.name}/${stream.slug}`" :class="[
                        isActive ? 'bg-gray-100' : 'hover:bg-gray-100',
                        'group flex items-center w-full px-4 py-1.5',
                    ]" @click="close">
                        <div v-if="stream.icon" class="w-8 h-8 mr-2 bg-white border p-[0.5px] flex items-center justify-center">
                            <img :src="stream.icon" class="w-full h-full object-cover" />
                        </div>
                        <div v-else class="w-8 h-8 mr-2 bg-white border p-[0.5px] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <circle cx="5" cy="19" r="1" />
                                <path d="M4 4a16 16 0 0 1 16 16" />
                                <path d="M4 11a9 9 0 0 1 9 9" />
                            </svg>
                        </div>
                        <div>
                            <div class="text-gray-800 text-md font-semibold">
                                {{ stream.name }}
                            </div>
                            <span class="text-xs text-gray-600">@{{ stream.creator?.name }}</span>
                        </div>
                    </NuxtLink>
                    </MenuItem>
                </div>
                <div v-if="userStore.isAuthed" class="py-2 text-sm">
                    <!-- Joined boards -->
                    <div class="text-xs font-semibold text-gray-600 uppercase py-1 px-4">
                        Joined boards
                    </div>
                    <MenuItem as="div" v-slot="{ isActive, close }">
                    <NuxtLink v-for="board in joinedBoards" :key="board.name" :to="`/b/${board.name}`" :class="[
                        isActive ? 'bg-gray-100' : 'hover:bg-gray-100',
                        'group flex items-center w-full px-4 py-1.5',
                    ]" @click="close">
                        <img :src="board.icon" class="w-8 h-8 mr-2 bg-white border p-[0.5px]" />
                        <div>
                            <div class="text-gray-800 text-md font-semibold">
                                {{ board.title ?? board.name }}
                            </div>
                            <span class="text-xs text-gray-600">{{ board.name }}</span>
                        </div>
                    </NuxtLink>
                    </MenuItem>
                </div>
                <div v-if="
                    userStore.isAuthed && userStore.moddedBoards.length > 0
                " class="py-2 text-sm">
                    <!-- Modded boards -->
                    <div class="text-xs font-semibold text-gray-600 uppercase py-1 px-4">
                        Moderated boards
                    </div>
                    <MenuItem as="div" v-slot="{ isActive, close }">
                    <NuxtLink v-for="board in moderatedBoards" :key="board.name" :to="`/b/${board.name}`" :class="[
                        isActive ? 'bg-gray-100' : 'hover:bg-gray-100',
                        'group flex items-center w-full px-4 py-1.5',
                    ]" @click="close">
                        <img :src="board.icon" class="w-8 h-8 mr-2 bg-white border p-[0.5px]" />
                        <div>
                            <div class="text-gray-800 text-md font-semibold">
                                {{ board.title ?? board.name }}
                            </div>
                            <span class="text-xs text-gray-600">{{ board.name }}</span>
                        </div>
                    </NuxtLink>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useBoardStore } from "~/stores/StoreBoard";
import { useStreamStore } from "@/stores/stream";
import { ref, computed, watch, onMounted } from "vue";

const recentBoardsUnfiltered = useCookie("recentBoards") ?? [];
const userStore = useLoggedInUser();
const boardStore = useBoardStore();
const streamStore = useStreamStore();
const route = useRoute();

// Fetch followed streams on mount if authenticated
onMounted(async () => {
    if (userStore.isAuthed) {
        await streamStore.fetchFollowedStreams();
    }
});

const v = userStore.user;
/*const joinedBoards = userStore.joinedBoards;
const moderatedBoards = userStore.moderatedBoards;*/

const searchQuery = ref("");

//const board = boardStore.board;

const pageTitle = computed(() => {
    if (boardStore.hasBoard) {
        return `${boardStore.board.name}`;
    } else if (route.meta.title === "Profile") {
        return `@${route.params?.username}`;
    } else {
        return route.meta.title ?? "Page";
    }
});

const icon = computed(() => boardStore.board.icon);

const recentBoards = computed(() => {
    return searchQuery.value === ""
        ? (recentBoardsUnfiltered.value ?? [])
        : recentBoardsUnfiltered.value.filter((board) =>
            board.name
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()),
        );
});

const joinedBoards = computed(() => {
    return searchQuery.value === ""
        ? userStore.joinedBoards.slice(0, 10)
        : userStore.joinedBoards.filter((board) =>
            board.name
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()),
        );
});

const moderatedBoards = computed(() => {
    return searchQuery.value === ""
        ? userStore.moddedBoards.slice(0, 5)
        : userStore.moddedBoards.filter((board) =>
            board.name
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()),
        );
});

const followedStreams = computed(() => {
    return searchQuery.value === ""
        ? streamStore.followedStreams.slice(0, 10)
        : streamStore.followedStreams.filter((stream) =>
            stream.name
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()),
        );
});

// Icons
const SVG_PATHS = {
    home: `
    <path
        stroke="none"
        d="M0 0h24v24H0z"
        fill="none"
    />
    <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
    <path
        d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"
    />
    <path
        d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"
    />
  `,
    all: `
  <path
      stroke="none"
      d="M0 0h24v24H0z"
      fill="none"
  />
  <path
      d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"
  />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
  `,
    profile: `
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
  `,
    settings: `
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
  `,
    admin: `
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
  `,
    "create post": `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" />`,
    default: `
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10 6h10" />
  <path d="M4 12h16" />
  <path d="M7 12h13" />
  <path d="M4 18h10" />
  `,
};

const pageIcon = computed(
    () => SVG_PATHS[route.meta.title?.toLowerCase()] || SVG_PATHS["default"],
);

// Clear board store when navigating away from board pages
watch(() => route.path, (newPath) => {
    // If we're not on a board page (/b/*), clear the board store
    if (!newPath.startsWith('/b/')) {
        boardStore.clear();
    }
}, { immediate: true });
</script>
