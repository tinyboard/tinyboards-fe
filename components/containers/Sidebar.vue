<template>
  <div class="w-[290px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base">
    <div class="p-2.5 bg-white border shadow-polaroid">
      <img class="w-full h-64 aspect-auto object-cover" :src="selectedImage"/>
      <small class="mt-4 block leading-none text-gray-400">
        Art submission by community members
      </small>
    </div>
    <div>
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
        About
      </h2>
      <p>
        Welcome to tinyboards.net. This is a cozy little corner of the Internet where we discuss the intersection of technology and society.
      </p>
    </div>
    <div v-if="users">
      <div class="flex items-end mb-3 pb-1 border-b">
        <h2 class="font-bold leading-5 text-base">
          Newest Members
        </h2>
        <NuxtLink to="/members" class="ml-auto text-sm font-normal hover:underline">
          View all &#8594;
        </NuxtLink>
      </div>
      <ul class="flex flex-col space-y-2 divide-y divide-gray-200/50">
        <li v-for="user in users.members" :key="user.id" class="pt-2 first:pt-0">
          <NuxtLink :to="`/user/${user.user.name}`" class="flex space-x-2">
            <img class="p-0.5 w-9 h-9 object-cover bg-white border hover:bg-gray-200" :src="user.user.avatar"/>
            <div class="flex flex-col justify-center leading-normal">
              <div class="flex">
                <strong class="text-sm">{{ user.user.name }}</strong>
                <!-- Role -->
                <span v-if="user.user.admin" class="ml-1 badge badge-blue">Admin</span>
              </div>
              <small class="text-gray-400 block">
                Since
                <span class="font-medium">
                  {{ format(parseISO(user.user.published), 'MMM dd, yyyy') }}
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
  import { shuffle } from '@/utils/shuffleArray';

// Define spotlight users
  const { data: users, pending, error, refresh } = await useFetch("/members", {
    query: { sort: 'new' },
    limit: 10,
    baseURL
  });

// TO-DO
// Refactor with proper `/assets/images/sidebar-art` folder
// https://nuxtjs.org/docs/directory-structure/assets/#images
  const images = [
    'https://i.imgur.com/x0I5K0N.gif',
    'https://i.imgur.com/GNCQODS.gif',
    'https://i.imgur.com/amEwe3k.gif',
    'https://i.imgur.com/Oa39PlB.gif',
    'https://i.imgur.com/HARAJ3P.gif',
    'https://i.imgur.com/YOmZ23H.jpg',
    'https://i.imgur.com/L36MJT3.jpg',
    'https://i.imgur.com/uRqJSdO.jpg',
    'https://i.imgur.com/EXbfWEb.gif'
    ];

  const selectedImage = shuffle(images)[0] ?? `https://i.imgur.com/x0I5K0N.gif`
</script>

<style scoped>
  .shadow-polaroid, .shadow-polaroid > * {
    position: relative;
  }
  .shadow-polaroid::before {
    content: '';
    position: absolute;
    bottom: -15px;
    right: 0px;
    width: 100%;
    height: 100%;
    background: url('/assets/images/shadow-lg.png') no-repeat bottom right;
  }
</style>