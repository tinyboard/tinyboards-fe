<template>
  <div id="sidebar-profile"
    class="w-[290px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base"
  >
    <div :class="{ 'bg-white rounded border border-gray-200 p-4': (imageStore.background || u.profile_background) }">
        <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
            About
            <span class="text-gray-700 text-opacity-70">@{{ u.name }}</span>
        </h2>
        <div class="text-gray-600 mt-4">
            <svg  xmlns="http://www.w3.org/2000/svg" class="inline-block w-6 h-6"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20h18v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8z" /><path d="M3 14.803c.312 .135 .654 .204 1 .197a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35 .007 .692 -.062 1 -.197" /><path d="M12 4l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737z" /></svg>
            Registered <span class="text-gray-900">{{ format(parseISO(u.creation_date), 'yyyy MMM. dd') }}</span>
        </div>
        <div v-if="u.is_admin" class="text-red-600 mt-4">
            <svg  xmlns="http://www.w3.org/2000/svg" class="inline-block w-6 h-6"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" /></svg>
            Permissions: <span class="font-semibold">{{ createPermissionString(u.admin_level) }}</span>
        </div>
    </div>
    <!-- Admin Actions -->
    <div v-if="isAdmin && !isSelf" :class="{ 'bg-white rounded border border-gray-200 p-4': (imageStore.background || u.profile_background) }">
        <h2 class="font-bold leading-5 text-base pb-1 border-b">
            <span>Admin Tools</span>
        </h2>
        <ul class="flex flex-col space-y-2 mt-4">
          <li v-if="requireFullPerms() && u.is_admin">
            <button class="flex items-center button white w-full" @click="() => confirmAdmin(false)">
                    <svg  xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                    <span>Edit admin permissions</span>
                </button>
          </li>
          <li v-if="requireFullPerms()">
                <button class="flex items-center button w-full" :class="[u.is_admin ? 'red' : 'yellow']" @click="() => confirmAdmin(u.is_admin)">
                    <svg  xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" /></svg>
                    <span>{{ u.is_admin ? `Remove @${u.name} as admin` : `Make ${u.name} admin` }}</span>
                </button>
            </li>
            <li v-if="!u.is_admin && !u.is_banned">
                <button class="flex items-center button red w-full" @click="confirmBan">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385"></path>
                        <path d="M6 9l4 4"></path>
                        <path d="M13 10l-4 -4"></path>
                        <path d="M3 21h7"></path>
                        <path d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z"></path>
                    </svg>
                    <span>Ban @{{ u.name }}</span>
                </button>
            </li>
        </ul>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { format, parseISO } from "date-fns";
  import { useSiteStore } from "@/stores/StoreSite";
  import { useImageStore } from '@/stores/StoreImages';
  import { requirePermission, requireFullPerms, createPermissionString } from "@/composables/admin";
  import { useLoggedInUser } from "@/stores/StoreAuth";
  import { useModalStore } from '@/stores/StoreModal';

  const modalStore = useModalStore();
  const userStore = useLoggedInUser();
  const site = useSiteStore();
  const imageStore = useImageStore();

  const isAdmin = requirePermission("users");
  const hasFullPerms = requireFullPerms();

  const props = defineProps({
    u: {
      type: Object,
      required: true
    }
  });

  // Is Self
  const isSelf = computed(() => {
    return !!userStore.user && userStore.user.name === props.u.name
  });

  // Confirm Admin
  const confirmAdmin = (remove) => {
    modalStore.setModal({
      modal: 'ModalAdmin',
      id: 0,
      isOpen: true,
      options: {
        'is_admin': props.u.is_admin,
        'user': props.u,
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
        'is_banned': props.u.is_banned,
        'user': props.u
      }
    });
  };
</script>