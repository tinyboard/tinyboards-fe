<template>
    <div class="w-4/5 h-3/4 rounded-lg shadow-xl overflow-auto" style="background-color: rgb(244 244 245);">
        <nav id="header"
            class="sticky top-0 z-50 bg-primary sm:border-b border-black/30 dark:bg-gray-900 dark:border-gray-800 px-8 py-2 rounded-t-lg flex items-center">
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
            <div class="rounded-lg bg-gray-200/50 sm:rounded-md sm:border sm:shadow-inner-white">
                <div class="hidden sm:flex items-center space-x-4 p-2.5 sm:p-4 text-sm text-gray-500 leading-normal">
                    <ul class="hidden sm:flex flex-grow items-center text-xs text-gray-400">
                        <li class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24"
                                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 20h18v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8z"></path>
                                <path
                                    d="M2.996 14.803c.312 .135 .654 .204 1.004 .197a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35 .007 .692 -.062 1.004 -.197">
                                </path>
                                <path d="M12 4l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737z"></path>
                            </svg>
                            <span>
                                Board since
                                <span class="font-medium text-gray-600">
                                    Feb 29, 2030
                                </span>
                            </span>
                        </li>
                        <li class="ml-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24"
                                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <circle cx="12" cy="12" r="9"></circle>
                                <path d="M12 12h3.5"></path>
                                <path d="M12 7v5"></path>
                            </svg>
                            <span>
                                Last active
                                <span class="font-medium text-gray-600">this week</span>
                            </span>
                        </li>
                    </ul>
                    <ul class="ml-auto hidden lg:flex items-center text-xs text-gray-400">
                        <li class="ml-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24"
                                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                            </svg>
                            <span>
                                Followers
                                <span class="font-medium text-gray-600">
                                    7128
                                </span>
                            </span>
                        </li>
                        <li class="ml-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24"
                                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                                <path d="M16 5l3 3"></path>
                            </svg>
                            <span>Posts
                                <span class="font-medium text-gray-600">671 981</span>
                            </span>
                        </li>
                        <li class="ml-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24"
                                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
                            </svg>
                            <span>Comments
                                <span class="font-medium text-gray-600">3 456 789</span>
                            </span>
                        </li>
                    </ul>
                </div>
                <div id="details"
                    class="relative flex flex-col sm:flex-row sm:items-center w-full p-4 bg-cover bg-center sm:rounded-b-md"
                    :style="{ backgroundImage: `url(https://placebacon.net/600/200)` }">
                    <!-- Icon -->
                    <img loading="lazy" src="https://placebacon.net/100/100" alt="icon"
                        class="flex-shrink-0 w-24 h-24 object-cover rounded-none p-0.5 border bg-white" />
                    <!-- Info & Actions -->
                    <div class="flex flex-col w-full sm:ml-4 mt-4 sm:mt-0">
                        <!-- Name & Role -->
                        <div class="flex flex-col">
                            <h1 class="text-gray-100 text-lg sm:text-2xl leading-5 font-bold">
                                {{ displayName }}
                            </h1>
                            <p class="text-sm text-gray-200">
                                +{{ board.name ?? 'CoolBoard' }}
                            </p>
                        </div>
                        <!-- Bio -->
                        <p class="mt-2.5 lg:w-4/5 xl:w-3/5" :class="!true ? 'text-gray-400 italic' : 'text-gray-100'">
                            'Lorem ipsum dolor sit amet'
                        </p>
                    </div>
                </div>
            </div>
            <div class="mt-4 grid grid-cols-12">
                <div class="col-span-8">
                    <div class="border px-2 py-1 mb-2 rounded">
                        <p class="text-xs text-gray-600 font-semibold">Hot posts</p>
                    </div>
                    <div v-for="(post, index) in posts" :key="index" class="flex flex-row space-x-2 mb-2">
                        <img src="https://placebacon.net/120/120" class="w-10 h-10 rounded-sm" />
                        <div class="bg-white rounded border hover:bg-gray-50 cursor-pointer flex flex-grow flex-col p-2">
                            <div class="rounded-t pb-2">
                                <span class="font-bold text-xs text-primary">{{ post.user }}</span>
                            </div>
                            <div class="pb-2">
                                <h3 class="text-md text-gray-600 hover:text-primary-hover font-semibold">{{ post.title }}
                                </h3>
                            </div>
                            <li class="ml-0 group flex items-center space-x-2 leading-none text-sm font-medium">
                                <button class="upvote" :class="post.vote === 1 ? 'upvoted text-primary' : 'text-gray-500'">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                        class="w-6 h-6 sm:w-4 sm:h-4">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path
                                            d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z">
                                        </path>
                                    </svg>
                                </button>
                                <span :class="{
                                    'text-primary': post.vote === 1,
                                    'text-secondary': post.vote === -1,
                                    'text-gray-900 dark:text-gray-300': post.vote === 0,
                                }">
                                    {{ post.score }}
                                </span>
                                <button class="downvote" :class="post.vote === -1 ? 'downvoted text-secondary' : 'text-gray-500'
                                    ">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                        class="w-6 h-6 sm:w-4 sm:h-4">
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
                <div class="col-span-4 ml-8">
                    <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
                        About
                        <span class="text-gray-700 text-opacity-70">+{{ board.name ?? 'CoolBoard' }}</span>
                    </h2>
                    <div class="prose prose-sm text-gray-900">
                        <p>Lorem ipsum dolor sit amet</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSiteStore } from '@/stores/StoreSite.js';
import { useWizardStore } from '@/stores/StoreWizard';
import { computed } from 'vue';

const site = useSiteStore();
const board = useWizardStore();

const displayName = computed(() => {
    if (board.name === null) {
        return "CoolBoard";
    }

    if (board.displayName === '') {
        return board.name;
    }

    return board.displayName;
});

const posts = [
    {
        user: "spez",
        title: "Ayo this board is fire 🔥",
        score: 7,
        vote: 1
    },
    {
        user: "JoshRoehlBeats",
        title: "Please check out this song I wrote. The song is called \"Endless Summer\".",
        score: 32,
        vote: 0
    },
    {
        user: "ww1_911truth_info",
        title: "Was Hitler a NAZI? 10+1 things you didn't know about the German dictator",
        score: 2,
        vote: 0
    },
    {
        user: "CrystallineVulptex",
        title: "I have a feeling this board's moderators are in cahoots with the Silicon Valley elite",
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