<template>
  <div
    class="w-[290px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base"
  >
    <div class="p-2.5 bg-white border shadow-polaroid">
      <img loading="lazy" class="w-full h-64 aspect-auto object-cover img-expand" :src="selectedImage"/>
      <small class="mt-4 block leading-none text-gray-400">
        Art submission by community members
      </small>
    </div>
    <div>
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">About</h2>
      <div class="prose prose-sm text-gray-900">
        <p>
          Welcome to tinyboards.net. This is a cozy little corner of the
          Internet where we discuss the intersection of technology and society.
        </p>
        <p>
          <NuxtLink
            external
            target="_blank"
            to="https://discord.gg/zUDYfg6k4N"
            style="color: #a60d0d; font-family: 'Georgia'"
          >
            👋 Discord server
          </NuxtLink>
          <br/>
          <NuxtLink
            to="https://forum.porpl.net/p/6"
            style="color: #a60d0d; font-family: 'Georgia'"
          >
            👾 Bug Megathread
          </NuxtLink>
          <br/>
          <NuxtLink
            to="https://forum.porpl.net/p/32"
            style="color: #a60d0d; font-family: 'Georgia'"
          >
            🛠️ Feature Request Megathread
          </NuxtLink>
        </p>
        <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
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
          <NuxtLink :to="`/user/${user.user.name}`" class="flex space-x-2">
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
  "https://forum.porpl.net/image/447288c1-6f77-4616-9029-0a197a498a7a.webp?thumbnail=270",
  "https://forum.porpl.net/image/d0613892-5740-492d-839b-b7f6e5ae6fee.jpeg?format=webp&thumbnail=400"
  // "https://i.imgur.com/x0I5K0N.gif",
  // "https://i.imgur.com/amEwe3k.gif",
  // "https://i.imgur.com/Oa39PlB.gif",
  // "https://i.imgur.com/HARAJ3P.gif",
  // "https://i.imgur.com/YOmZ23H.jpg",
  // "https://i.imgur.com/L36MJT3.jpg",
  // "https://i.imgur.com/uRqJSdO.jpg",
  // "https://i.imgur.com/EXbfWEb.gif",
  // "https://i.imgur.com/dOuGQTV.gif",
  // "https://i.imgur.com/YDbnReb.png",
  // "https://i.imgur.com/X7zDwCM.gif",
  // "https://i.imgur.com/ZT8ZpX4.jpg",
  // "https://i.imgur.com/It1ro7S.png",
  // "https://i.imgur.com/wJ4wVjd.png",
  // "https://i.imgur.com/HN953k0.png",
  // "https://i.imgur.com/nep99Uk.jpg"
];

const selectedImage = shuffle(images)[0] ?? `https://i.imgur.com/x0I5K0N.gif`;
</script>

<style scoped>
.shadow-polaroid,
.shadow-polaroid > * {
  position: relative;
}
.shadow-polaroid::before {
  content: "";
  position: absolute;
  bottom: -15px;
  right: 0px;
  width: 100%;
  height: 100%;
  background: url("/assets/images/shadow-lg.png") no-repeat bottom right;
}
</style>
