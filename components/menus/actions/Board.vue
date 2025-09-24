<template>
    <Menu as="div" class="relative z-20">
        <div>
            <MenuButton class="button gray flex items-center">
                <slot name="button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                        <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    </svg>
                </slot>
            </MenuButton>
        </div>
        <transition
            leave-active-class="transition ease-[cubic-bezier(.2,0,0,1.3)]"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <MenuItems
                class="absolute w-80 sm:w-56 max-h-72 mt-1 bg-white divide-y divide-gray-100 rounded-md shadow-xl border focus:outline-none right-0 origin-top-right"
            >
                <!-- Board Actions -->
                <div class="py-2 text-md sm:text-sm">
                    <MenuItem disabled v-slot="{ active, close }">
                        <button
                            @click="close()"
                            class="group flex items-center w-full px-4 py-1.5"
                            :class="
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700'
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4 mr-2"
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
                                <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16" />
                            </svg>
                            <span>Report +{{ board.name }}</span>
                        </button>
                    </MenuItem>
                    <MenuItem disabled v-slot="{ active, close }">
                        <button
                            @click="close()"
                            class="group flex items-center w-full px-4 py-1.5"
                            :class="
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700'
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4 mr-2"
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
                                    d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
                                />
                                <path d="M5.7 5.7l12.6 12.6" />
                            </svg>
                            <span>Block +{{ board.name }}</span>
                        </button>
                    </MenuItem>
                </div>
                <!-- Mod Actions -->
                <div v-if="isAdmin" class="py-2 text-md sm:text-sm border-t">
                    <!-- Add Self as Moderator -->
                    <MenuItem v-if="!isMod" v-slot="{ active, close }">
                        <button
                            @click="addSelfAsMod(); close()"
                            :disabled="isLoading"
                            class="group flex items-center w-full px-4 py-1.5"
                            :class="
                                active
                                    ? 'bg-green-100 text-green-900'
                                    : 'text-green-700'
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4 mr-2"
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
                                    d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"
                                />
                            </svg>
                            <span>{{ isLoading ? 'Adding...' : 'Mod Self' }}</span>
                        </button>
                    </MenuItem>
                    <!-- Remove Self as Moderator -->
                    <MenuItem v-if="isMod" v-slot="{ active, close }">
                        <button
                            @click="removeSelfAsMod(); close()"
                            :disabled="isLoading"
                            class="group flex items-center w-full px-4 py-1.5"
                            :class="
                                active
                                    ? 'bg-orange-100 text-orange-900'
                                    : 'text-orange-700'
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4 mr-2"
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
                                <path d="M3 12h18m-9 -9l9 9l-9 9" />
                            </svg>
                            <span>{{ isLoading ? 'Removing...' : 'Unmod Self' }}</span>
                        </button>
                    </MenuItem>
                    <!-- Ban/Unban Board -->
                    <MenuItem v-slot="{ active, close }">
                        <button
                            @click="board.is_banned ? unbanBoard() : banBoard(); close()"
                            :disabled="isLoading"
                            class="group flex items-center w-full px-4 py-1.5"
                            :class="
                                active
                                    ? 'bg-red-100 text-red-900'
                                    : 'text-red-700'
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4 mr-2"
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
                                    d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385"
                                />
                                <path d="M6 9l4 4" />
                                <path d="M13 10l-4 -4" />
                                <path d="M3 21h7" />
                                <path
                                    d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z"
                                />
                            </svg>
                            <span v-if="isLoading">{{ board.is_banned ? 'Unbanning...' : 'Banning...' }}</span>
                            <span v-else>{{ board.is_banned ? 'Unban' : 'Ban' }} +{{ board.name }}</span>
                        </button>
                    </MenuItem>
                    <!-- Hide/Show from All Feed -->
                    <MenuItem v-slot="{ active, close }">
                        <button
                            @click="toggleBoardFromAll(); close()"
                            :disabled="isLoading"
                            class="group flex items-center w-full px-4 py-1.5"
                            :class="
                                active
                                    ? 'bg-yellow-100 text-yellow-900'
                                    : 'text-yellow-700'
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4 mr-2"
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
                                    d="M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7"
                                />
                                <path d="M10 10l.01 0" />
                                <path d="M14 10l.01 0" />
                                <path d="M10 14a3.5 3.5 0 0 0 4 0" />
                            </svg>
                            <span v-if="isLoading">{{ board.exclude_from_all ? 'Showing in feeds...' : 'Hiding from feeds...' }}</span>
                            <span v-else>{{ board.exclude_from_all ? 'Show in Feeds' : 'Hide from Feeds' }}</span>
                        </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { useModalStore } from "@/stores/StoreModal";
import { useBoardStore } from "@/stores/StoreBoard";
import { useToastStore } from "@/stores/StoreToast";
import { requirePermission } from "@/composables/admin";
import { useGraphQLMutation } from "@/composables/useGraphQL";

const modalStore = useModalStore();
const boardStore = useBoardStore();
const toast = useToastStore();
const board = boardStore.board;
const isMod = board.myModPermissions !== 0;
const isAdmin = requirePermission("boards");
const isLoading = ref(false);

// Use the runtime GraphQL composable

