<template>
    <nav
        id="header"
        class="fixed w-full bg-primary dark:bg-gray-900 dark:border-gray-800 z-50"
    >
        <div class="mx-auto max-w-8xl px-3 sm:px-6">
            <div class="flex items-center justify-between h-14">
                <div class="flex items-center min-w-0 flex-1">
                    <div class="relative flex-shrink-0">
                        <NuxtLink
                            to="/home"
                            class="flex items-center font-bold text-base sm:text-lg text-white dark:text-gray-100"
                        >
                            <img
                                :src="site.icon"
                                class="w-7 h-7 sm:w-8 sm:h-8 mr-2 flex-shrink-0"
                            />
                            <span class="truncate">{{ site.name }}</span>
                        </NuxtLink>
                        <span
                            class="absolute -right-7 bottom-0 flashing-text font-mono text-xs hidden sm:block"
                        >
                            {{ selectedText }}
                        </span>
                    </div>
                    <MenusBoardNavigator
                        v-if="site.enableBoards"
                        class="ml-8 hidden md:block"
                    />
                    <StreamsCustomFeedsDropdown
                        v-if="isAuthed"
                        class="ml-4 hidden md:block"
                    />
                </div>
                <div class="hidden md:flex space-x-4">
                    <NuxtLink to="/register" class="button primary">
                        Sign up
                    </NuxtLink>
                    <NuxtLink to="/login" class="button gray">
                        Log in
                    </NuxtLink>
                </div>
                <div class="flex items-center md:hidden">
                    <!-- Mobile menu button -->
                    <button
                        class="flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-md transition-colors"
                        @click="toggleDrawer"
                    >
                        <span class="sr-only">Open main menu</span>
                        <!-- Menu Icon -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-6 h-6"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                            ></path>
                            <line x1="4" y1="6" x2="20" y2="6"></line>
                            <line x1="4" y1="12" x2="20" y2="12"></line>
                            <line x1="4" y1="18" x2="20" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <!-- Mobile Menu -->
                <transition
                    enter-class="opacity-0"
                    enter-active-class="duration-300 ease-out"
                    enter-to-class="opacity-100"
                    leave-class="opacity-100"
                    leave-active-class="duration-200 ease-in"
                    leave-to-class="opacity-0"
                >
                    <div
                        @click="isOpen = false"
                        @keydown.esc="isOpen = false"
                        v-show="isOpen"
                        class="fixed inset-0 bg-black/80"
                    ></div>
                </transition>
                <aside
                    class="transform top-0 right-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 fixed h-full overflow-y-auto ease-in-out transition-all duration-200 z-75"
                    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
                >
                    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                        <button
                            class="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            @click="toggleDrawer"
                        >
                            <span class="sr-only">Close menu</span>
                            <!-- X Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                    <div class="flex flex-col gap-3 p-4">
                        <NuxtLink to="/register" class="button primary w-full">
                            Sign up
                        </NuxtLink>
                        <NuxtLink to="/login" class="button white mt-2 w-full">
                            Log in
                        </NuxtLink>
                    </div>
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-4"></div>
                    <NuxtLink
                        to="/help/faq"
                        class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        @click="isOpen = false"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4 mr-2"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                            ></path>
                            <path d="M12 8h.01"></path>
                            <path d="M11 12h1v4h1"></path>
                            <path
                                d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"
                            ></path>
                        </svg>
                        <span>About</span>
                    </NuxtLink>
                    <NuxtLink
                        to="/help/rules"
                        class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        @click="isOpen = false"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4 mr-2"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                            ></path>
                            <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                            <path
                                d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5"
                            ></path>
                            <circle cx="6" cy="14" r="3"></circle>
                            <path
                                d="M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5"
                            ></path>
                        </svg>
                        <span>Rules</span>
                    </NuxtLink>
                    <!-- Board Navigation (Mobile - Not Authenticated) -->
                    <hr v-if="site.enableBoards" class="my-2 dark:border-gray-700 dark:border-opacity-70">
                    <div v-if="site.enableBoards" class="py-2">
                        <NuxtLink to="/home" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            @click="isOpen = false">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                                <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                            </svg>
                            <span>Home</span>
                        </NuxtLink>
                        <NuxtLink to="/all" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            @click="isOpen = false">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                <path d="M3.6 9h16.8" />
                                <path d="M3.6 15h16.8" />
                                <path d="M11.5 3a17 17 0 0 0 0 18" />
                                <path d="M12.5 3a17 17 0 0 1 0 18" />
                            </svg>
                            <span>All Posts</span>
                        </NuxtLink>
                        <NuxtLink to="/boards" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            @click="isOpen = false">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Browse All Boards</span>
                        </NuxtLink>
                    </div>
                </aside>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useSiteStore } from "@/stores/StoreSite.js";
import { useBoardStore } from "@/stores/StoreBoard.js";
import { useLoggedInUser } from "@/stores/StoreAuth.js";
import { shuffle } from "@/utils/shuffleArray";

const site = useSiteStore();
const boardStore = useBoardStore();
const userStore = useLoggedInUser();
const dark = false;

// Check authentication status
const isAuthed = computed(() => userStore.isAuthed);

// Yellow Text
const yellowText = [
    "pre-alpha",
    "It's PHP!",
    "It's jQuery!",
    "It's Rails!",
    "It's SSR!",
    "est. 2024",
];

const selectedText = ref(null);

if (process.client && typeof window !== "undefined") {
    selectedText.value = shuffle(yellowText)[0] ?? "It's Rails!";
} else {
    selectedText.value = "It's Rails!";
}

// Mobile menu
const isOpen = ref(false);

const toggleDrawer = () => {
    isOpen.value = !isOpen.value;
};
</script>
