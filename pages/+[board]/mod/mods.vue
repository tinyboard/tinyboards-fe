<template>
    <NuxtLayout name="settings">
        <!-- Page Heading & Description -->
        <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
                Moderators
            </h3>
            <p class="mt-1 text-sm text-gray-600">
                These individuals work tirelessly to keep +{{ board.name }}
                clean. For free.
            </p>
        </div>

        <!-- Handle Invite --->
        <div
            v-if="isInvited"
            class="flex flex-col sm:flex-row text-center sm:text-left justify-between items-center align-middle bg-white dark:bg-gray-600 px-4 py-2 rounded"
        >
            <p class="text-gray-700 text-sm font-semibold">
                You are invited to become a moderator of +{{ board.name }}.
            </p>
            <div class="flex mt-2 sm:mt-0 space-x-2 w-full sm:w-auto">
                <button
                    class="ml-auto flex justify-center items-center button red w-full sm:w-auto"
                    :disabled="isLoading"
                    @click="() => resolveInvite(false)"
                >
                    Decline
                </button>
                <button
                    @click="() => resolveInvite(true)"
                    :disabled="isLoading"
                    class="ml-auto flex justify-center items-center button green w-full sm:w-auto"
                >
                    Accept invite
                </button>
            </div>
        </div>
        <div
            v-else-if="isMod"
            class="flex justify-between items-center align-middle bg-white dark:bg-gray-600 px-4 py-2 rounded"
        >
            <p class="text-gray-700 text-sm font-semibold">
                You are a moderator of +{{ board.name }}.
            </p>
            <div class="flex space-x-2">
                <button
                    class="ml-auto flex items-center button red"
                    @click="
                        () =>
                            modalStore.setModal({
                                modal: 'ModalLeaveMod',
                                isOpen: true,
                            })
                    "
                >
                    Resign
                </button>
                <button
                    v-if="requireFullModPerms(modPermissions)"
                    @click="() => setModModal(null, false)"
                    class="ml-auto flex items-center button green"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3 mr-2"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                        ></path>
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Invite mod
                </button>
            </div>
        </div>

        <div
            class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md"
        >
            <!-- Header -->
            <div class="grid grid-cols-6 p-4">
                <span
                    class="col-span-2 text-gray-500 text-sm font-medium uppercase"
                >
                    User
                </span>
                <span
                    class="col-span-1 text-gray-500 text-sm font-medium uppercase"
                >
                    Mod Since
                </span>
                <span
                    class="col-span-1 text-gray-500 text-sm font-medium uppercase"
                >
                    Permissions
                </span>
                <span
                    v-if="hasFullPermissions"
                    class="col-span-2 text-gray-500 text-sm font-medium uppercase text-right"
                >
                    Actions
                </span>
            </div>
            <!-- Rows -->
            <ul v-if="mods?.length" class="flex flex-col">
                <li
                    v-for="modView in mods"
                    :key="modView.moderator.id"
                    class="relative group grid grid-cols-6 px-4 py-2 border-b last:border-0 shadow-inner-white"
                    :class="
                        modView.moderator.is_banned
                            ? 'bg-red-100 hover:bg-red-200'
                            : 'odd:bg-gray-50 hover:bg-gray-100'
                    "
                >
                    <NuxtLink
                        external
                        :to="`/@${modView.moderator.name}`"
                        target="_blank"
                        class="col-span-2"
                    >
                        <div class="flex grow-0">
                            <div
                                class="flex items-center pl-2 pr-6 py-1 hover:bg-gray-200 rounded-md space-x-2"
                                :class="
                                    modView.moderator.is_banned
                                        ? 'hover:bg-red-300'
                                        : 'hover:bg-gray-200'
                                "
                            >
                                <img
                                    :src="modView.moderator.avatar"
                                    class="w-8 h-8 rounded-sm"
                                />
                                <p class="text-primary font-semibold">
                                    {{ modView.moderator.name }}
                                </p>
                            </div>
                        </div>
                    </NuxtLink>
                    <div class="col-span-1 flex items-center">
                        {{
                            format(
                                parseISO(modView.mod_meta.invite_accepted_date),
                                "yyyy MMM. dd",
                            )
                        }}
                    </div>
                    <div class="col-span-1 flex items-center">
                        {{
                            createModPermissionString(
                                modView.mod_meta.permissions,
                            )
                        }}
                    </div>
                    <div
                        v-if="
                            hasFullPermissions && myRank < modView.mod_meta.rank
                        "
                        class="col-span-2 flex justify-end space-x-2"
                    >
                        <button
                            @click="() => setModModal(modView, false)"
                            class="px-1 text-gray-500 hover:text-blue-600"
                            :title="`Edit permissions for @${modView.moderator.name}`"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-5 h-5"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path
                                    d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                                />
                                <path
                                    d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"
                                />
                                <path d="M16 5l3 3" />
                            </svg>
                        </button>
                        <button
                            @click="() => setModModal(modView, true)"
                            class="px-1 text-gray-500 hover:text-red-600"
                            :title="`Remove @${modView.moderator.name} as mod`"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-5 h-5"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path
                                    d="M17.67 17.667a12 12 0 0 1 -5.67 3.333a12 12 0 0 1 -8.5 -15c.794 .036 1.583 -.006 2.357 -.124m3.128 -.926a11.997 11.997 0 0 0 3.015 -1.95a12 12 0 0 0 8.5 3a12 12 0 0 1 -1.116 9.376"
                                />
                                <path d="M3 3l18 18" />
                            </svg>
                        </button>
                    </div>
                </li>
            </ul>
            <div
                v-else
                class="bg-gray-50 text-center flex flex-col items-center p-16"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="text-gray-500 w-20 h-20"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 12h6l-6 8h6"></path>
                    <path d="M14 4h6l-6 8h6"></path>
                </svg>
                <h3 class="text-md font-semibold uppercase text-gray-500">
                    No mods? :3
                </h3>
                <p class="text-sm text-gray-400">
                    You might be able to take over this board if you ask the
                    admins very nicely.
                </p>
            </div>
        </div>

        <div v-if="pendingMods.length">
            <div class="pt-4">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                    Invited Moderators
                </h3>
                <p class="mt-1 text-sm text-gray-600">
                    These users have been invited to moderate +{{ board.name }}.
                </p>
            </div>

            <div
                class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md mt-4"
            >
                <!-- Header -->
                <div class="grid grid-cols-6 p-4">
                    <span
                        class="col-span-2 text-gray-500 text-sm font-medium uppercase"
                    >
                        User
                    </span>
                    <span
                        class="col-span-1 text-gray-500 text-sm font-medium uppercase"
                    >
                        Invited On
                    </span>
                    <span
                        class="col-span-1 text-gray-500 text-sm font-medium uppercase"
                    >
                        Permissions
                    </span>
                    <span
                        v-if="hasFullPermissions"
                        class="col-span-2 text-gray-500 text-sm font-medium uppercase text-right"
                    >
                        Actions
                    </span>
                </div>
                <!-- Rows -->
                <ul class="flex flex-col">
                    <li
                        v-for="modView in pendingMods"
                        :key="modView.moderator.id"
                        class="relative group grid grid-cols-6 px-4 py-2 border-b last:border-0 shadow-inner-white"
                        :class="
                            modView.moderator.is_banned
                                ? 'bg-red-100 hover:bg-red-200'
                                : 'odd:bg-gray-50 hover:bg-gray-100'
                        "
                    >
                        <NuxtLink
                            external
                            :to="`/@${modView.moderator.name}`"
                            target="_blank"
                            class="col-span-2"
                        >
                            <div class="flex grow-0">
                                <div
                                    class="flex items-center pl-2 pr-6 py-1 hover:bg-gray-200 rounded-md space-x-2"
                                    :class="
                                        modView.moderator.is_banned
                                            ? 'hover:bg-red-300'
                                            : 'hover:bg-gray-200'
                                    "
                                >
                                    <img
                                        :src="modView.moderator.avatar"
                                        class="w-8 h-8 rounded-sm"
                                    />
                                    <p class="text-primary font-semibold">
                                        {{ modView.moderator.name }}
                                    </p>
                                </div>
                            </div>
                        </NuxtLink>
                        <div class="col-span-1 flex items-center">
                            {{
                                format(
                                    parseISO(modView.mod_meta.creation_date),
                                    "yyyy MMM. dd",
                                )
                            }}
                        </div>
                        <div class="col-span-1 flex items-center break-words">
                            {{
                                createModPermissionString(
                                    modView.mod_meta.permissions,
                                )
                            }}
                        </div>
                        <div
                            v-if="
                                hasFullPermissions &&
                                myRank < modView.mod_meta.rank
                            "
                            class="col-span-2 flex justify-end space-x-2"
                        >
                            <button
                                @click="() => setModModal(modView, false)"
                                class="px-1 text-gray-500 hover:text-blue-600"
                                :title="`Edit permissions for @${modView.moderator.name}`"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-5 h-5"
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                    />
                                    <path
                                        d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                                    />
                                    <path
                                        d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"
                                    />
                                    <path d="M16 5l3 3" />
                                </svg>
                            </button>
                            <button
                                @click="() => setModModal(modView, true)"
                                class="px-1 text-gray-500 hover:text-red-600"
                                :title="`Revoke mod invite to @${modView.moderator.name}`"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-5 h-5"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                    />
                                    <path d="M10 14l2 -2m2 -2l7 -7" />
                                    <path
                                        d="M10.718 6.713l10.282 -3.713l-3.715 10.289m-1.063 2.941l-1.722 4.77a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l4.772 -1.723"
                                    />
                                    <path d="M3 3l18 18" />
                                </svg>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { computed, ref } from "vue";
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
import { useToastStore } from "@/stores/StoreToast";
import { useSiteStore } from "@/stores/StoreSite";
import { useModalStore } from "@/stores/StoreModal";
import { useLoggedInUser } from "~~/stores/StoreAuth";
import {
    createModPermissionString,
    requireFullModPerms,
} from "@/composables/mod";
import { format, parseISO } from "date-fns";

