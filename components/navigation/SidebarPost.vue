<template>
    <div class="w-[280px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base">
      <div class="p-4 border rounded-md">
            <NuxtLink :to="'/'+author.username" class="group flex items-center space-x-2  mb-4">
                  <!-- Avatar -->
                  <img
                  loading="lazy"
                  :src="author.avatarUrl"
                  alt="avatar"
                  class="flex-shrink-0 w-9 h-9 object-cover rounded-sm rounded-none p-1 border bg-white group-hover:bg-gray-200 group-hover:border-transparent"
                  />
                  <!-- Username -->
                  <strong>
                        {{ author.username }}
                  </strong>
            </NuxtLink>
            <div class="flex flex-wrap -m-2">
                  <div class="w-2/4 p-2">
                        <p class="text-lg leading-4">120</p>
                        <small class="text-gray-500">Posts</small>
                  </div>
                  <div class="w-2/4 p-2">
                        <p class="text-lg leading-4">45</p>
                        <small class="text-gray-500">Comments</small>
                  </div>
                  <div class="w-2/4 p-2">
                        <p class="text-lg leading-4">120</p>
                        <small class="text-gray-500">Reputation</small>
                  </div>
                  <div class="w-2/4 p-2">
                        <p class="text-lg leading-4">12K</p>
                        <small class="text-gray-500">Hours lurking</small>
                  </div>
            </div>
      </div>
      <div>
            <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
                  Details
            </h2>
            <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
      </div>
      <div>
            <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
                  Share
            </h2>
            <ul class="flex flex-col space-y-2 divide-y">
                  <li v-for="social in socials" :key="social.name" class="flex space-x-2 pt-2 first:pt-0">
                        <!-- svg icon -->
                        <NuxtLink class="flex flex-col justify-center">
                              {{ social.name }}
                        </NuxtLink>
                  </li>
            </ul>
      </div>
      <div>
            <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
                  More by author
            </h2>
      </div>
    </div>
</template>

<script setup>
// Define author
const author = {
  username: 'tim_apple',
  usernameColor: '#FF0000',
  title: 'developer',
  titleColor: '#1E1E1E',
  avatarUrl: 'https://i.imgur.com/nzY5zAg.jpg',
}

// Define social links
const socials = [
  { name: 'twitter', icon: 'https://i.imgur.com/svGJfRg.jpg', link: 'https://reddit.com' },
  { name: 'reddit', icon: 'https://i.imgur.com/svGJfRg.jpg', link: 'https://reddit.com' }
]
</script>