// Methods
const addSelfAsMod = async () => {
    if (isLoading.value) return;
    
    try {
        isLoading.value = true;
        const mutation = `
          mutation AdminAddSelfAsMod($boardId: Int!) {
            adminAddSelfAsMod(boardId: $boardId) {
              id
              name
              myModPermissions
            }
          }
        `;

        const result = await useGraphQLMutation(mutation, {
          variables: {
            boardId: board.id
          }
        });

        if (result.data.value?.adminAddSelfAsMod) {
            // Update local board store
            boardStore.updateBoard(result.data.value.adminAddSelfAsMod);
            toast.addNotification({
                header: 'Success',
                message: `You are now a moderator of +${board.name}`,
                type: 'success'
            });
        }
    } catch (error) {
        console.error('Error adding self as mod:', error);
        toast.addNotification({
            header: 'Error',
            message: 'Failed to add yourself as moderator',
            type: 'error'
        });
    } finally {
        isLoading.value = false;
    }
};

const removeSelfAsMod = async () => {
    if (isLoading.value) return;
    
    try {
        isLoading.value = true;
        const mutation = `
          mutation AdminRemoveSelfAsMod($boardId: Int!) {
            adminRemoveSelfAsMod(boardId: $boardId) {
              id
              name
              myModPermissions
            }
          }
        `;

        const result = await useGraphQLMutation(mutation, {
          variables: {
            boardId: board.id
          }
        });

        if (result.data.value?.adminRemoveSelfAsMod) {
            // Update local board store
            boardStore.updateBoard(result.data.value.adminRemoveSelfAsMod);
            toast.addNotification({
                header: 'Success',
                message: `You are no longer a moderator of +${board.name}`,
                type: 'success'
            });
        }
    } catch (error) {
        console.error('Error removing self as mod:', error);
        toast.addNotification({
            header: 'Error',
            message: 'Failed to remove yourself as moderator',
            type: 'error'
        });
    } finally {
        isLoading.value = false;
    }
};

const banBoard = async () => {
    if (isLoading.value) return;
    
    const publicReason = prompt('Enter public reason for banning this board:');
    if (!publicReason) return;
    
    const adminNotes = prompt('Enter admin notes (optional):');
    
    try {
        isLoading.value = true;
        const mutation = `
          mutation AdminBanBoard($boardId: Int!, $publicReason: String!, $adminNotes: String) {
            adminBanBoard(boardId: $boardId, publicReason: $publicReason, adminNotes: $adminNotes) {
              id
              name
              isBanned
            }
          }
        `;

        const result = await useGraphQLMutation(mutation, {
          variables: {
            boardId: board.id,
            publicReason: publicReason,
            adminNotes: adminNotes || null
          }
        });

        if (result.data.value?.adminBanBoard) {
            // Update local board store
            boardStore.updateBoard(result.data.value.adminBanBoard);
            toast.addNotification({
                header: 'Board Banned',
                message: `+${board.name} has been banned`,
                type: 'success'
            });
        }
    } catch (error) {
        console.error('Error banning board:', error);
        toast.addNotification({
            header: 'Error',
            message: 'Failed to ban board',
            type: 'error'
        });
    } finally {
        isLoading.value = false;
    }
};

const unbanBoard = async () => {
    if (isLoading.value) return;
    
    if (!confirm(`Are you sure you want to unban +${board.name}?`)) {
        return;
    }
    
    try {
        isLoading.value = true;
        const mutation = `
          mutation AdminUnbanBoard($boardId: Int!) {
            adminUnbanBoard(boardId: $boardId) {
              id
              name
              isBanned
            }
          }
        `;

        const result = await useGraphQLMutation(mutation, {
          variables: {
            boardId: board.id
          }
        });

        if (result.data.value?.adminUnbanBoard) {
            // Update local board store
            boardStore.updateBoard(result.data.value.adminUnbanBoard);
            toast.addNotification({
                header: 'Board Unbanned',
                message: `+${board.name} has been unbanned`,
                type: 'success'
            });
        }
    } catch (error) {
        console.error('Error unbanning board:', error);
        toast.addNotification({
            header: 'Error',
            message: 'Failed to unban board',
            type: 'error'
        });
    } finally {
        isLoading.value = false;
    }
};

const toggleBoardFromAll = async () => {
    if (isLoading.value) return;
    
    const exclude = !board.exclude_from_all;
    const action = exclude ? 'hide from' : 'show in';
    
    if (!confirm(`Are you sure you want to ${action} the /all feed for +${board.name}?`)) {
        return;
    }
    
    try {
        isLoading.value = true;
        const mutation = `
          mutation ExcludeBoardFromAll($boardId: Int!, $exclude: Boolean!) {
            excludeBoardFromAll(boardId: $boardId, exclude: $exclude) {
              id
              name
              exclude_from_all
            }
          }
        `;

        const result = await useGraphQLMutation(mutation, {
          variables: {
            boardId: board.id,
            exclude: exclude
          }
        });

        if (result.data.value?.excludeBoardFromAll) {
            // Update local board store
            boardStore.updateBoard(result.data.value.excludeBoardFromAll);
            toast.addNotification({
                header: 'Board Updated',
                message: `+${board.name} will ${exclude ? 'not appear' : 'appear'} in /all feed`,
                type: 'success'
            });
        }
    } catch (error) {
        console.error('Error updating board visibility:', error);
        toast.addNotification({
            header: 'Error',
            message: 'Failed to update board visibility',
            type: 'error'
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
