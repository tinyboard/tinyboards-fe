<template>
  <div
    id="sidebar"
    class="w-[290px] hidden md:flex flex-col flex-shrink-0 space-y-6 text-base"
  >
    <div class="flex flex-col space-y-2" v-if="isAuthed">
      <NuxtLink :to="`/submit`" class="flex items-center button primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
           <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
        </svg>
        Create post
      </NuxtLink>

      <NuxtLink v-if="site.enableBoards && canCreateBoard" :to="`/createBoard`" class="flex items-center button gray">
        <svg  xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
        Create board
      </NuxtLink>
    </div>
    <div class="prose prose-sm dark:prose-invert">
      <h2
        class="font-bold leading-5 text-base mb-3 pb-1 border-b dark:border-gray-800"
      >
        About <span class="text-gray-500">{{ site.name }}</span>
      </h2>
      <div>
        <p>
          {{ site.description }}
        </p>
      </div>
    </div>
    <!-- Active Threads -->
    <ContainersSidebarActiveThreads :limit="10" />

    <!-- New Submissions -->
    <ContainersSidebarNewSubmissions :limit="3" />

    <!-- Members Online -->
    <ContainersSidebarMembersOnline :display-limit="50" />

    <!-- Site Statistics -->
    <ContainersSidebarSiteStatistics />
  </div>
</template>

<script setup>
import { shuffle } from "@/utils/shuffleArray";
import { useSiteStore } from "@/stores/StoreSite";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { requirePermission } from "@/composables/admin";

const site = useSiteStore();
const userStore = useLoggedInUser();
const isAuthed = userStore.isAuthed;

const canCreateBoard = (!site.boardCreationAdminOnly && isAuthed) || (site.boardCreationAdminOnly && requirePermission("boards"));

// TO-DO
// Refactor with proper `/img/sidebar-art` folder
// https://nuxtjs.org/docs/directory-structure/assets/#images
const images = ["/img/artwork/sidebar.jpeg"];

const selectedImage = shuffle(images)[0] ?? `/img/artwork/sidebar.jpeg`;
</script>