import { useBoardStore } from "@/stores/StoreBoard";

const boardStore = useBoardStore();
const board = boardStore.boardView.board;
const modPermissions = boardStore.modPermissions;
const isMod = modPermissions !== null;
const hasFullPermissions = isMod && requireFullModPerms(modPermissions);

const route = useRoute();
const router = useRouter();

definePageMeta({
    //hasAuthRequired: true,
    alias: ["/+:board/mod/m", "/+:board/mod/mods"],
    isLeftNavbarDisabled: true,
    //maxWidth: '5xl'
});

useHead({
    title: `Mods of +${board.name}`,
});

const authCookie = useCookie("token").value;
const toast = useToastStore();
const modalStore = useModalStore();
const userStore = useLoggedInUser();
const user = userStore.user;

// For resolving invite
const isLoading = ref(false);

// Fetch users
const { data, pending, error, refresh } = await useApi(
    `/boards/${board.id}/mods`,
    {
        method: "get",
        key: `mod_fetch_${board.id}`,
    },
);

const mods = data.value.mods;
const pendingMods = data.value.pending_mods;
const isInvited = data.value.has_pending_invite;
const myRank = data.value.my_mod_rank;

function setModModal(modView = null, isRemoving = false) {
    const options = {
        isRemoving,
    };

    if (modView !== null) {
        options["user"] = modView.moderator;
        options["modPerms"] = modView.mod_meta.permissions;
        options["hasAcceptedInvite"] = modView.mod_meta.invite_accepted;
    }

    modalStore.setModal({
        modal: "ModalMod",
        id: 0,
        isOpen: true,
        options,
    });
}

async function resolveInvite(accept) {
    isLoading.value = true;
    const { data, error } = await useApi(
        accept
            ? `/boards/${board.id}/mods`
            : `/boards/${board.id}/mods/${user.id}`,
        {
            body: {},
            method: accept ? "POST" : "DELETE",
        },
    );

    if (data.value) {
        window.location.reload(true);
    } else {
        console.error(JSON.stringify(error.value, null, 4));
    }

    isLoading.value = false;
}
</script>
