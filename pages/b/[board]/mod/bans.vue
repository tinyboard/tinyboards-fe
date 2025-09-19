<template>
    <NuxtLayout name="settings">
        <div class="flex pt-4">
            <!-- Page Heading & Description -->
            <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">Banned users</h3>
                <p class="mt-1 text-sm text-gray-600">These people have been banned from +{{ board.name }}.</p>
            </div>
            <button class="ml-auto flex items-center button red" @click="openBanModal">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" width="40" height="40" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M8.18 8.189a4.01 4.01 0 0 0 2.616 2.627m3.507 -.545a4 4 0 1 0 -5.59 -5.552" />
                    <path
                        d="M6 21v-2a4 4 0 0 1 4 -4h4c.412 0 .81 .062 1.183 .178m2.633 2.618c.12 .38 .184 .785 .184 1.204v2" />
                    <path d="M3 3l18 18" />
                </svg>
                Ban user
            </button>
        </div>

        <div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
            <!-- Header -->
            <div class="grid grid-cols-6 p-4">
                <span class="col-span-3 text-gray-500 text-sm font-medium uppercase">
                    User
                </span>
                <span class="col-span-1 text-gray-500 text-sm font-medium uppercase">
                    Ban Expires
                </span>
                <span class="col-span-2 text-gray-500 text-sm font-medium uppercase text-right">
                    Options
                </span>
            </div>
            <!-- Rows -->
            <ul v-if="bans?.getBoardBannedUsers?.bans?.length" class="flex flex-col">
                <li v-for="ban in bans.getBoardBannedUsers.bans" :key="ban.id"
                    class="relative group grid grid-cols-6 px-4 py-2 odd:bg-gray-50 hover:bg-gray-100 border-b last:border-0 shadow-inner-white">
                    <NuxtLink external :to="`/@${ban.user.name}`" target="_blank" class="col-span-3">
                        <div class="flex grow-0">
                            <div class="flex items-center pl-2 pr-6 py-1 hover:bg-gray-200 rounded-md space-x-2">
                                <img :src="ban.user.avatar" class="w-8 h-8 rounded-sm" />
                                <p class="text-primary font-semibold">{{ ban.user.name }}</p>
                            </div>
                        </div>
                    </NuxtLink>
                    <div class="col-span-1 flex items-center">
                        {{ ban.expires ? `in ${daysUntilUnban(ban)} day(s)` : "never" }}
                    </div>
                    <div class="col-span-2 flex justify-end">
                        <button @click="() => confirmUnban(ban.user)" class="px-1 text-gray-500 hover:text-green-600"
                            :title="`Unban @${ban.user.name}`">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" width="40" height="40"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
                                <path d="M15 19l2 2l4 -4"></path>
                            </svg>
                        </button>
                    </div>
                </li>
            </ul>
            <div v-else class="bg-gray-50 text-center flex flex-col items-center p-16">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-500 w-20 h-20" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 12h6l-6 8h6"></path>
                    <path d="M14 4h6l-6 8h6"></path>
                </svg>
                <h3 class="text-md font-semibold uppercase text-gray-500">No banned users...</h3>
                <p class="text-sm text-gray-400">...yet! >:)</p>
            </div>
        </div>
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="col-span-full mb-4 px-2.5 sm:px-4">
            <NavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
        </div>
    </NuxtLayout>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useModalStore } from '@/stores/StoreModal';
import { useBoardStore } from '@/stores/StoreBoard';

const route = useRoute();
const boardStore = useBoardStore();
const board = boardStore.board;

definePageMeta({
    hasAuthRequired: true,
    alias: ['/+:board/mod/banned', '/+:board/mod/b'],
    isLeftNavbarDisabled: true,
    permissionRequired: "users",
});

useHead({
    title: `Banned Users - +${board.name}`
});

const authCookie = useCookie("token").value;
const toast = useToastStore();
const modalStore = useModalStore();

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 10);

// Fetch banned users for this board using GraphQL
const { data: bans, pending, error, refresh } = await useAsyncGql({
    operation: 'getBoardBannedUsers',
    variables: {
        boardId: board.id,
        limit: limit.value,
        page: page.value
    }
});

const totalPages = computed(() => {
    return Math.ceil((bans.value?.getBoardBannedUsers?.totalCount || 0) / limit.value) || 1;
})

const daysUntilUnban = (ban) => {
    if (ban.expires) {
        const date = new Date(ban.expires);
        return Math.ceil((Math.floor(date.getTime() / 1000) - Math.floor(Date.now() / 1000)) / (60 * 60 * 24));
    } else {
        return null;
    }
}

// ban modal
const openBanModal = () => {
    modalStore.setModal({
        modal: 'ModalBan',
        id: 0,
        isOpen: true,
        options: {
            'unban': false,
            'boardId': board.id
        }
    });
};

// Unban
const confirmUnban = (user) => {
    modalStore.setModal({
        modal: 'ModalBan',
        id: user.id,
        isOpen: true,
        options: {
            'unban': true,
            'user': user,
            'boardId': board.id
        }
    });
}
</script>