<template>
    <div class="w-[290px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base">
        <NuxtLink :to="`/b/${board.name}/submit`" class="flex items-center button primary">
            Create Post
        </NuxtLink>
        <div>
            <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
                About
                <span class="text-gray-700 text-opacity-70">/b/{{ board.name }}</span>
            </h2>
            <div class="prose prose-sm text-gray-900">
                <p v-if="board.sidebar_html">{{ board.sidebar_html }}</p>
                <p v-else>{{ board.description }}</p>
            </div>
        </div>
        <div>
            <h2 class="font-bold leading-5 text-base mb-1 pb-1 border-b">
                <span>Moderation</span>
            </h2>
            <ul class="flex flex-col space-y-2 py-2">
                <li>
                    <NuxtLink to="/" class="flex items-center">
                        <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>Overview</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/" class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
                        </svg>
                        <span>Mod Queue</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/" class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M14.274 10.291a4 4 0 1 0 -5.554 -5.58m-.548 3.453a4.01 4.01 0 0 0 2.62 2.65"></path>
                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 1.147 .167m2.685 2.681a4 4 0 0 1 .168 1.152v2"></path>
                            <line x1="3" y1="3" x2="21" y2="21"></line>
                        </svg>
                        <span>Banned Users</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/" class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25"></path>
                            <circle cx="8.5" cy="10.5" r="1"></circle>
                            <circle cx="12.5" cy="7.5" r="1"></circle>
                            <circle cx="16.5" cy="10.5" r="1"></circle>
                        </svg>
                        <span>Appearance</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/" class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <line x1="9" y1="6" x2="20" y2="6"></line>
                            <line x1="9" y1="12" x2="20" y2="12"></line>
                            <line x1="9" y1="18" x2="20" y2="18"></line>
                            <line x1="5" y1="6" x2="5" y2="6.01"></line>
                            <line x1="5" y1="12" x2="5" y2="12.01"></line>
                            <line x1="5" y1="18" x2="5" y2="18.01"></line>
                        </svg>
                        <span>Moderation Log</span>
                    </NuxtLink>
                </li>
            </ul>
        </div>
        <div>
            <h2 class="font-bold leading-5 text-base pb-1 border-b">
                <span>Admin Tools</span>
            </h2>
            <ul class="flex flex-col space-y-2 mt-4">
                <li>
                    <button class="flex items-center button green w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"></path>
                        </svg>
                        <span>Mod Self</span>
                    </button>
                </li>
                <li>
                    <button class="flex items-center button yellow w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7"></path>
                            <line x1="10" y1="10" x2="10.01" y2="10"></line>
                            <line x1="14" y1="10" x2="14.01" y2="10"></line>
                            <path d="M10 14a3.5 3.5 0 0 0 4 0"></path>
                        </svg>
                        <span>Hide from Combined Feeds</span>
                    </button>
                </li>
                <li>
                    <button class="flex items-center button red w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385"></path>
                            <path d="M6 9l4 4"></path>
                            <path d="M13 10l-4 -4"></path>
                            <path d="M3 21h7"></path>
                            <path d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z"></path>
                        </svg>
                        <span>Ban /b/{{ board.name }}</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script setup>
  import { baseURL } from "@/server/constants";
  import { format, parseISO } from "date-fns";
  import { shuffle } from "@/utils/shuffleArray";
  import { useApi } from "@/composables/api";

  const props = defineProps({
    board: {
        type: Object,
        required: true
    }
});
</script>