<template>
    <div id="board-banner" class="col-span-full bg-white sm:rounded-md border-b sm:border sm:shadow-inner-white">
        <div class="w-full sm:rounded-t-md relative"
            :class="[currentBoard.value?.banner ? 'h-28 sm:h-56' : 'h-14 sm:h-28']" :style="{
                backgroundColor: currentBoard.value?.primaryColor || '#3c6991',
                backgroundImage: `url(${currentBoard.value?.banner || ''})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }">
            <div class="absolute top-4 right-4 hidden sm:flex flex-row space-x-2 text-gray-500 text-sm">
                <div class="bg-white px-4 py-2 shadow-sm flex flex-row rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                    </svg>
                    <span>
                        <span class="font-medium text-gray-600">
                            {{ (currentBoard.value?.subscribers || 0).toLocaleString() }}
                        </span>
                        {{ (currentBoard.value?.subscribers || 0) === 1 ? "Member" : "Members" }}
                    </span>
                </div>
                <div class="bg-white px-4 py-2 shadow-sm flex flex-row rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                        <path d="M16 5l3 3"></path>
                    </svg>
                    <span>
                        <span class="font-medium text-gray-600">{{
                            (currentBoard.value?.postCount || 0).toLocaleString()
                        }}</span>
                        {{ (currentBoard.value?.postCount || 0) === 1 ? "Post" : "Posts" }}
                    </span>
                </div>
                <div class="bg-white px-4 py-2 shadow-sm flex flex-row rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
                    </svg>
                    <span>
                        <span class="font-medium text-gray-600">{{
                            (currentBoard.value?.commentCount || 0).toLocaleString()
                        }}</span>
                        {{ (currentBoard.value?.commentCount || 0) === 1 ? "Comment" : "Comments" }}
                    </span>
                </div>
            </div>
        </div>
        <div class="pt-2 sm:pt-4 px-2 sm:px-12 pb-6 sm:rounded-b-md">
            <div class="flex flex-row space-x-2 sm:space-x-4">
                <img v-if="currentBoard.value?.icon" loading="lazy" :src="currentBoard.value?.icon" alt="icon"
                    class="z-10 flex-shrink-0 w-24 h-24 md:w-36 md:h-36 object-cover rounded-none p-0.5 border bg-white mt-[-50px] sm:mt-[-60px]" />
                <div class="flex flex-col">
                    <div class="flex flex-row space-x-4">
                        <h1 class="text-gray-700 text-xl md:text-4xl leading-5 font-bold">
                            {{ currentBoard.value?.title ?? currentBoard.value?.name }}
                        </h1>
                        <button v-if="shouldShowJoinButton" class="hidden sm:block button w-24 group" :class="[
                            isSubscribed ? 'gray hover:red' : 'primary',
                        ]" @click="toggleSubscribe" :disabled="isSubscribing">
                            <span v-if="isSubscribing">Loading...</span>
                            <template v-else>
                                <span :class="{
                                    'inline group-hover:hidden': isSubscribed,
                                }">{{ isSubscribed ? "Joined" : "Join" }}</span>
                                <span :class="[
                                    isSubscribed
                                        ? 'hidden group-hover:inline'
                                        : 'hidden',
                                ]">Leave</span>
                            </template>
                        </button>
                        <NuxtLink v-if="isMod.value" :to="`/b/${currentBoard.value?.name}/mod/settings`"
                            class="hidden sm:block button w-24 gray text-center">
                            Settings
                        </NuxtLink>
                        <LazyMenusActionsBoard class="hidden sm:block" v-if="isAuthed" />
                    </div>
                    <p class="text-sm sm:text-md text-gray-500">
                        {{ currentBoard.value?.name }}
                        <span class="inline sm:hidden">
                            · {{ currentBoard.value?.subscribers || 0 }}
                            {{
                                (currentBoard.value?.subscribers || 0) === 1 ? "member" : "members"
                            }}</span>
                    </p>
                    <p v-if="currentBoard.value?.description" class="text-sm text-gray-600 mt-1">
                        {{ currentBoard.value?.description }}
                    </p>
                </div>
            </div>
            <div v-if="shouldShowJoinButton" class="block sm:hidden mt-2">
                <p class="text-md text-gray-700">{{ currentBoard.value?.description }}</p>
                <div class="mt-4 flex flex-row space-x-2">
                    <NuxtLink v-if="isMod.value" :to="`/b/${currentBoard.value?.name}/mod/settings`"
                        class="button flex-grow gray text-center">
                        Settings
                    </NuxtLink>
                    <button class="button flex-grow group" :class="[isSubscribed ? 'gray hover:red' : 'primary']"
                        @click="toggleSubscribe" :disabled="isSubscribing">
                        <span v-if="isSubscribing">Loading...</span>
                        <template v-else>
                            <span :class="{
                                'inline group-hover:hidden': isSubscribed,
                            }">{{ isSubscribed ? "Joined" : "Join" }}</span>
                            <span :class="[
                                isSubscribed
                                    ? 'hidden group-hover:inline'
                                    : 'hidden',
                            ]">Leave</span>
                        </template>
                    </button>
                    <!--<NuxtLink :to="`/b/${board.value?.name}/submit`" class="button primary flex-grow text-center">
						Create Post
					</NuxtLink>-->
                    <LazyMenusActionsBoard />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useSiteStore } from "@/stores/StoreSite";
import { format, parseISO } from "date-fns";
import { useToastStore } from "@/stores/StoreToast";
import { useGraphQLMutation } from "@/composables/useGraphQL";
import { useBoardStore } from "@/stores/StoreBoard";
import type { Board } from "@/types/types";

const props = defineProps<{
    board?: Board;
}>();

const boardStore = useBoardStore();
const site = useSiteStore();

// Use board from props if available, otherwise fall back to store
const currentBoard = computed(() => props.board || boardStore.board);

const isMod = computed(() => (currentBoard.value?.myModPermissions !== undefined && currentBoard.value?.myModPermissions !== 0) || false);
//const boardCounts = currentBoard.valueView.counts;

const userStore = useLoggedInUser();
const toast = useToastStore();

// Is Authed
const isAuthed = userStore.isAuthed;

const isSubscribed = computed(() => (currentBoard.value?.subscribedType || "notSubscribed") === "subscribed");
const isSubscribing = ref(false);

// Computed property to handle hydration issues
const shouldShowJoinButton = computed(() => {
    // Only show if boards are enabled, we're on client side, user is authenticated, and board data exists
    return site.enableBoards && process.client && isAuthed.value && currentBoard.value?.id;
});

const toggleSubscribe = async () => {
    if (isSubscribing.value) return;

    // Check if board data is available
    if (!currentBoard.value?.id) {
        console.error('No board ID available for subscription action. Board:', currentBoard.value);
        toast.addNotification({
            header: 'Error',
            message: 'Board data not available. Please refresh the page.',
            type: 'error'
        });
        return;
    }

    isSubscribing.value = true;
    const originalState = isSubscribed.value;

    try {
        if (isSubscribed.value) {
            // Unsubscribe from board
            const mutation = `
                mutation UnsubscribeFromBoard($boardId: Int!) {
                    unsubscribeFromBoard(boardId: $boardId)
                }
            `;

            const { data } = await useGraphQLMutation(mutation, {
                variables: { boardId: currentBoard.value?.id }
            });

            if (data.value?.unsubscribeFromBoard) {
                // Update board's subscribedType in store
                if (currentBoard.value) {
                    currentBoard.value.subscribedType = "notSubscribed";
                }
                toast.addNotification({
                    header: `Left ${currentBoard.value?.name}!`,
                    message: `You are no longer a member of ${currentBoard.value?.name}.`,
                    type: "success",
                });

                // Update user store
                userStore.removeJoinedBoard(currentBoard.value?.id);
            }
        } else {
            // Subscribe to board
            const mutation = `
                mutation SubscribeToBoard($boardId: Int!) {
                    subscribeToBoard(boardId: $boardId)
                }
            `;

            const { data } = await useGraphQLMutation(mutation, {
                variables: { boardId: currentBoard.value?.id }
            });

            if (data.value?.subscribeToBoard) {
                // Update board's subscribedType in store
                if (currentBoard.value) {
                    currentBoard.value.subscribedType = "subscribed";
                }
                toast.addNotification({
                    header: `Joined ${currentBoard.value?.name}!`,
                    message: `You are now a member of ${currentBoard.value?.name}.`,
                    type: "success",
                });

                // Update user store - create a board view object
                const boardView = {
                    board: currentBoard.value,
                    subscribed: "Subscribed"
                };
                userStore.addJoinedBoard(boardView);
            }
        }
    } catch (error) {
        console.error('Error toggling board subscription:', error);
        toast.addNotification({
            header: `${originalState ? "Leaving" : "Joining"} failed.`,
            message: error.message || "Something went wrong. Try again sometime later.",
            type: "error",
        });

        // Revert state on error - restore original subscribedType
        if (currentBoard.value) {
            currentBoard.value.subscribedType = originalState ? "subscribed" : "notSubscribed";
        }
    } finally {
        isSubscribing.value = false;
    }
};
</script>

<style scoped>
#banner {
    position: relative;
}

#banner>* {
    z-index: 10;
}

#banner::before {
    content: "";
    background: rgba(0, 0, 0, 0.9);
    background: linear-gradient(180deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(0, 0, 0, 0.8) 70%);
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    @apply sm:rounded-b-lg;
}

.lights::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 57px;
    width: 100%;
    background: url(https://i.imgur.com/BdGY6tH.png);
    animation: lights 1s infinite steps(2);
    pointer-events: none;
}

@keyframes lights {
    0% {
        /*Two zeros, not one !!*/
        /*[0] is equivalent to [0 50%] and will create a different animation */
        background-position: 0 0;
    }

    100% {
        background-position: 0 -138px;
    }
}
</style>
