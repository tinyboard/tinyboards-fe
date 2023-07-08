<template>
  <div id="sidebar"
    class="w-[290px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base"
  >
    <div class="p-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-polaroid">
      <img loading="lazy" class="w-full h-64 aspect-auto object-cover img-expand" :src="selectedImage"/>
      <small class="mt-4 block leading-none text-gray-400">
        Art submission by community members
      </small>
    </div>
    <div class="prose prose-sm dark:prose-invert">
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b dark:border-gray-800">About</h2>
      <div>
        <p>
          Welcome to tinyboards.net. This is the main instance of tinyboards, the open-source project for cozy communities.
        </p>
        <p>
          <NuxtLink
            external
            target="_blank"
            to="https://discord.gg/zUDYfg6k4N"
          >
            Join our Discord
          </NuxtLink>
        </p>
      </div>
    </div>
    <div v-if="users">
      <div class="flex items-end mb-3 pb-1 border-b">
        <h2 class="font-bold leading-5 text-base">Newest Members</h2>
        <NuxtLink
          to="/members"
          class="ml-auto text-sm font-normal hover:underline"
        >
          View all &#8594;
        </NuxtLink>
      </div>
      <ul class="flex flex-col space-y-2 divide-y divide-gray-200/50">
        <li
          v-for="user in users.members"
          :key="user.id"
          class="pt-2 first:pt-0"
        >
          <NuxtLink :to="`/@${user.user.name}`" class="flex space-x-2">
            <img
              loading="lazy"
              class="p-0.5 w-9 h-9 object-cover bg-white border hover:bg-gray-200"
              :src="user.user.avatar ?? 'https://placekitten.com/36/36'"
            />
            <div class="flex flex-col justify-center leading-normal">
              <div class="flex">
                <strong class="text-sm">{{ user.user.name }}</strong>
                <!-- Role -->
                <span v-if="user.user.is_admin" class="ml-1 badge badge-blue"
                  >Admin</span
                >
              </div>
              <small class="text-gray-400 block">
                Since
                <span class="font-medium">
                  {{
                    format(parseISO(user.user.creation_date), "MMM dd, yyyy")
                  }}
                </span>
              </small>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { baseURL } from "@/server/constants";
import { format, parseISO } from "date-fns";
import { shuffle } from "@/utils/shuffleArray";

// Define spotlight users
const {
  data: users,
  pending,
  error,
  refresh,
} = await useFetch("/members", {
  query: { sort: "new", limit: 8 },
  baseURL,
});

// TO-DO
// Refactor with proper `/assets/images/sidebar-art` folder
// https://nuxtjs.org/docs/directory-structure/assets/#images
const images = [
  "/_nuxt/assets/images/artwork/sidebar.jpeg",
];

const selectedImage = shuffle(images)[0] ?? `/_nuxt/assets/images/artwork/sidebar.jpeg`;
</script>