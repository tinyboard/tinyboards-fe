<template>
    <div class="w-4/5 h-3/4 rounded-lg shadow-xl overflow-auto" style="background-color: rgb(244 244 245);">
        <nav id="header"
            class="sticky top-0 z-50 border-black/30 dark:bg-gray-900 dark:border-gray-800 px-8 py-2 rounded-t-lg flex items-center"
            :style="{ 'background-color': board.primaryColor }">
            <img :src="site.icon" class="inline-block mr-2 max-w-[32px] max-h-[32px]" />
            <span class="text-lg text-white font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" class="inline w-5 h-5 text-opacity-60" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 6l6 6l-6 6" />
                </svg>
                +{{ board.name ?? 'CoolBoard' }}
            </span>
        </nav>
        <div class="mt-8 mx-8 overflow-hidden">
            <div id="board-banner" class="col-span-full bg-white rounded-md border shadow-inner-white">
                <div class="w-full bg-primary sm:rounded-t-md relative" :class="[bannerImage ? 'h-28 sm:h-44' : 'h-14 sm:h-28']" :style="{ backgroundImage: `url(${bannerImage ?? ''})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}">
                    <div class="absolute top-4 right-4 hidden sm:flex flex-row space-x-2 text-gray-500 text-xs">
                        <div class="bg-white px-4 py-2 shadow-sm flex flex-row rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                               <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                               <circle cx="9" cy="7" r="4"></circle>
                               <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                               <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                               <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                            </svg>
                            <span>
                                <span class="font-medium text-gray-600">
                                    1234
                                </span>
                                Members
                            </span>
                        </div>
                        <div class="bg-white px-4 py-2 shadow-sm flex flex-row rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                                <path d="M16 5l3 3"></path>
                            </svg>
                            <span>
                                <span class="font-medium text-gray-600">8645</span>
                                Posts
                            </span>
                        </div>
                        <div class="bg-white px-4 py-2 shadow-sm flex flex-row rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
                            </svg>
                            <span>
                                <span class="font-medium text-gray-600">12 764</span>
                                Comments
                            </span>
                        </div>
                    </div>
                </div>
                <div class="pt-4 px-2 sm:px-12 pb-6 rounded-b-md">
                    <div class="flex flex-row space-x-4">
                        <img
                        v-if="icon"
                        loading="lazy"
                        :src="icon"
                        alt="icon"
                        class="z-10 flex-shrink-0 w-24 h-24 object-cover rounded-none p-0.5 border bg-white mt-[-50px]"
                        />
                        <div class="flex flex-col">
                            <div class="flex flex-row space-x-4">
                                <h1 class="text-gray-700 text-2xl leading-5 font-bold">
                                    {{ displayName }}
                                </h1>
                                <button class="button button-sm gray w-24">
                                    Joined
                                </button>
                            </div>
                            <p class="text-sm sm:text-md text-gray-500">
                                +{{ board.name ?? 'CoolBoard' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4 flex flex-row">
                <div class="flex-grow">
                    <div class="border px-2 py-1 mb-2 rounded">
                        <p class="text-xs text-gray-600 font-semibold">Hot posts</p>
                    </div>
                    <div v-for="(post, index) in posts" :key="index" class="flex flex-row space-x-2 mb-2">
                        <img src="https://placebacon.net/120/120" class="w-10 h-10 rounded-sm" />
                        <div class="bg-white rounded border hover:bg-gray-50 cursor-pointer flex flex-grow flex-col p-2">
                            <div class="rounded-t pb-2">
                                <span class="font-bold text-xs" :style="{ 'color': board.primaryColor }">{{ post.user
                                }}</span>
                            </div>
                            <div class="pb-2">
                                <h3 class="text-md text-gray-600 font-semibold hover-primary"
                                    :style="`--color-custom-hover: ${board.hoverColor}`">
                                    {{ post.title }}
                                </h3>
                            </div>
                            <li class="ml-0 group flex items-center space-x-2 leading-none text-sm font-medium">
                                <button class="upvote"
                                    :style="{ 'color': post.vote === 1 ? board.primaryColor : 'rgb(113 113 122)' }">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        class="w-6 h-6 sm:w-4 sm:h-4"
                                        :style="{ 'fill': post.vote === 1 ? board.primaryColor : 'none' }">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path
                                            d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z">
                                        </path>
                                    </svg>
                                </button>
                                <span :style="{
                                    'color': (
                                        function () {
                                            if (post.vote === 1) {
                                                return board.primaryColor;
                                            } else if (post.vote === -1) {
                                                return board.secondaryColor;
                                            } else {
                                                return 'rgb(24 24 27)';
                                            }
                                        }
                                    )()
                                }">
                                    {{ post.score }}
                                </span>
                                <button class="downvote"
                                    :style="{ 'color': post.vote === -1 ? board.secondaryColor : 'rgb(113 113 122)' }">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        class="w-6 h-6 sm:w-4 sm:h-4"
                                        :style="{ 'fill': post.vote === -1 ? board.secondaryColor : 'none' }">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path
                                            d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z">
                                        </path>
                                    </svg>
                                </button>
                            </li>
                        </div>
                    </div>
                    <div class="my-8">
                        <p class="text-xs text-gray-500">Legal disclaimer: Any and all users in this dummy listing are
                            made up. Any correlation with existing users of {{ site.name }} or people anywhere else is
                            purely
                            coincidental.</p>
                    </div>
                </div>
                <div class="flex-grow-0 w-[290px] ml-8">
                    <button class="flex items-center button primary mb-4 w-full"
                        :style="{ 'background-color': board.primaryColor }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                            <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
                        </svg>
                        Create post
                    </button>
                    <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
                        About
                        <span class="text-gray-700 text-opacity-70">+{{ board.name ?? 'CoolBoard' }}</span>
                    </h2>
                    <div class="prose prose-sm text-gray-900">
                        <p>{{ board.description.length > 0 ? board.description : 'No description...' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSiteStore } from '@/stores/StoreSite.js';
import { useWizardStore } from '@/stores/StoreWizard';
import { useImageStore } from '@/stores/StoreImages';
import { computed } from 'vue';

const site = useSiteStore();
const board = useWizardStore();
const imageStore = useImageStore();

const displayName = computed(() => {
    if (board.name === null) {
        return "CoolBoard";
    }

    if (board.displayName === '') {
        return board.name;
    }

    return board.displayName;
});

const icon = computed(() => {
    if (imageStore.avatar) {
        return imageStore.avatar;
    }

    return null;
})

const bannerImage = computed(() => {
    if (imageStore.banner) {
        return imageStore.banner;
    }

    return null;
})

const posts = [
    {
        user: "spez",
        title: "Ayo this board is fire 🔥",
        score: 7,
        vote: 1
    },
    {
        user: "JoshRoehlBeats",
        title: "Please listen to this song I wrote. The song is called \"Endless Summer\".",
        score: 32,
        vote: -1
    },
    {
        user: "ww1_911truth_info",
        title: "Was Hitler a NAZI? 10+1 things you didn't know about the German dictator",
        score: 2,
        vote: 0
    },
    {
        user: "CrystallineVulptex",
        title: "I have a feeling this board's moderators are in cahoots with the Silicone Valley elite",
        score: 4,
        vote: -1
    },
    {
        user: "MAGA2024",
        title: "Liberals are FURIOUS that Trump supporters are getting this hat for FREE",
        score: -7,
        vote: 1
    },
    {
        user: "techsupport420",
        title: "\"msvcpr2331.dll\" missing, any tips for how to fix it?",
        score: 1,
        vote: 0
    },
    {
        user: "angry_badger",
        title: "Gay people are behind the fall of Rome",
        score: -5,
        vote: 1
    }
];
</script>

<style>
.hover-primary:hover {
    color: var(--color-custom-hover);
}

#banner {
    position: relative;
}
#banner > * {
    z-index: 10;
}
#banner::before {
    content: '';
    background: rgba(0,0,0,0.9);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0,0,0,0.8) 70%);
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    @apply sm:rounded-b-lg;
}
</style>