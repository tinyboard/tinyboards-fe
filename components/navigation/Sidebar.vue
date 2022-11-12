<template>
  <div class="w-[280px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base">
    <div>
      <img class="p-1 w-full h-56 aspect-auto object-cover bg-white border" :src="selectedImage"/>
      <small class="text-gray-400 block mt-2">
        Art submission by Elon
      </small>
    </div>
    <div>
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
        About
      </h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>
    <div>
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
        Spotlight
      </h2>
      <ul class="flex flex-col space-y-2 divide-y divide-gray-200/50">
        <li v-for="user in spotlight" :key="user.id" class="flex space-x-2 pt-2 first:pt-0">
          <img class="p-0.5 w-9 h-9 object-cover bg-white border" :src="user.avatarUrl"/>
          <div class="flex flex-col justify-center">
            <strong class="text-primary leading-none">{{ user.username }}</strong>
            <small class="text-gray-500 block mt-0.5">
              <strong>{{ user.reputation }}</strong>
              reputation
            </small>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { shuffle } from '@/utils/shuffleArray';

// Define sub-navigation menu links
const spotlight = [
{ id: 1, username: 'elon', avatarUrl: 'https://i.imgur.com/svGJfRg.jpg', reputation: 980 },
{ id: 2, username: 'wojak', avatarUrl: 'https://i.imgur.com/BbOe1X6.jpg', reputation: 490 },
]

// TO-DO
// Refactor with proper `/assets/images/sidebar-art` folder
// https://nuxtjs.org/docs/directory-structure/assets/#images
const images = [
'https://i.imgur.com/x0I5K0N.gif',
'https://i.imgur.com/GNCQODS.gif',
'https://i.imgur.com/amEwe3k.gif',
'https://i.imgur.com/Oa39PlB.gif',
'https://i.imgur.com/HARAJ3P.gif'
];

const selectedImage = shuffle(images)[0] ?? `https://i.imgur.com/x0I5K0N.gif`

</script>
