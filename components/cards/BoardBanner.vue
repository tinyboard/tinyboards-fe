<template>
    <div
        id="board-banner"
        class="col-span-full bg-white sm:rounded-md border-b sm:border sm:shadow-inner-white"
    >
        <div
            class="w-full bg-primary sm:rounded-t-md relative"
            :class="[board.banner ? 'h-28 sm:h-56' : 'h-14 sm:h-28']"
            :style="{
                backgroundImage: `url(${board.banner ?? ''})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }"
        >
            <div
                class="absolute top-4 right-4 hidden sm:flex flex-row space-x-2 text-gray-500 text-sm"
            >
                <div class="bg-white px-4 py-2 shadow-sm flex flex-row rounded">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 mr-1"
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
                        <circle cx="9" cy="7" r="4"></circle>
                        <path
                            d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"
                        ></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                    </svg>
                    <span>
                        <span class="font-medium text-gray-600">
                            {{ board.subscribers.toLocaleString() }}
                        </span>
                        {{ board.subscribers === 1 ? "Member" : "Members" }}
                    </span>
                </div>
                <div class="bg-white px-4 py-2 shadow-sm flex flex-row rounded">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 mr-1"
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
                        <path
                            d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                        ></path>
                        <path
                            d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"
                        ></path>
                        <path d="M16 5l3 3"></path>
                    </svg>
                    <span>
                        <span class="font-medium text-gray-600">{{
                            board.postCount.toLocaleString()
                        }}</span>
                        {{ board.postCount === 1 ? "Post" : "Posts" }}
                    </span>
                </div>
                <div class="bg-white px-4 py-2 shadow-sm flex flex-row rounded">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 mr-1"
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
                        <path
                            d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"
                        ></path>
                    </svg>
                    <span>
                        <span class="font-medium text-gray-600">{{
                            board.commentCount.toLocaleString()
                        }}</span>
                        {{ board.commentCount === 1 ? "Comment" : "Comments" }}
                    </span>
                </div>
            </div>
        </div>
        <div class="pt-2 sm:pt-4 px-2 sm:px-12 pb-6 sm:rounded-b-md">
            <div class="flex flex-row space-x-2 sm:space-x-4">
                <img
                    v-if="board.icon"
                    loading="lazy"
                    :src="board.icon"
                    alt="icon"
                    class="z-10 flex-shrink-0 w-24 h-24 md:w-36 md:h-36 object-cover rounded-none p-0.5 border bg-white mt-[-50px] sm:mt-[-60px]"
                />
                <div class="flex flex-col">
                    <div class="flex flex-row space-x-4">
                        <h1
                            class="text-gray-700 text-xl md:text-4xl leading-5 font-bold"
                        >
                            {{ board.title ?? board.name }}
                        </h1>
                        <button
                            v-if="isAuthed"
                            class="hidden sm:block button w-24 group"
                            :class="[
                                isSubscribed ? 'gray hover:red' : 'primary',
                            ]"
                            @click="toggleSubscribe"
                        >
                            <span
                                :class="{
                                    'inline group-hover:hidden': isSubscribed,
                                }"
                                >{{ isSubscribed ? "Joined" : "Join" }}</span
                            >
                            <span
                                :class="[
                                    isSubscribed
                                        ? 'hidden group-hover:inline'
                                        : 'hidden',
                                ]"
                                >Leave</span
                            >
                        </button>
                        <NuxtLink
                            v-if="isMod"
                            :to="`/+${board.name}/mod/settings`"
                            class="hidden sm:block button w-24 gray text-center"
                        >
                            Settings
                        </NuxtLink>
                        <LazyMenusActionsBoard
                            class="hidden sm:block"
                            v-if="isAuthed"
                        />
                    </div>
                    <p class="text-sm sm:text-md text-gray-500">
                        +{{ board.name }}
                        <span class="inline sm:hidden">
                            · {{ board.subscribers }}
                            {{
                                board.subscribers === 1 ? "member" : "members"
                            }}</span
                        >
                    </p>
                </div>
            </div>
            <div v-if="isAuthed" class="block sm:hidden mt-2">
                <p class="text-md text-gray-700">{{ board.description }}</p>
                <div class="mt-4 flex flex-row space-x-2">
                    <NuxtLink
                        v-if="isMod"
                        :to="`/+${board.name}/mod/settings`"
                        class="button flex-grow gray text-center"
                    >
                        Settings
                    </NuxtLink>
                    <button
                        class="button flex-grow group"
                        :class="[isSubscribed ? 'gray hover:red' : 'primary']"
                        @click="toggleSubscribe"
                    >
                        <span
                            :class="{
                                'inline group-hover:hidden': isSubscribed,
                            }"
                            >{{ isSubscribed ? "Joined" : "Join" }}</span
                        >
                        <span
                            :class="[
                                isSubscribed
                                    ? 'hidden group-hover:inline'
                                    : 'hidden',
                            ]"
                            >Leave</span
                        >
                    </button>
                    <!--<NuxtLink :to="`/+${board.name}/submit`" class="button primary flex-grow text-center">
						Create Post
					</NuxtLink>-->
                    <LazyMenusActionsBoard />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useApi } from "@/composables/api";
import { format, parseISO } from "date-fns";
import { useToastStore } from "@/stores/StoreToast";

const props = defineProps(["board"]);
const board = props.board;
const isMod = board.myModPermissions !== 0;
//const boardCounts = props.boardView.counts;

const userStore = useLoggedInUser();
const toast = useToastStore();

// Is Authed
const isAuthed = userStore.isAuthed;

const isSubscribed = ref(props.board.subscribedType == "subscribed");
//const isSubscribed = false;

const toggleSubscribe = async () => {
    /*isSubscribed.value = !isSubscribed.value;
    const { data, error } = await useApi(
        "/subscriptions/boards" + (isSubscribed.value ? "" : `/${board.id}`),
        {
            method: isSubscribed.value ? "post" : "delete",
            body: {
                board_name: board.name,
                //"subscribe": isSubscribed.value
            },
        },
    );

    if (data.value) {
        toast.addNotification({
            header: `${isSubscribed.value ? "Joined" : "Left"} +${board.name}!`,
            message: `You are ${isSubscribed.value ? "now a member" : "no longer a member"} of +${board.name}.`,
            type: "success",
        });

        if (isSubscribed.value) {
            //console.log(JSON.stringify(data.value["board_view"]));
            userStore.addJoinedBoard(data.value["board_view"]);
        } else {
            userStore.removeJoinedBoard(data.value["board_view"].board.id);
        }
    } else {
        toast.addNotification({
            header: `${isSubscribed.value ? "Joining" : "Leaving"} failed.`,
            message: "Something went wrong. Try again sometime later.",
            type: "error",
        });

        isSubscribed.value = !isSubscribed.value;
        console.error(error.value);
        }*/
};
</script>

<style scoped>
#banner {
    position: relative;
}
#banner > * {
    z-index: 10;
}
#banner::before {
    content: "";
    background: rgba(0, 0, 0, 0.9);
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(0, 0, 0, 0.8) 70%
    );
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
