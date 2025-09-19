<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="modalStore.closeModal" class="modal relative z-50">
      <!-- Backdrop -->
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80" />
      </TransitionChild>
      <!-- Modal -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-2.5 sm:p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]"
            enter-from="opacity-0 scale-90" enter-to="opacity-100 scale-100"
            leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-90">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all">
              <!-- Header -->
              <DialogTitle as="h3" class="modal-title text-lg font-bold leading-6 text-gray-900">
                {{ options.hasOwnProperty('user') ? `${isBanned ? 'Unban' : 'Ban'} ${options.user.name}` : `${isBanned ?
                  'Unban' : 'Ban'} user` }}
              </DialogTitle>
              <!-- Body -->
              <div v-if="isBanned" class="modal-body mt-2">
                <p class="text-sm text-gray-500">
                  {{ options.user?.name ?? 'The target user' }} will be unbanned, thus able to participate in {{ site.name
                  }} once
                  again.
                  <br />
                  You can undo this action.
                </p>
              </div>
              <div v-else class="modal-body mt-2">
                <p class="text-sm text-gray-500">{{ options.user?.name ?? 'The target user' }} will be banned from {{
                  site.name
                }}.</p>
                <!-- Username - if not specified -->
                <div v-if="!options.user" class="mt-2">
                  <label for="target" class="text-sm text-gray-600 font-semibold">User</label>
                  <!--<input type="text" name="target" id="target" v-model="target"
                    class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"
                    placeholder="username without the @" maxlength="255" />-->
                  <InputsUser v-model="target" />
                </div>
                <!-- Reason -->
                <div class="mt-2">
                  <label for="reason" class="text-sm text-gray-600 font-semibold">Ban reason</label>
                  <input type="text" name="reason" id="reason" v-model="reason"
                    class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"
                    placeholder="being uncool" maxlength="255" />
                </div>
                <!-- Duration -->
                <div class="mt-2">
                  <label for="duration" class="block text-sm text-gray-600 font-semibold">Duration</label>
                  <div class="flex justify-between items-center">
                    <div>
                      <input type="number" name="duration" id="duration" v-model="duration" :disabled="permanent"
                        class="mt-1 inline-block mr-2 w-28 rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" />
                      <span class="text-gray-600 font-semibold">{{ duration === 1 ? 'day' : 'days' }}</span>
                    </div>
                    <div>
                      <InputsSwitch id="permanent" :isEnabled="permanent" @enabled="permanent = !permanent" />
                      <label for="permanent" class="ml-2 font-semibold text-gray-600">Permanent</label>
                    </div>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">You can manually unban this user anytime.</p>
                </div>
                <!-- Date Input -->
                <!-- <input v-if="!options.user.is_banned" type="date" name="expiration" value=""> -->
                <!-- Footer -->
              </div>
              <div class="modal-footer mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  No, cancel
                </button>
                <button class="button red" @click="ban" :disabled="(!options.user && target == '') || isLoading">
                  {{ isLoading ? 'Processing...' : `Yes, ${isBanned ? 'unban' : 'ban'} ${options.user?.name ?? 'user'}` }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import { useToastStore } from '@/stores/StoreToast';
import { useModalStore } from '@/stores/StoreModal';
import { useSiteStore } from '@/stores/StoreSite';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  /*username: {
    type: String,
    default: null,
    required: true
  },*/
  options: {
    type: Object
  }
});

//console.log(`banned: ${props.options.user.is_banned}`);

const site = useSiteStore();
const modalStore = useModalStore();
const target = ref('');
const reason = ref('');
const duration = ref(3);
const permanent = ref(false);

const isBanned = computed(() => props.options.user?.is_banned || props.options.unban);
const toast = useToastStore();

// Loading state
const isLoading = ref(false);

// debugging
watch(
  () => target.value,
  newValue => console.log(newValue)
);

const ban = async () => {
  if (isLoading.value) return;

  const userId = props.options.user?.id;
  const username = props.options.user?.name || target.value;
  const boardId = props.options.boardId; // For board-specific bans

  if (!userId && !username) {
    toast.addNotification({
      header: 'Ban failed',
      message: 'User ID is required for banning operations.',
      type: 'error'
    });
    return;
  }

  isLoading.value = true;

  try {
    if (isBanned.value) {
      // Unban user
      if (boardId) {
        // Board-specific unban
        const result = await $fetch('#gql', {
          query: `
            mutation unbanUserFromBoard($boardId: Int!, $userId: Int!) {
              unbanUserFromBoard(boardId: $boardId, userId: $userId) {
                success
              }
            }
          `,
          variables: { boardId, userId }
        });

        if (result.unbanUserFromBoard?.success) {
          toast.addNotification({
            header: `${username} unbanned`,
            message: 'The user has been successfully unbanned from this board.',
            type: 'success'
          });
        } else {
          throw new Error('Board unban operation was not successful');
        }
      } else {
        // Site-wide unban
        const result = await $fetch('#gql', {
          query: `
            mutation unbanUser($userId: Int!) {
              unbanUser(userId: $userId) {
                success
              }
            }
          `,
          variables: { userId }
        });

        if (result.unbanUser?.success) {
          toast.addNotification({
            header: `${username} unbanned`,
            message: 'The user has been successfully unbanned.',
            type: 'success'
          });
        } else {
          throw new Error('Unban operation was not successful');
        }
      }
    } else {
      // Ban user
      let expirationDate = null;
      if (!permanent.value) {
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + duration.value);
        expirationDate = expiration.toISOString();
      }

      if (boardId) {
        // Board-specific ban
        const result = await $fetch('#gql', {
          query: `
            mutation banUserFromBoard($input: BoardBanUserInput!) {
              banUserFromBoard(input: $input) {
                success
              }
            }
          `,
          variables: {
            input: {
              boardId,
              userId,
              reason: reason.value || 'breaking board rules',
              expires: expirationDate
            }
          }
        });

        if (result.banUserFromBoard?.success) {
          toast.addNotification({
            header: `${username} banned`,
            message: 'The user has been successfully banned from this board.',
            type: 'success'
          });
        } else {
          throw new Error('Board ban operation was not successful');
        }
      } else {
        // Site-wide ban
        const result = await $fetch('#gql', {
          query: `
            mutation banUser($input: BanUserInput!) {
              banUser(input: $input) {
                success
              }
            }
          `,
          variables: {
            input: {
              userId,
              reason: reason.value || `breaking ${site.name} rules`,
              expires: expirationDate
            }
          }
        });

        if (result.banUser?.success) {
          toast.addNotification({
            header: `${username} banned`,
            message: 'The user has been successfully banned.',
            type: 'success'
          });
        } else {
          throw new Error('Ban operation was not successful');
        }
      }
    }
  } catch (error) {
    console.error('Error with ban operation:', error);
    toast.addNotification({
      header: `${isBanned.value ? 'Unban' : 'Ban'} failed`,
      message: `Failed to ${isBanned.value ? 'unban' : 'ban'} the user. Please try again.`,
      type: 'error'
    });
  } finally {
    isLoading.value = false;
    modalStore.closeModal();
  }
};
</script>
