<template>
    <div class="w-[280px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base">
          <div>
            <NuxtLink to="/submit" class="button primary flex items-center w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 mr-2">
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
              </svg>
              <span>New post</span>
            </NuxtLink>
          </div>
          <div>
                <h2 class="font-medium leading-5 text-base mb-3 pb-2 border-b-2">
                      About
                </h2>
                <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
          </div>
          <div>
                <h2 class="font-medium leading-5 text-base mb-3 pb-2 border-b-2">
                      Spotlight
                </h2>
                <ul class="flex flex-col space-y-2 divide-y">
                      <li v-for="user in spotlight" :key="user.id" class="flex space-x-2 pt-2 first:pt-0">
                            <img class="p-[3px] w-9 h-9 object-cover bg-white border" :src="user.avatarUrl"/>
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
          <div>
                <h2 class="font-medium leading-5 text-base mb-3 pb-2 border-b-2">
                      Community Artwork
                </h2>
                <img class="p-1 w-full h-56 aspect-auto object-cover bg-white border" src="https://i.imgur.com/x0I5K0N.gif"/>
                <small class="text-gray-400 block mt-0.5">
                      Art submission by Elon
                </small>
          </div>
    </div>
</template>

<script setup>
// Define sub-navigation menu links
const spotlight = [
      { id: 1, username: 'elon', avatarUrl: 'https://i.imgur.com/svGJfRg.jpg', reputation: 980 },
      { id: 2, username: 'wojak', avatarUrl: 'https://i.imgur.com/BbOe1X6.jpg', reputation: 490 },
]
</script>
