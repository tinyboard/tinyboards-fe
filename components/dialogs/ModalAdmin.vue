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
              <DialogTitle v-if="options.user && options.user.is_admin && !remove" as="h3"
                class="text-lg font-bold leading-6 text-gray-900">
                Edit permissions for {{ options.user.name }}
              </DialogTitle>
              <DialogTitle v-else as="h3" class="text-lg font-bold leading-6 text-gray-900">
                {{ remove ? `Remove ${options.user?.name ?? 'target user'} as` : `Make ${options.user?.name ??
                  'target user'}` }} admin
              </DialogTitle>
              <!-- Body -->
              <div class="mt-2">
                <p v-if="remove && options.user" class="text-sm text-gray-500">
                  {{ options.user.name }} will have all their admin privileges revoked.
                  <br />
                  <br />
                  This action can be undone.
                </p>
                <div v-if="!options.user" class="mt-2">
                  <label for="target" class="text-md text-gray-600 font-semibold">User</label>
                  <!--<input type="text" name="target" id="target" v-model="target"
                    class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"
                    placeholder="username without the @" maxlength="255" />-->
                  <InputsUser v-model="target" :allow-banned="true" :limit="5" />
                </div>
                <h3 v-if="!remove" class="mt-2 text-md text-gray-600 font-semibold">Permissions</h3>
                <div v-if="!remove" class="space-y-2 divide-y-[1px]">
                  <div v-for="perm in permissions" :key="perm.code" class="flex justify-between items-center">
                    <div class="my-2 mr-2">
                      <h5 class="text-gray-800 font-semibold" :class="{ 'text-opacity-60': fullPermsEnabled }">{{
                        perm.name }}</h5>
                      <p class="text-sm text-gray-600" :class="{ 'text-opacity-60': fullPermsEnabled }">{{
                        perm.description }}</p>
                    </div>
                    <InputsSwitch :id="perm.name" :isEnabled="(permissionCode & perm.code) > 0"
                      :is-disabled="fullPermsEnabled"
                      @enabled="permissionCode & perm.code ? permissionCode -= perm.code : permissionCode += perm.code" />
                  </div>
                  <div v-if="requireOwnerPerms()"
                    class="flex justify-between items-center mt-2 border-t-[1px] border-red-500">
                    <div class="my-2 mr-2">
                      <h5 class="text-red-500 font-semibold">Full Permissions</h5>
                      <p class="text-sm text-gray-600">All of the above permissions. Can also add, manage and remove
                        admins who do not have full permissions. Careful with this one.</p>
                    </div>
                    <InputsSwitch id="full" :isEnabled="(permissionCode & PERMISSIONS.full) > 0" @enabled="permissionCode & PERMISSIONS.full ? permissionCode -= PERMISSIONS.full :
                      permissionCode = PERMISSIONS.full" />
                  </div>
                </div>
                <!--<p class="text-xs text-gray-400">permission code: {{ permissionCode }}</p>-->
              </div>
              <!-- Date Input -->
              <!-- <input v-if="!options.user.is_admin" type="date" name="expiration" value=""> -->
              <!-- Footer -->
              <div class="mt-6 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  No, cancel
                </button>
                <button class="button red" @click="submitAdmin"
                  :disabled="!(options.user || target.length > 0) || (!remove && permissionCode == 0)">
                  {{ remove ? `Indeed, demote @${options.user.name}!` : (options.user?.is_admin ? 'Update permissions' :
                    `Confirm, promote ${options.user?.name ?? "them"}!`) }}
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
import { useAPI } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';
import { useModalStore } from '@/stores/StoreModal';
import { PERMISSIONS, requireOwnerPerms } from '@/composables/admin';
import { usePostsStore } from '~/stores/StorePosts';
import { useCommentsStore } from '@/stores/StoreComments';
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

const permissions = [
  {
    name: "Edit Appearance",
    description: "Manage how this instance looks like.",
    code: PERMISSIONS["appearance"],
    enabled: false
  },
  {
    name: "Edit Settings",
    description: "Configure this instance, for example, modify name and icon, and access security settings.",
    code: PERMISSIONS["config"],
    enabled: false
  },
  {
    name: "Manage Content",
    description: "Remove and approve posts and comments. Access mod queue.",
    code: PERMISSIONS["content"],
    enabled: false
  },
  {
    name: "Manage Users",
    description: "Ban and unban users. (Appointing admins requires full permissions.)",
    code: PERMISSIONS["users"],
    enabled: false
  },
  {
    name: "Manage Boards",
    description: "Create, ban and unban boards if they are enabled on this instance.",
    code: PERMISSIONS["boards"],
    enabled: false
  },
]

const permissionCode = ref(props.options.user?.admin_level || 0);
const fullPermsEnabled = computed(() => (permissionCode.value & PERMISSIONS["full"]) > 0);

watch(
  () => props.options.user?.admin_level,
  newLevel => permissionCode.value = newLevel || 0
);

// const remove = computed(() => props.options.user?.is_admin || props.options.remove);
const remove = computed(() => props.options.remove);
const target = ref('');

const modalStore = useModalStore();

// Removal
const authCookie = useCookie("token").value;
const toast = useToastStore();

const submitAdmin = async () => {
  //const isAdmin = props.options.user.is_admin;
  const username = props.options.user?.name || target.value;
  if (remove.value) {
    permissionCode.value = 0;
  }
  await useAPI('/admin/add_admin', {
    body: {
      "username": username,
      "level": permissionCode.value
    },
    method: "post"
  })
    .then(({ data }) => {
      if (data.value) {
        // Parse response.
        data = JSON.parse(JSON.stringify(data.value));
        console.log(data);
        // Show success toast.
        toast.addNotification({
          header: `${username} ${remove.value ? 'removed as admin' : (props.options.user?.is_admin ? '- permissions updated' : 'was made an admin')}`,
          message: 'Reload the page to see changes.',
          type: 'success'
        });
      } else {
        // Show error toast.
        toast.addNotification({
          header: `${remove.value ? 'Removing' : 'Adding'} admin failed`,
          message: `Failed to ${remove.value ? 'remove' : 'make'} admin. Please try again.`,
          type: 'error'
        });
      };
    })
    .finally(() => {
      // Close the modal.
      modalStore.closeModal();
    });
};
</script>
