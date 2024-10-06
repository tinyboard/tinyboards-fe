<template>
    <div
        id="board-banner"
        class="col-span-full bg-gray-200/50 sm:rounded-md sm:border sm:shadow-inner-white"
    >
        <div
            class="hidden sm:flex items-center space-x-4 p-2.5 sm:p-4 text-sm text-gray-500 leading-normal"
        >
            <ul
                class="hidden sm:flex flex-grow items-center text-sm text-gray-400"
            >
                <li class="flex items-center">
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
                            d="M3 20h18v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8z"
                        ></path>
                        <path
                            d="M2.996 14.803c.312 .135 .654 .204 1.004 .197a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35 .007 .692 -.062 1.004 -.197"
                        ></path>
                        <path
                            d="M12 4l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737z"
                        ></path>
                    </svg>
                    <span>
                        Board since
                        <span
                            :title="board.creation_date"
                            class="font-medium text-gray-600"
                        >
                            {{
                                format(
                                    parseISO(board.creationDate),
                                    "MMM dd, yyyy",
                                )
                            }}
                        </span>
                    </span>
                </li>
                <!--<li class="ml-6 flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<circle cx="12" cy="12" r="9"></circle>
						<path d="M12 12h3.5"></path>
						<path d="M12 7v5"></path>
					</svg>
					<span>
						Last active
						<span class="font-medium text-gray-600">this week</span>
					</span>
				</li>-->
            </ul>
            <ul
                class="ml-auto hidden lg:flex items-center text-sm text-gray-400"
            >
                <li class="ml-6 flex items-center">
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
                        Members
                        <span class="font-medium text-gray-600">
                            {{ board.subscribers.toLocaleString() }}
                        </span>
                    </span>
                </li>
                <li class="ml-6 flex items-center">
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
                    <span
                        >Posts
                        <span class="font-medium text-gray-600">{{
                            board.postCount.toLocaleString()
                        }}</span>
                    </span>
                </li>
                <li class="ml-6 flex items-center">
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
                    <span
                        >Comments
                        <span class="font-medium text-gray-600">{{
                            board.commentCount.toLocaleString()
                        }}</span>
                    </span>
                </li>
            </ul>
        </div>
        <!-- Details -->
        <div
            id="banner"
            class="relative flex flex-col sm:flex-row sm:items-center w-full p-2.5 sm:p-6 bg-cover bg-center sm:rounded-b-md"
            :style="{ backgroundImage: `url(${board.banner})` }"
        >
            <!-- Icon -->
            <img
                loading="lazy"
                :src="board.icon"
                alt="icon"
                class="flex-shrink-0 w-24 h-24 md:w-36 md:h-36 object-cover rounded-none p-0.5 border bg-white"
            />
            <!-- Info & Actions -->
            <div class="flex flex-col w-full sm:ml-4 mt-4 sm:mt-0">
                <!-- Name & Role -->
                <div class="flex flex-col">
                    <h1
                        class="text-gray-100 text-lg sm:text-2xl leading-5 font-bold"
                    >
                        {{ board.title ?? board.name }}
                    </h1>
                    <p class="text-sm text-gray-200">
                        +{{ board.name }}
                        <span v-if="isSubscribed" class="ml-1 badge badge-blue"
                            >Joined</span
                        >
                    </p>
                </div>
                <!-- Bio -->
                <p
                    class="mt-2.5 lg:w-4/5 xl:w-3/5"
                    :class="
                        !board.description
                            ? 'text-gray-400 italic'
                            : 'text-gray-100'
                    "
                >
                    {{ board.description ?? "No description..." }}
                </p>
                <!-- Stats -->
                <small class="sm:hidden mt-2 text-gray-300">
                    Created
                    {{ format(parseISO(board.creationDate), "MMM dd, yyyy") }}
                </small>
                <!-- Actions -->
                <ul v-if="isAuthed" class="mt-2 flex items-center space-x-2">
                    <li v-if="isMod">
                        <NuxtLink
                            :to="`/+${board.name}/mod/settings`"
                            class="button button-sm white"
                        >
                            Settings
                        </NuxtLink>
                    </li>
                    <li>
                        <button
                            class="button button-sm border-[1px]"
                            :class="[isSubscribed ? 'red' : 'green']"
                            @click="toggleSubscribe"
                        >
                            {{ isSubscribed ? "Leave" : "Join" }}
                        </button>
                    </li>
                </ul>
                <!-- Mobile Stats -->
                <ul
                    class="flex lg:hidden items-center text-sm text-gray-300 border-t sm:border-0 border-white/10 mt-4 pt-2.5 md:pt-0"
                >
                    <li>
                        <span>
                            <strong>{{ boardCounts.subscribers }}</strong>
                            Members
                        </span>
                    </li>
                    <li class="ml-4">
                        <span>
                            <strong>{{ boardCounts.posts }}</strong>
                            {{ board.posts_count === 1 ? "Post" : "Posts" }}
                        </span>
                    </li>
                    <li class="ml-4">
                        <span>
                            <strong>{{ boardCounts.comments }}</strong>
                            {{
                                board.comments_count === 1
                                    ? "Comment"
                                    : "Comments"
                            }}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useApi } from "@/composables/api";
import { format, parseISO } from "date-fns";
import { useToastStore } from "@/stores/StoreToast";

const props = defineProps(["boardView"]);
const board = props.boardView.board;
const isMod = props.boardView.mod_permissions !== null;
const boardCounts = props.boardView.counts;

const userStore = useLoggedInUser();
const toast = useToastStore();

// Is Authed
const isAuthed = userStore.isAuthed;

const isSubscribed = ref(props.boardView.subscribed == "Subscribed");

const toggleSubscribe = async () => {
    isSubscribed.value = !isSubscribed.value;
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
    }
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
