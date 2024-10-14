<template>
    <Menu
        as="div"
        id="dropdown-profile"
        class="dropdown relative inline-block text-left"
    >
        <div>
            <MenuButton
                class="flex items-center p-1 text-gray-900 font-bold rounded-sm focus:outline-none space-x-2"
            >
                <img
                    v-if="boardStore.hasBoard"
                    :src="icon"
                    class="w-9 h-9 border p-[0.5px] bg-white"
                />
                <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-9 h-9"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 6h10" />
                    <path d="M4 12h16" />
                    <path d="M7 12h13" />
                    <path d="M4 18h10" />
                </svg>
                <div class="flex items-center space-x-1 mr-2">
                    <p class="text-base text-white">
                        <strong>{{ pageTitle }}</strong>
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5 text-white"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                        ></path>
                        <path d="M6 10l6 6l6 -6h-12"></path>
                    </svg>
                </div>
            </MenuButton>
        </div>
        <transition
            enter-active-class="transition ease-[cubic-bezier(.2,0,0,1.3)]"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition ease-[cubic-bezier(.2,0,0,1.3)]"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <MenuItems
                class="text-md dropdown-menu absolute right-0 w-64 mt-4 origin-top-right bg-white divide-y divide-gray-100 rounded shadow-lg border focus:outline-none max-h-[500px] overflow-y-auto"
            >
                <!-- Search -->
                <MenuItem as="div" v-slot="{ active, close }">
                    <div class="p-2 w-full">
                        <input
                            type="text"
                            class="border border-gray-100 rounded bg-white p-2 focus:ring-1 focus:ring-primary w-full"
                            placeholder="Search..."
                        />
                    </div>
                </MenuItem>
                <div class="py-2 text-sm">
                    <!-- Home -->
                    <MenuItem as="div" v-slot="{ active, close }">
                        <NuxtLink
                            to="/feed"
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-800',
                                'text-md font-semibold group flex items-center w-full px-4 py-1.5',
                            ]"
                            @click="close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-8 h-8 mr-2"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
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
                            </svg>
                            <span>Home</span>
                        </NuxtLink>
                    </MenuItem>
                    <!-- /all -->
                    <MenuItem as="div" v-slot="{ active, close }">
                        <NuxtLink
                            to="/all"
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-800',
                                'text-md font-semibold group flex items-center w-full px-4 py-1.5',
                            ]"
                            @click="close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-8 h-8 mr-2"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
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
                            </svg>
                            <span>All Posts</span>
                        </NuxtLink>
                    </MenuItem>
                </div>
                <div v-if="recentBoards" class="py-2 text-sm">
                    <!-- Recently visited boards -->
                    <div
                        class="text-xs flex flex-row justify-between py-1 px-4"
                    >
                        <span class="font-semibold text-gray-800 uppercase"
                            >Recently visited</span
                        >
                        <a
                            @click="recentBoards = []"
                            class="cursor-pointer hover:underline"
                            >Clear</a
                        >
                    </div>
                    <MenuItem as="div" v-slot="{ isActive, close }">
                        <NuxtLink
                            v-for="board in recentBoards"
                            :key="board.name"
                            :to="`/+${board.name}`"
                            :class="[
                                isActive ? 'bg-gray-100' : 'hover:bg-gray-100',
                                'group flex items-center w-full px-4 py-1.5',
                            ]"
                            @click="close"
                        >
                            <img
                                :src="board.icon"
                                class="w-8 h-8 mr-2 bg-white border p-[0.5px]"
                            />
                            <div>
                                <div
                                    class="text-gray-800 text-md font-semibold"
                                >
                                    {{ board.title ?? board.name }}
                                </div>
                                <span class="text-sm text-gray-600"
                                    >+{{ board.name }}</span
                                >
                            </div>
                        </NuxtLink>
                    </MenuItem>
                </div>
                <div v-if="userStore.isAuthed" class="py-2 text-sm">
                    <!-- Joined boards -->
                    <div
                        class="text-xs font-semibold text-gray-800 uppercase py-1 px-4"
                    >
                        Joined boards
                    </div>
                    <MenuItem as="div" v-slot="{ isActive, close }">
                        <NuxtLink
                            v-for="board in userStore.joinedBoards"
                            :key="board.name"
                            :to="`/+${board.name}`"
                            :class="[
                                isActive ? 'bg-gray-100' : 'hover:bg-gray-100',
                                'group flex items-center w-full px-4 py-1.5',
                            ]"
                            @click="close"
                        >
                            <img
                                :src="board.icon"
                                class="w-8 h-8 mr-2 bg-white border p-[0.5px]"
                            />
                            <div>
                                <div
                                    class="text-gray-800 text-md font-semibold"
                                >
                                    {{ board.title ?? board.name }}
                                </div>
                                <span class="text-sm text-gray-600"
                                    >+{{ board.name }}</span
                                >
                            </div>
                        </NuxtLink>
                    </MenuItem>
                </div>
                <div
                    v-if="
                        userStore.isAuthed && userStore.moddedBoards.length > 0
                    "
                    class="py-2 text-sm"
                >
                    <!-- Modded boards -->
                    <div
                        class="text-xs font-semibold text-gray-800 uppercase py-1 px-4"
                    >
                        Moderated boards
                    </div>
                    <MenuItem as="div" v-slot="{ isActive, close }">
                        <NuxtLink
                            v-for="board in userStore.moddedBoards"
                            :key="board.name"
                            :to="`/+${board.name}`"
                            :class="[
                                isActive ? 'bg-gray-100' : 'hover:bg-gray-100',
                                'group flex items-center w-full px-4 py-1.5',
                            ]"
                            @click="close"
                        >
                            <img
                                :src="board.icon"
                                class="w-8 h-8 mr-2 bg-white border p-[0.5px]"
                            />
                            <div>
                                <div
                                    class="text-gray-800 text-md font-semibold"
                                >
                                    {{ board.title ?? board.name }}
                                </div>
                                <span class="text-sm text-gray-600"
                                    >+{{ board.name }}</span
                                >
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
import { useBoardStore } from "@/stores/StoreBoard";
import { computed } from "vue";

const recentBoards = useCookie("recentBoards");
const userStore = useLoggedInUser();
const boardStore = useBoardStore();
const route = useRoute();

const v = userStore.user;
const joinedBoards = userStore.joinedBoards;
const moderatedBoards = userStore.moderatedBoards;

//const board = boardStore.board;

const pageTitle = computed(() => {
    if (boardStore.hasBoard) {
        return `+${boardStore.board.name}`;
    } else {
        return route.meta.title ?? "Page";
    }
});

const icon = computed(() => boardStore.board.icon);
</script>
