<template>
    <div
        id="nav-left"
        class="fixed top-14 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen hidden 2xl:flex flex-col items-center w-20 py-4 md:z-50 overflow-none"
    >
        <div
            id="nav-left-buttons"
            class="flex flex-col space-y-2 h-screen pb-32 overflow-scroll"
        >
            <div class="flex flex-col space-y-2">
                <NuxtLink to="/home" custom v-slot="{ isActive, navigate }">
                    <button
                        title="Home"
                        class="relative flex group border p-[1px] transition-all duration-100"
                        :class="[
                            isActive
                                ? 'bg-primary border-primary text-primary'
                                : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800 text-gray-300 hover:bg-primary/70 hover:text-primary/70',
                        ]"
                        @click="() => navigate('/feed')"
                    >
                        <div
                            class="my-auto mx-auto w-12 h-12 bg-white dark:bg-gray-900 text-center flex justify-center items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-8 h-8 inline-block"
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
                        </div>
                        <!--<div class="absolute mx-2 p-2 w-auto min-w-max left-16 rounded-md shadow-md bg-white transition-all duration-100 scale-0 group-hover:scale-100 origin-left">
							<div class="flex flex-row space-x-2 items-center">
								<div class="w-12 h-12 bg-white flex justify-center items-center border p-[1px] text-gray-300 border-gray-300">
									<svg  xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 inline-block"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
									</svg>
								</div>
								<div class="text-left">
									<h3 class="font-semibold text-gray-800 text-md">Home</h3>
									<p class="text-gray-600 text-xs">Your own home feed.</p>
								</div>
							</div>
						</div>-->
                    </button>
                </NuxtLink>
                <NuxtLink to="/all" custom v-slot="{ isActive, navigate }">
                    <button
                        title="All"
                        class="relative flex group border p-[1px] transition-all duration-100"
                        :class="[
                            isActive
                                ? 'bg-primary border-primary text-primary'
                                : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800 text-gray-300 hover:bg-primary/70 hover:text-primary/70',
                        ]"
                        @click="() => navigate('/all')"
                    >
                        <div
                            class="my-auto mx-auto w-12 h-12 bg-white dark:bg-gray-800 text-center flex justify-center items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-8 h-8 inline-block"
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
                        </div>
                        <!--<div class="absolute mx-2 p-2 w-auto min-w-max left-16 rounded-md shadow-md bg-white transition-all duration-100 scale-0 group-hover:scale-100 origin-left">
							<div class="flex flex-row space-x-2 items-center">
								<div class="w-12 h-12 bg-white flex justify-center items-center border p-[1px] text-gray-300 border-gray-300">
									<svg  xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 inline-block"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>
								</div>
								<div class="text-left">
									<h3 class="font-semibold text-gray-800 text-md">All Posts</h3>
									<p class="text-gray-600 text-xs">All posts from all boards.</p>
								</div>
							</div>
						</div>-->
                    </button>
                </NuxtLink>
                <NuxtLink to="/boards" custom v-slot="{ isActive, navigate }">
                    <button
                        title="Boards"
                        class="relative flex group border p-[1px] transition-all duration-100"
                        :class="[
                            isActive
                                ? 'bg-primary border-primary text-primary'
                                : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800 text-gray-300 hover:bg-primary/70 hover:text-primary/70',
                        ]"
                        @click="() => navigate('/boards')"
                    >
                        <div
                            class="my-auto mx-auto w-12 h-12 bg-white dark:bg-gray-900 text-center flex justify-center items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-8 h-8 inline-block"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </button>
                </NuxtLink>
                <NuxtLink to="/streams" custom v-slot="{ isActive, navigate }">
                    <button
                        title="Streams"
                        class="relative flex group border p-[1px] transition-all duration-100"
                        :class="[
                            isActive
                                ? 'bg-primary border-primary text-primary'
                                : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800 text-gray-300 hover:bg-primary/70 hover:text-primary/70',
                        ]"
                        @click="() => navigate('/streams')"
                    >
                        <div
                            class="my-auto mx-auto w-12 h-12 bg-white dark:bg-gray-900 text-center flex justify-center items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-8 h-8 inline-block"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                <path d="M12 9l0 -6" />
                                <path d="M12 15l0 6" />
                                <path d="M15 12l6 0" />
                                <path d="M9 12l-6 0" />
                            </svg>
                        </div>
                    </button>
                </NuxtLink>
            </div>
            <div
                v-if="followedStreams.length > 0"
                class="mt-2 border-t border-gray-300 dark:border-gray-800 flex flex-col space-y-2 justify-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mx-auto mt-2 w-8 h-8 text-gray-300"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                    <path d="M12 9l0 -6" />
                    <path d="M12 15l0 6" />
                    <path d="M15 12l6 0" />
                    <path d="M9 12l-6 0" />
                </svg>
                <NuxtLink
                    v-for="stream in followedStreams"
                    :key="stream.id"
                    :to="`/streams/@${stream.creator?.name}/${stream.slug}`"
                    custom
                    v-slot="{ isActive, navigate }"
                >
                    <button
                        :title="`${stream.name} · ${stream.followerCount || 0} followers`"
                        class="relative flex group border p-[1px] transition-all duration-100"
                        :class="[
                            isActive
                                ? 'bg-primary border-primary text-primary'
                                : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800 text-gray-300 hover:bg-primary/70 hover:text-primary/70',
                        ]"
                        @click="() => navigate(`/streams/@${stream.creator?.name}/${stream.slug}`)"
                    >
                        <div
                            v-if="stream.icon"
                            class="w-12 h-12 flex items-center justify-center"
                        >
                            <img :src="stream.icon" class="w-full h-full object-cover" />
                        </div>
                        <div
                            v-else
                            class="w-12 h-12 flex items-center justify-center text-white font-bold text-lg"
                            :style="{ backgroundColor: stream.color || '#3B82F6' }"
                        >
                            {{ stream.name.charAt(0).toUpperCase() }}
                        </div>
                    </button>
                </NuxtLink>
            </div>
            <div
                v-if="joinedBoards.length > 0"
                class="mt-2 border-t border-gray-300 dark:border-gray-800 flex flex-col space-y-2 justify-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mx-auto mt-2 w-8 h-8 text-gray-300"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
                    />
                </svg>
                <NuxtLink
                    v-for="board in joinedBoards"
                    :key="board.name"
                    :to="`/b/${board.name}`"
                    custom
                    v-slot="{ isActive, navigate }"
                >
                    <button
                        :title="`${board.name} · ${board.subscribers} members`"
                        class="relative flex group border p-[1px] transition-all duration-100"
                        :class="[
                            isActive
                                ? 'bg-primary border-primary text-primary'
                                : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800 text-gray-300 hover:bg-primary/70 hover:text-primary/70',
                        ]"
                        @click="() => navigate(`/b/${board.name}`)"
                    >
                        <img :src="board.icon" class="w-12 h-12" />
                        <!--<div class="absolute mx-2 p-2 w-auto min-w-max left-16 rounded-md shadow-md bg-white transition-all duration-100 scale-0 group-hover:scale-100 origin-left">
							<div class="flex flex-row space-x-2 items-center">
								<img :src="boardView.board.icon" class="w-12 h-12" />
								<div class="text-left">
									<h3 class="font-semibold text-gray-800 text-md">{{ boardView.board.title ?? boardView.board.name }}</h3>
									<p class="text-gray-600 text-xs">{{ boardView.board.name }} · {{ boardView.counts.subscribers }} {{ boardView.counts.subscribers == 1 ? "member" : "members" }}</p>
								</div>
							</div>
						</div>-->
                    </button>
                </NuxtLink>
            </div>
            <div
                v-if="moddedBoards.length > 0"
                class="mt-2 border-t border-gray-300 flex flex-col space-y-2 justify-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mx-auto mt-2 w-8 h-8 text-gray-300"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"
                    />
                </svg>
                <NuxtLink
                    v-for="board in moddedBoards"
                    :key="board.name"
                    :to="`/b/${board.name}`"
                    custom
                    v-slot="{ isActive, navigate }"
                >
                    <button
                        :title="`${board.name} · ${board.subscribers} members`"
                        class="relative flex group border p-[1px] transition-all duration-100"
                        :class="[
                            isActive
                                ? 'bg-primary border-primary text-primary'
                                : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800 text-gray-300 hover:bg-primary/70 hover:text-primary/70',
                        ]"
                        @click="() => navigate(`/b/${board.name}`)"
                    >
                        <img :src="board.icon" class="w-12 h-12" />
                        <!--<div class="absolute mx-2 p-2 w-auto min-w-max left-16 rounded-md shadow-md bg-white transition-all duration-100 scale-0 group-hover:scale-100 origin-left">
							<div class="flex flex-row space-x-2 items-center">
								<img :src="boardView.board.icon" class="w-12 h-12" />
								<div class="text-left">
									<h3 class="font-semibold text-gray-800 text-md">{{ boardView.board.title ?? boardView.board.name }}</h3>
									<p class="text-gray-600 text-xs">{{ boardView.board.name }} · {{ boardView.counts.subscribers }} {{ boardView.counts.subscribers == 1 ? "member" : "members" }}</p>
								</div>
							</div>
						</div>-->
                    </button>
                </NuxtLink>
            </div>
            <div class="w-full h-64"></div>
        </div>
    </div>
</template>

<script setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useStreamStore } from "@/stores/stream";
import { computed, onMounted } from "vue";

const userStore = useLoggedInUser();
const streamStore = useStreamStore();

/*const joinedBoards = userStore.joinedBoards;
	const moddedBoards = userStore.moddedBoards;*/

const joinedBoards = computed(() => userStore.joinedBoards.slice(0, 9));
const moddedBoards = computed(() => userStore.moddedBoards.slice(0, 5));

// Fetch followed streams on mount
onMounted(async () => {
  if (userStore.isAuthed) {
    await streamStore.fetchFollowedStreams();
  }
});

// Get followed streams from store
const followedStreams = computed(() => streamStore.followedStreams.slice(0, 9));
</script>

<style type="text/css">
#nav-left-buttons {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
#nav-left-buttons::-webkit-scrollbar {
    width: 0;
    background: transparent;
}
</style>
