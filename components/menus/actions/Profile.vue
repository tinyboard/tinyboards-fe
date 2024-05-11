<template>
  <Menu as="div" class="relative z-20">
    <div>
      <MenuButton :class="buttonClass ? buttonClass : 'button button-sm white'">
        <slot name="button">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <circle cx="5" cy="12" r="1"></circle>
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
          </svg>
        </slot>
      </MenuButton>
    </div>
    <transition leave-active-class="transition ease-[cubic-bezier(.2,0,0,1.3)]"
      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
      <MenuItems
        class="absolute w-48 max-h-72 mt-1 bg-white divide-y divide-gray-100 rounded-md shadow-xl border focus:outline-none"
        :class="isLeft ? 'right-0 origin-top-right' : 'left-0 origin-top-left'">
        <!-- Profile Actions -->
        <div v-if="isSelf" class="py-2 text-sm">
          <MenuItem disabled v-slot="{ active, close }">
          <NuxtLink to="/settings/profile" @click="close()" class="group flex items-center w-full px-4 py-1.5"
            :class="active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
              <path d="M16 5l3 3"></path>
            </svg>
            <span>Edit Profile</span>
          </NuxtLink>
          </MenuItem>
        </div>
        <!-- User Actions -->
        <div v-if="!isSelf" class="py-2 text-sm">
          <MenuItem disabled v-slot="{ active, close }">
          <button @click="close()" class="group flex items-center w-full px-4 py-1.5"
            :class="active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
              <path d="M17 9l4 4m0 -4l-4 4"></path>
            </svg>
            <span>Block @{{ user.name }}</span>
          </button>
          </MenuItem>
        </div>
        <!-- Mod Actions -->
        <div v-if="isAdmin && !isSelf" class="py-2 text-sm">
          <!-- Manage Admin -->
          <MenuItem v-if="requireFullPerms()" v-slot="{ active, close }">
          <button @click="confirmAdmin(user.is_admin); close()" class="group flex items-center w-full px-4 py-1.5"
            :class="active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'">
            <!-- Sheild Slash Icon -->
            <svg v-if="user.is_admin" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24"
              stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="3" y1="3" x2="21" y2="21"></line>
              <path
                d="M17.669 17.669a12 12 0 0 1 -5.669 3.331a12 12 0 0 1 -8.5 -15c.797 .036 1.589 0 2.366 -.126m3.092 -.912a12 12 0 0 0 3.042 -1.962a12 12 0 0 0 8.5 3a12 12 0 0 1 -1.117 9.379">
              </path>
            </svg>
            <!-- Shield Icon -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"></path>
            </svg>
            <span>{{ user.is_admin ? 'Remove' : 'Make' }} admin</span>
          </button>
          </MenuItem>
          <MenuItem v-if="requireFullPerms() && user.is_admin" v-slot="{ active, close }">
          <button @click="confirmAdmin(false); close()" class="group flex items-center w-full px-4 py-1.5"
            :class="active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'">
            <!-- Shield Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"></path>
            </svg>
            <span>Edit admin permissions</span>
          </button>
          </MenuItem>
          <!-- Ban/Unban -->
          <MenuItem :disabled="user.is_admin" v-slot="{ close }">
          <button @click="confirmBan(); close()" class="group flex items-center w-full px-4 py-1.5"
            :class="user.is_banned ? ' text-green-500 hover:text-green-700 hover:bg-gray-100' : ' text-red-500 hover:text-red-700 hover:bg-gray-100'">
            <!-- User Slash Icon -->
            <svg v-if="user.is_banned" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24"
              stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
              <path d="M16 11l2 2l4 -4"></path>
            </svg>
            <!-- User Check Icon -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M14.274 10.291a4 4 0 1 0 -5.554 -5.58m-.548 3.453a4.01 4.01 0 0 0 2.62 2.65"></path>
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 1.147 .167m2.685 2.681a4 4 0 0 1 .168 1.152v2"></path>
              <line x1="3" y1="3" x2="21" y2="21"></line>
            </svg>
            <span>{{ user.is_banned ? 'Unban' : 'Ban' }} @{{ user.name }}</span>
          </button>
          </MenuItem>
          <!-- Purge Content -->
          <MenuItem :disabled="user.is_admin" v-slot="{ active, close }">
          <button @click="confirmPurge(); close()" class="group flex items-center w-full px-4 py-1.5"
            :class="active ? 'bg-gray-100 text-red-700' : 'text-red-500 hover:text-red-700'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3">
              </path>
              <path d="M18 13.3l-6.3 -6.3"></path>
            </svg>
            <span>Purge @{{ user.name }}</span>
          </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { useModalStore } from '@/stores/StoreModal';
import { requireFullPerms } from '@/composables/admin';

const modalStore = useModalStore();

const props = defineProps({
  isLeft: {
    type: Boolean
  },
  buttonClass: {
    type: String
  },
  user: {
    type: Object,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  isSelf: {
    type: Boolean,
    required: true
  }
});

// Confirm Admin
const confirmAdmin = (remove) => {
  modalStore.setModal({
    modal: 'ModalAdmin',
    id: 0,
    isOpen: true,
    options: {
      'is_admin': props.user.is_admin,
      'user': props.user,
      'remove': remove
    }
  });
};

// Ban & Unban
const confirmBan = () => {
  modalStore.setModal({
    modal: 'ModalBan',
    id: 0,
    isOpen: true,
    options: {
      'is_banned': props.user.is_banned,
      'user': props.user
    }
  });
};

// Purge
const confirmPurge = () => {
  modalStore.setModal({
    modal: 'ModalPurge',
    username: props.user.name,
    isOpen: true,
    contentType: 'user',
    options: {
      'user': props.user
    }
  });
};
</script>