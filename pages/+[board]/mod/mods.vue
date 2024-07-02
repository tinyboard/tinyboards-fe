<template>
    <NuxtLayout name="settings">
            <!-- Page Heading & Description -->
            <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">Moderators</h3>
                <p class="mt-1 text-sm text-gray-600">These individuals work tirelessly to keep +{{board.name}} clean. For free.
                </p>
            </div>

        <div v-if="isMod"
            class="flex justify-between items-center align-middle bg-white dark:bg-gray-600 px-4 py-2 rounded">
            <p class="text-gray-700 text-sm font-semibold">You are a moderator of +{{ board.name }}.</p>
            <div class="flex space-x-2">
                <button class="ml-auto flex items-center button red" @click="() => {}">
                    Resign
                </button>
                <button v-if="requireFullModPerms(modPermissions)" @click="() => {}" class="ml-auto flex items-center button green">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-2" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Invite mod
                </button>
            </div>
        </div>

        <div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
            <!-- Header -->
            <div class="grid grid-cols-6 p-4">
                <span class="col-span-2 text-gray-500 text-sm font-medium uppercase">
                    User
                </span>
                <span class="col-span-1 text-gray-500 text-sm font-medium uppercase">
                    Permissions
                </span>
                <span class="col-span-1 text-gray-500 text-sm font-medium uppercase">
                    Mod Since
                </span>
                <!--<span v-if="requireFullPerms()" class="col-span-2 text-gray-500 text-sm font-medium uppercase text-right">
                    Actions
                </span>-->
            </div>
            <!-- Rows -->
            <ul v-if="mods?.length" class="flex flex-col">
                <li v-for="modView in mods" :key="modView.moderator.id"
                    class="relative group grid grid-cols-6 px-4 py-2 border-b last:border-0 shadow-inner-white"
                    :class="modView.moderator.is_banned ? 'bg-red-100 hover:bg-red-200' : 'odd:bg-gray-50 hover:bg-gray-100'">
                    <NuxtLink external :to="`/@${modView.moderator.name}`" target="_blank" class="col-span-2">
                        <div class="flex grow-0">
                            <div class="flex items-center pl-2 pr-6 py-1 hover:bg-gray-200 rounded-md space-x-2"
                                :class="modView.moderator.is_banned ? 'hover:bg-red-300' : 'hover:bg-gray-200'">
                                <img :src="modView.moderator.avatar" class="w-8 h-8 rounded-sm" />
                                <p class="text-primary font-semibold">{{ modView.moderator.name }}</p>
                            </div>
                        </div>
                    </NuxtLink>
                    <div class="col-span-1 flex items-center">
                        {{ createModPermissionString(modView.mod_meta.permissions) }}
                    </div>
                    <div class="col-span-1 flex items-center">
                        {{ format(parseISO(modView.mod_meta.invite_accepted_date), 'yyyy MMM. dd') }}
                    </div>
                    <!--<div v-if="(requireOwnerPerms() && v.person.id != user.user.id) || (requireFullPerms() && v.person.admin_level < user.adminLevel)"
                        class="col-span-2 flex justify-end space-x-2">
                        <button @click="() => openManageModal(v.person, false)"
                            class="px-1 text-gray-500 hover:text-blue-600"
                            :title="`Edit permissions for @${v.person.name}`">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" width="40" height="40"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                <path d="M16 5l3 3" />
                            </svg>
                        </button>
                        <button @click="() => openManageModal(v.person, true)" class="px-1 text-gray-500 hover:text-red-600"
                            :title="`Remove @${v.person.name} as admin`">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" width="40" height="40"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M18 18h-13l-1.865 -9.327a.25 .25 0 0 1 .4 -.244l4.465 3.571l1.6 -2.4m1.596 -2.394l.804 -1.206l4 6l4.464 -3.571a.25 .25 0 0 1 .401 .244l-1.363 6.818" />
                                <path d="M3 3l18 18" />
                            </svg>
                        </button>
                    </div>-->
                </li>
            </ul>
            <div v-else class="bg-gray-50 text-center flex flex-col items-center p-16">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-500 w-20 h-20" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 12h6l-6 8h6"></path>
                    <path d="M14 4h6l-6 8h6"></path>
                </svg>
                <h3 class="text-md font-semibold uppercase text-gray-500">No mods? :3</h3>
                <p class="text-sm text-gray-400">You might be able to take over this board if you ask the admins very nicely.</p>
            </div>
        </div>

        <div v-if="pendingMods.length">
            <div class="pt-4">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Invited Moderators</h3>
                <p class="mt-1 text-sm text-gray-600">These users have been invited to moderate  +{{ board.name }}.
                    </p>
            </div>

            <div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
                <!-- Header -->
                <div class="grid grid-cols-6 p-4">
                    <span class="col-span-2 text-gray-500 text-sm font-medium uppercase">
                        User
                    </span>
                    <span class="col-span-1 text-gray-500 text-sm font-medium uppercase">
                        Permissions
                    </span>
                    <span class="col-span-1 text-gray-500 text-sm font-medium uppercase">
                        Invited On
                    </span>
                    <!--<span v-if="requireFullPerms()" class="col-span-2 text-gray-500 text-sm font-medium uppercase text-right">
                        Actions
                    </span>-->
                </div>
                <!-- Rows -->
                <ul class="flex flex-col">
                    <li v-for="modView in mods" :key="modView.moderator.id"
                        class="relative group grid grid-cols-6 px-4 py-2 border-b last:border-0 shadow-inner-white"
                        :class="modView.moderator.is_banned ? 'bg-red-100 hover:bg-red-200' : 'odd:bg-gray-50 hover:bg-gray-100'">
                        <NuxtLink external :to="`/@${modView.moderator.name}`" target="_blank" class="col-span-2">
                            <div class="flex grow-0">
                                <div class="flex items-center pl-2 pr-6 py-1 hover:bg-gray-200 rounded-md space-x-2"
                                    :class="modView.moderator.is_banned ? 'hover:bg-red-300' : 'hover:bg-gray-200'">
                                    <img :src="modView.moderator.avatar" class="w-8 h-8 rounded-sm" />
                                    <p class="text-primary font-semibold">{{ modView.moderator.name }}</p>
                                </div>
                            </div>
                        </NuxtLink>
                        <div class="col-span-1 flex items-center">
                            {{ createModPermissionString(modView.mod_meta.permissions) }}
                        </div>
                        <div class="col-span-1 flex items-center">
                            {{ format(parseISO(modView.mod_meta.creation_date), 'yyyy MMM. dd') }}
                        </div>
                        <!--<div v-if="(requireOwnerPerms() && v.person.id != user.user.id) || (requireFullPerms() && v.person.admin_level < user.adminLevel)"
                            class="col-span-2 flex justify-end space-x-2">
                            <button @click="() => openManageModal(v.person, false)"
                                class="px-1 text-gray-500 hover:text-blue-600"
                                :title="`Edit permissions for @${v.person.name}`">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" width="40" height="40"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                    <path d="M16 5l3 3" />
                                </svg>
                            </button>
                            <button @click="() => openManageModal(v.person, true)" class="px-1 text-gray-500 hover:text-red-600"
                                :title="`Remove @${v.person.name} as admin`">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" width="40" height="40"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M18 18h-13l-1.865 -9.327a.25 .25 0 0 1 .4 -.244l4.465 3.571l1.6 -2.4m1.596 -2.394l.804 -1.206l4 6l4.464 -3.571a.25 .25 0 0 1 .401 .244l-1.363 6.818" />
                                    <path d="M3 3l18 18" />
                                </svg>
                            </button>
                        </div>-->
                    </li>
                </ul>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { computed, ref } from 'vue';
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';
import { useSiteStore } from '@/stores/StoreSite';
import { useModalStore } from '@/stores/StoreModal';
import { useLoggedInUser } from '~~/stores/StoreAuth';
import { createModPermissionString, requireFullModPerms } from '@/composables/mod';
import { format, parseISO } from "date-fns";

import { useBoardStore } from '@/stores/StoreBoard';

const boardStore = useBoardStore();
const board = boardStore.boardView.board;
const modPermissions = boardStore.modPermissions;
const isMod = modPermissions !== null;

const route = useRoute();
const router = useRouter();

definePageMeta({
    //hasAuthRequired: true,
    alias: ['/+:board/mod/m', '/+:board/mod/mods'],
    'isLeftNavbarDisabled': true,
    //maxWidth: '5xl'
});

useHead({
    title: `Mods of +${board.name}`
});

const authCookie = useCookie("token").value;
const toast = useToastStore();
const modalStore = useModalStore();
const user = useLoggedInUser();

// Fetch users
const { data, pending, error, refresh } = await useApi(`/boards/${board.id}/mods`, {
    method: "get",
    key: `mod_fetch_${board.id}`
});

const mods = data.value.mods;
const pendingMods = data.value.pending_mods;
</script>