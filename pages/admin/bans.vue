<template>
    <NuxtLayout name="admin">
        <div class="flex pt-4 px-4">
            <!-- Page Heading & Description -->
            <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">Banned users</h3>
                <p class="mt-1 text-sm text-gray-600">These people have been banished from {{ site.name }}. They probably
                    deserved it.</p>
            </div>
            <!--<button v-if="site.site_mode === 'InviteMode'" @click="createInvite"
				class="ml-auto flex items-center button green">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-2" viewBox="0 0 24 24" stroke-width="2"
					stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				Create invite
			</button>-->
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
            <ul v-if="bans?.persons.length" class="flex flex-col">
                <li v-for="v in bans.persons" :key="v.person.id"
                    class="relative group grid grid-cols-6 px-4 py-2 odd:bg-gray-50 hover:bg-gray-100 border-b last:border-0 shadow-inner-white">
                    <NuxtLink external :to="`/@${v.person.name}`" target="_blank" class="col-span-3">
                        <div class="flex grow-0">
                            <div class="flex items-center pl-2 pr-6 py-1 hover:bg-gray-200 rounded-md space-x-2">
                                <img :src="v.person.avatar" class="w-8 h-8 rounded-sm" />
                                <p class="text-primary font-semibold">{{ v.person.name }}</p>
                            </div>
                        </div>
                    </NuxtLink>
                    <div class="col-span-1 flex items-center">
                        {{ v.person.unban_date ? `in ${daysUntilUnban(v.person)} day(s)` : "never" }}
                    </div>
                    <div class="col-span-2 flex justify-end">
                        <button @click="() => confirmUnban(v.person)" class="px-1 text-gray-500 hover:text-green-600"
                            :title="`Unban @${v.person.name}`">
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
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';
import { useSiteStore } from '@/stores/StoreSite';
import { useModalStore } from '@/stores/StoreModal';

const route = useRoute();

definePageMeta({
    isFooterDisabled: true,
    isScrollDisabled: true
});

const authCookie = useCookie("token").value;
const toast = useToastStore();
const modalStore = useModalStore();

// Fetch site settings
//const { data: site, pending, error, refresh } = await useApi("/admin/site_settings");
const site = useSiteStore();

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 10);

// Fetch invites
const { data: bans, pendingInvites, errorInvites, refresh: refreshInvites } = await useApi("/admin/list_bans", {
    query: {
        limit: limit.value,
        page: page.value
    },
    method: "get",
});

const totalPages = computed(() => {
    return (bans.value.total_count / limit.value) || 1;
})

// Create invite
const isLoading = ref(false);

const daysUntilUnban = (u) => {
    if (u.unban_date) {
        const date = new Date(u.unban_date);

        return Math.ceil((Math.floor(date.getTime() / 1000) - Math.floor(Date.now() / 1000)) / (60 * 60 * 24));
    } else {
        return null;
    }
}

// Unban
const confirmUnban = (u) => {
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

/*const createInvite = () => {
    isLoading.value = true;
    useApi('/admin/invite', {
        method: "post",
        body: {},
    })
        .then(({ data, error }) => {
            if (data.value) {
                // Refetch invites.
                refreshInvites();
                // Show success toast.
                toast.addNotification({ header: 'Invite created', message: 'A fresh invite code was created!', type: 'success' });
            } else {
                // Show error toast.
                toast.addNotification({ header: 'Failed creating invite', message: 'Please try again.', type: 'error' });
                // Log the error.
                console.error(error.value);
            }
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const deleteInvite = (invite) => {
    isLoading.value = true;
    useApi(`/admin/invite/${invite}`, {
        method: "delete",
        body: {}
    })
        .then(({ data, error }) => {
            if (!error.value) {
                // Show success toast.
                toast.addNotification({ header: 'Invite deleted', message: 'The invite code was deleted.', type: 'success' });
            } else {
                // Show error toast.
                toast.addNotification({ header: 'Failed deleting invite', message: 'Please try again.', type: 'error' });
                // Log the error.
                console.error(error.value);
            }
        })
        .finally(() => {
            isLoading.value = false;
        });
};*/
</script>