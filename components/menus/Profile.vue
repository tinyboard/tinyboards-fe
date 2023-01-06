<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="flex items-center p-1 text-gray-900 font-bold rounded-sm focus:outline-none">
        <!-- Username -->
        <div class="flex items-center space-x-1 mr-2">
          <p class="text-base text-white">
            <strong>{{ user.name }}</strong>
          </p>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="white" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M6 10l6 6l6 -6h-12"></path>
          </svg>
        </div>
        <!-- User Avatar -->
        <img class="w-9 h-9 object-cover rounded-sm rounded-none p-0.5 border border-black/10 bg-black/10" :src="user.avatar" alt="user avatar"/>
      </MenuButton>
    </div>

    <transition
    enter-active-class="transition ease-[cubic-bezier(.2,0,0,1.3)]"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition ease-[cubic-bezier(.2,0,0,1.3)]"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems class="absolute right-0 w-64 mt-4 origin-top-right bg-white divide-y divide-gray-100 rounded shadow-lg border focus:outline-none">
        <!-- User Details -->
        <MenuItem v-slot="{ active, close }">
          <NuxtLink :to="`/user/${user.name}`" class="flex items-center p-4" @click="close">
            <!-- User Avatar -->
            <img class="w-9 h-9 object-cover rounded-sm rounded-none p-0.5 border bg-white hover:bg-gray-200" :src="user.avatar" alt="user avatar"/>
            <div class="pl-2 truncate">
              <!-- Username -->
              <p class="text-sm text-gray-900 leading-normal">
                <strong>{{ user.name }}</strong>
                <span v-if="user.is_admin" class="ml-1 badge badge-blue">Admin</span>
              </p>
              <!-- User Reputation -->
              <div class="flex items-center text-xs">
                <span class="text-yellow-500">&#9733;&nbsp;</span>
                <span class="text-gray-600">
                  {{ counts.rep ?? 0 }} reputation
                </span>
              </div>
            </div>
          </NuxtLink>
        </MenuItem>
        <div class="py-2 text-sm">
          <!-- Profile Link -->
          <MenuItem v-slot="{ active, close }">
            <NuxtLink :to="`/user/${user.name}`" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700','group flex items-center w-full px-4 py-1.5']" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                 <circle cx="12" cy="7" r="4"></circle>
                 <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
              </svg>
              <span>My Profile</span>
            </NuxtLink>
          </MenuItem>
          <!-- Inbox Link -->
          <MenuItem v-slot="{ active, close }">
            <NuxtLink to="/inbox" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700','group flex items-center w-full px-4 py-1.5']" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                 <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                 <polyline points="3 7 12 13 21 7"></polyline>
              </svg>
              Inbox
              <span v-if="unread > 0" class="pl-1 text-primary">{{ unread }}</span>
            </NuxtLink>
          </MenuItem>
          <!-- Posts Link -->
          <MenuItem v-slot="{ active, close }">
            <NuxtLink :to="`/user/${user.name}/posts`" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700','group flex items-center w-full px-4 py-1.5']" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                 <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                 <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
              </svg>
              <span>Posts</span>
            </NuxtLink>
          </MenuItem>
          <MenuItem v-slot="{ active, close }">
            <NuxtLink to="/settings/profile" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700','group flex items-center w-full px-4 py-1.5']" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                 <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                 <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>Settings</span>
            </NuxtLink>
          </MenuItem>
        </div>
        <div class="py-2 text-sm">
          <!-- Sign Out -->
          <MenuItem v-slot="{ active, close }">
            <button @click="logout(); close()" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700','group flex items-center w-full px-4 py-1.5']">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                 <path d="M13 12v.01"></path>
                 <path d="M3 21h18"></path>
                 <path d="M5 21v-16a2 2 0 0 1 2 -2h7.5m2.5 10.5v7.5"></path>
                 <path d="M14 7h7m-3 -3l3 3l-3 3"></path>
              </svg>
              <span>Sign Out</span>
            </button>
          </MenuItem>
        </div>
        <div class="py-2">
          <ul class="flex flex-wrap justify-around mb-0 px-3 leading-4">
            <li v-for="link in links" class="px-1 py-0.5">
              <NuxtLink :to="link.href" class="text-xs text-gray-500 hover:underline">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
  import { useLoggedInUser } from '@/stores/StoreAuth';
  import Cookies from 'js-cookie';

  const userStore = useLoggedInUser();
  const router = useRouter();

  const props = defineProps({
    user: Object,
    counts: Object,
    unread: {
      type: Number,
      default: 0
    }
  });
  
  const logout = () => {
    Cookies.remove('token');
    userStore.logout();
    router.go({path: '/feed'});
  };

  const links = [
  { name: 'About', href: '/help/about' },
  { name: 'House Rules', href: '/help/rules' },
  { name: 'Terms', href: '/help/terms' },
  { name: 'Privacy', href: '/help/privacy' },
  ];
</script>
