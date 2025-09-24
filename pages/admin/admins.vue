<template>
    <NuxtLayout name="admin">
        <div class="flex pt-4 justify-between">
            <!-- Page Heading & Description -->
            <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">Admins</h3>
                <p class="mt-1 text-sm text-gray-600">This is where you can administrate the administration of {{ site.name
                }}.
                </p>
            </div>
            <form>
                <input type="text" name="search_term" v-model="searchTerm" class="border-gray-300 rounded px-4 py-2"
                    placeholder="Search admins..." />
            </form>
        </div>

        <div v-if="user?.adminLevel > 0"
            class="flex justify-between items-center align-middle bg-white dark:bg-gray-600 px-4 py-2 rounded">
            <p class="text-gray-700 text-sm font-semibold">You are {{ requireOwnerPerms() ? 'the owner' : `an
                admin` }} of {{
                    site?.name || 'the site'
                }}.</p>
            <div class="flex space-x-2">
                <button v-if="!requireOwnerPerms()" class="ml-auto flex items-center button red" @click="() => modalStore.setModal({
                    modal: 'ModalLeaveAdmin',
                    isOpen: true
                })">
                    Resign
                </button>
                <button v-else class="ml-auto flex items-center button red" @click="() => modalStore.setModal({
                    modal: 'ModalTransferOwnership',
                    isOpen: true
                })">
                    Transfer ownership
                </button>
                <button v-if="requireFullPerms()" @click="openAdminModal" class="ml-auto flex items-center button green">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-2" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add admin
                </button>
            </div>
        </div>

        <div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
            <!-- Header -->
            <div class="grid grid-cols-6 p-4">
                <span class="col-span-3 text-gray-500 text-sm font-medium uppercase">
                    User
                </span>
                <span class="col-span-1 text-gray-500 text-sm font-medium uppercase">
                    Permissions
                </span>
                <span v-if="requireFullPerms()" class="col-span-2 text-gray-500 text-sm font-medium uppercase text-right">
                    Actions
                </span>
            </div>
            <!-- Rows -->
            <ul v-if="members?.listMembers?.members?.length" class="flex flex-col">
                <li v-for="v in members.listMembers.members" :key="v?.id || Math.random()"
                    class="relative group grid grid-cols-6 px-4 py-2 border-b last:border-0 shadow-inner-white"
                    :class="v?.isBanned ? 'bg-red-100 hover:bg-red-200' : 'odd:bg-gray-50 hover:bg-gray-100'">
                    <NuxtLink external :to="`/@${v?.name || 'unknown'}`" target="_blank" class="col-span-3">
                        <div class="flex grow-0">
                            <div class="flex items-center pl-2 pr-6 py-1 hover:bg-gray-200 rounded-md space-x-2"
                                :class="v?.isBanned ? 'hover:bg-red-300' : 'hover:bg-gray-200'">
                                <img :src="v?.avatar || '/img/default-avatar.png'" class="w-8 h-8 rounded-sm" />
                                <p class="text-primary font-semibold">{{ v?.name || 'Unknown User' }}</p>
                            </div>
                        </div>
                    </NuxtLink>
                    <div class="col-span-1 flex items-center">
                        {{ createPermissionString(v?.adminLevel || 0) }}
                    </div>
                    <div v-if="(requireOwnerPerms() && v?.id != user?.user?.id) || (requireFullPerms() && (v?.adminLevel || 0) < (user?.adminLevel || 0))"
                        class="col-span-2 flex justify-end space-x-2">
                        <button @click="() => openManageModal(v, false)"
                            class="px-1 text-gray-500 hover:text-blue-600"
                            :title="`Edit permissions for @${v?.name || 'user'}`">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" width="40" height="40"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                <path d="M16 5l3 3" />
                            </svg>
                        </button>
                        <button @click="() => openManageModal(v, true)" class="px-1 text-gray-500 hover:text-red-600"
                            :title="`Remove @${v?.name || 'user'} as admin`">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" width="40" height="40"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M18 18h-13l-1.865 -9.327a.25 .25 0 0 1 .4 -.244l4.465 3.571l1.6 -2.4m1.596 -2.394l.804 -1.206l4 6l4.464 -3.571a.25 .25 0 0 1 .401 .244l-1.363 6.818" />
                                <path d="M3 3l18 18" />
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
                <h3 class="text-md font-semibold uppercase text-gray-500">No members...</h3>
                <p class="text-sm text-gray-400">...huh? How are you here? Get out!!!</p>
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
import { useSiteStore } from '@/stores/StoreSite';
import { useModalStore } from '@/stores/StoreModal';
import { requireFullPerms, createPermissionString, requireOwnerPerms } from '@/composables/admin';
import { useLoggedInUser } from '~~/stores/StoreAuth';
import { useGraphQLQuery } from '~/composables/useGraphQL';

const route = useRoute();
const router = useRouter();

definePageMeta({
    isFooterDisabled: true,
    isScrollDisabled: true,
    requirePermission: "users",
    title: 'Users',
    'isLeftNavbarDisabled': true
});

const authCookie = useCookie("token").value;
const toast = useToastStore();
const modalStore = useModalStore();
const user = useLoggedInUser();

// Fetch site settings
//const { data: site, pending, error, refresh } = await useAPI("/admin/site");
const site = useSiteStore();

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 10);

// Search
const searchTerm = ref(route.query.search_term || "");

// Fetch admin users using GraphQL with explicit query string
const { data: members, pending, error, refresh } = await useGraphQLQuery(`
    query ListAdminMembers($limit: Int!, $page: Int!, $search: String) {
        listMembers(limit: $limit, page: $page, search: $search) {
            members {
                id
                name
                avatar
                adminLevel
                isBanned
                creationDate
            }
            total_count
        }
    }
`, {
    variables: {
        limit: limit.value,
        page: page.value,
        search: route.query.search_term || undefined
    },
    transform: (data) => {
        // Filter to only show admin users
        if (data?.listMembers?.members) {
            return {
                ...data,
                listMembers: {
                    ...data.listMembers,
                    members: data.listMembers.members.filter(member => member?.adminLevel > 0)
                }
            };
        }
        return data;
    }
});

// Handle GraphQL errors
if (error.value) {
    throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load admin users',
        fatal: true
    });
}

const totalPages = computed(() => {
    return Math.ceil((members.value?.listMembers?.total_count || 0) / limit.value) || 1;
})

watch(
    () => route.query.page,
    async newPage => {
        await refresh();
    }
)

watch(
    () => searchTerm.value,
    async newSearch => {
        // make copy instead of reference
        const query = JSON.parse(JSON.stringify(route.query));
        query.search_term = newSearch;
        router.replace({ query });
        await refresh();
    }
)

// Open admin modal
const openAdminModal = () => {
    modalStore.setModal({
        modal: 'ModalAdmin',
        id: 0,
        isOpen: true,
        options: {
            'remove': false
        }
    });
};

// Admin modal for managing specific users
const openManageModal = (user, remove) => {
    modalStore.setModal({
        modal: 'ModalAdmin',
        id: 0,
        isOpen: true,
        options: {
            'remove': remove,
            'user': user
        }
    });
};

// Unban
/*const confirmUnban = (u) => {
    modalStore.setModal({
        modal: 'ModalBan',
        id: u.id,
        isOpen: true,
        options: {
            'is_banned': false,
            'user': u
        }
    });
}

// Ban
const confirmBan = (u) => {
    modalStore.setModal({
        modal: 'ModalBan',
        id: u.id,
        isOpen: true,
        options: {
            'is_banned': true,
            'user': u
        }
    });
}*/
</script>