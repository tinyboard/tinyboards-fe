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
                {{ options.user.is_banned ? 'Unban' : 'Ban' }} {{ options.user.name ?? 'this user' }}?
              </DialogTitle>
              <!-- Body -->
              <div v-if="options.user.is_banned" class="modal-body mt-2">
                <p class="text-sm text-gray-500">
                  {{ options.user.name ?? 'user' }} will be unbanned, thus able to participate in {{ site.name }} once
                  again.
                  <br />
                  You can undo this action.
                </p>
              </div>
              <div v-else class="modal-body mt-2">
                <p class="text-sm text-gray-500">{{ options.user.name ?? 'This user' }} will be banned from {{ site.name
                }}.</p>
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
                <button class="button red" @click="ban">
                  Yes, {{ options.user.is_banned ? 'unban' : 'ban' }} {{ options.user.name ?? 'this user' }}
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
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
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
  id: {
    type: Number,
    default: null,
    required: true
  },
  options: {
    type: Object
  }
});

const site = useSiteStore();
const modalStore = useModalStore();
const reason = ref('');
const duration = ref(3);
const permanent = ref(false);

// Removal
const authCookie = useCookie("token").value;
const toast = useToastStore();

// returns the timestamp of the date when the ban expires
/*const expiryTimestamp = () => {
  if (permanent.value || props.options.user.is_banned) {
    return null;
  } else {
    return Math.floor(Date.now() / 1000) + duration.value * 60 * 60 * 24;
  }
}*/

const ban = async () => {
  const isBanned = props.options.user.is_banned;
  await useApi('/mod/ban', {
    body: {
      "target_person_id": props.id,
      "banned": !isBanned,
      "reason": reason.value ?? `breaking ${site.name} rules`,
      "duration_days": (permanent.value || isBanned) ? null : duration.value
    },
    method: "post"
  })
    .then(({ data }) => {
      if (data.value) {
        // Parse response.
        data = JSON.parse(JSON.stringify(data.value));
        console.log(data);
        // Show success toast.
        setTimeout(() => {
          toast.addNotification({
            header: `${props.options.user.name} ${isBanned ? 'unbanned' : 'banned'}`,
            message: 'Reload the page to see changes.',
            type: 'success'
          });
        }, 400);
      } else {
        // Show error toast.
        setTimeout(() => {
          toast.addNotification({
            header: `${isBanned ? 'Unban' : 'Ban'} failed`,
            message: `Failed to ${isBanned ? 'unban' : 'ban'} the user. Please try again.`,
            type: 'error'
          });
        }, 400);
      };
    })
    .finally(() => {
      // Close the modal.
      modalStore.closeModal();
    });
};
</script>
