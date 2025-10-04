<template>
    <nav v-if="isAuthed" class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 safe-area-bottom">
        <div class="flex items-center justify-around h-16 px-2">
            <!-- Home -->
            <NuxtLink to="/feed" class="flex flex-col items-center justify-center flex-1 h-full group" :class="isActive('/feed') ? 'text-primary' : 'text-gray-600 dark:text-gray-400'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                </svg>
                <span class="text-xs font-medium">Home</span>
            </NuxtLink>

            <!-- Boards -->
            <button v-if="site.enableBoards" @click="openBoardsMenu" class="flex flex-col items-center justify-center flex-1 h-full group" :class="isActive('/boards') || isActive('/b/') ? 'text-primary' : 'text-gray-600 dark:text-gray-400'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span class="text-xs font-medium">Boards</span>
            </button>

            <!-- Create Post (FAB style - elevated) -->
            <NuxtLink to="/submit" class="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-primary text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </NuxtLink>

            <!-- Inbox -->
            <NuxtLink to="/inbox" class="flex flex-col items-center justify-center flex-1 h-full group relative" :class="isActive('/inbox') ? 'text-primary' : 'text-gray-600 dark:text-gray-400'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <rect x="4" y="4" width="16" height="16" rx="2"/>
                    <path d="M4 13h3l3 3h4l3 -3h3"/>
                </svg>
                <span class="text-xs font-medium">Inbox</span>
                <span v-if="unread > 0" class="absolute top-1 right-3 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full">
                    {{ unread > 99 ? '99+' : unread }}
                </span>
            </NuxtLink>

            <!-- Profile -->
            <NuxtLink :to="`/@${user?.name}`" class="flex flex-col items-center justify-center flex-1 h-full group" :class="isActive(`/@${user?.name}`) ? 'text-primary' : 'text-gray-600 dark:text-gray-400'">
                <img v-if="user?.avatar" :src="user.avatar" class="w-6 h-6 rounded-full mb-1 border-2" :class="isActive(`/@${user?.name}`) ? 'border-primary' : 'border-gray-300 dark:border-gray-700'" />
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>
                </svg>
                <span class="text-xs font-medium">Profile</span>
            </NuxtLink>
        </div>
    </nav>

    <!-- Boards Bottom Sheet Modal -->
    <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="showBoardsSheet" @click="showBoardsSheet = false" class="md:hidden fixed inset-0 bg-black/50 z-50"></div>
    </transition>
    <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
    >
        <div v-if="showBoardsSheet" class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden">
            <!-- Drag Handle -->
            <div class="flex justify-center pt-3 pb-2">
                <div class="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>

            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Boards</h3>
                <button @click="showBoardsSheet = false" class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="overflow-y-auto" style="max-height: calc(80vh - 80px);">
                <!-- Quick Links -->
                <div class="py-2">
                    <NuxtLink to="/feed" @click="showBoardsSheet = false" class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                        </svg>
                        <span class="text-gray-900 dark:text-gray-100 font-medium">Home Feed</span>
                    </NuxtLink>
                    <NuxtLink to="/all" @click="showBoardsSheet = false" class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                            <path d="M3.6 9h16.8" />
                            <path d="M3.6 15h16.8" />
                            <path d="M11.5 3a17 17 0 0 0 0 18" />
                            <path d="M12.5 3a17 17 0 0 1 0 18" />
                        </svg>
                        <span class="text-gray-900 dark:text-gray-100 font-medium">All Posts</span>
                    </NuxtLink>
                    <NuxtLink to="/boards" @click="showBoardsSheet = false" class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <span class="text-gray-900 dark:text-gray-100 font-medium">Browse All Boards</span>
                    </NuxtLink>
                </div>

                <!-- Joined Boards -->
                <div v-if="joinedBoards.length > 0" class="border-t border-gray-200 dark:border-gray-800 py-2">
                    <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined Boards
                    </div>
                    <NuxtLink
                        v-for="board in joinedBoards"
                        :key="board.name"
                        :to="`/b/${board.name}`"
                        @click="showBoardsSheet = false"
                        class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <img :src="board.icon" class="w-10 h-10 rounded mr-3 border border-gray-200 dark:border-gray-700" />
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {{ board.title || board.name }}
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                {{ board.name }}
                            </div>
                        </div>
                    </NuxtLink>
                </div>

                <!-- Moderated Boards -->
                <div v-if="moddedBoards.length > 0" class="border-t border-gray-200 dark:border-gray-800 py-2">
                    <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Moderated Boards
                    </div>
                    <NuxtLink
                        v-for="board in moddedBoards"
                        :key="board.name"
                        :to="`/b/${board.name}`"
                        @click="showBoardsSheet = false"
                        class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <img :src="board.icon" class="w-10 h-10 rounded mr-3 border border-gray-200 dark:border-gray-700" />
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {{ board.title || board.name }}
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                {{ board.name }}
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLoggedInUser } from '@/stores/StoreAuth';
import { useSiteStore } from '@/stores/StoreSite';

const route = useRoute();
const userStore = useLoggedInUser();
const site = useSiteStore();

const isAuthed = computed(() => userStore.isAuthed && !!userStore.user);
const user = computed(() => userStore.user);
const unread = computed(() => userStore.unread || 0);
const joinedBoards = computed(() => userStore.joinedBoards || []);
const moddedBoards = computed(() => userStore.moddedBoards || []);

const showBoardsSheet = ref(false);

const isActive = (path) => {
    if (path === '/feed') {
        return route.path === '/feed' || route.path === '/';
    }
    if (path.startsWith('/b/')) {
        return route.path.startsWith('/b/');
    }
    return route.path.startsWith(path);
};

const openBoardsMenu = () => {
    showBoardsSheet.value = true;
};
</script>

<style scoped>
/* Safe area for devices with notches */
.safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
}
</style>
