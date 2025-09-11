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
                            <!-- Body -->
                            <!-- Page 1 -->
                            <div v-if="page == 1">
                                <div class="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="inline w-24 h-24 text-yellow-400"
                                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
                                    </svg>
                                    <h3 class="text-xl text-gray-700 font-bold">Transfer ownership</h3>
                                </div>
                                <p class="text-gray-600 mb-2">
                                    You are now transferring ownership of {{ site.name }} to someone else.
                                </p>
                                <label for="target" class="text-md text-gray-600 font-semibold">Select user to transfer
                                    ownership to</label>
                                <InputsUser v-model="target" />
                                <div class="space-y-2 mt-2">
                                    <p class="text-gray-700">The new owner will have <span
                                            class="text-red-600 font-bold">all</span>
                                        permissions on {{ site.name }}.</p>
                                    <p class="text-gray-700">By transferring ownership, you will lose the following
                                        privileges:
                                    </p>
                                    <ul class="list-disc text-gray-700 pl-4 space-y-1">
                                        <li>Appoint and remove admins with full permissions.</li>
                                        <li>Be at the top of the admin list, with no one being able to remove you. Once
                                            you're
                                            no
                                            longer the owner, <strong>you may be removed from position</strong>.</li>
                                        <li>Full control over the configuration of {{ site.name }}.</li>
                                    </ul>

                                    <div class="p-2 border border-red-600 rounded">
                                        <p class="text-red-600 font-bold">This operation cannot be undone. Make sure you
                                            trust
                                            the person you're giving ownership to.</p>
                                    </div>
                                    <p class="text-gray-700">You will be prompted to confirm your password to finish the
                                        ownership
                                        transfer.</p>

                                    <div>
                                        <input type="checkbox" v-model="accept" name="accept" class="mr-2" />
                                        <label for="accept" class="text-gray-700 font-bold">Accept the risk and
                                            continue</label>
                                    </div>
                                </div>

                                <!-- Footer -->
                                <div class="modal-footer mt-4 flex space-x-2 justify-end">
                                    <button type="button" class="button gray" @click="modalStore.closeModal">
                                        Nevermind
                                    </button>
                                    <button class="button green" :disabled="target == '' || !accept" @click="page += 1">
                                        Continue
                                    </button>
                                </div>
                            </div>
                            <div v-else>
                                <div class="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="inline w-24 h-24 text-yellow-400"
                                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
                                    </svg>
                                    <h3 class="text-xl text-gray-700 font-bold">Transfer ownership to <span
                                            class="text-yellow-400">@{{ target }}</span></h3>
                                </div>

                                <div class="my-2 space-y-2">
                                    <p class="text-gray-700"><strong>{{ target }}</strong> will become the new owner of {{
                                        site.name }}.</p>
                                    <p class="text-gray-700">Due to the severity of this action, you are required to confirm
                                        your password to complete it.</p>
                                    <div>
                                        <label for="password" class="block text-sm font-bold">Password</label>
                                        <input type="password" id="password" v-model="password"
                                            class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"
                                            required="" />
                                    </div>
                                    <p class="text-gray-700">You will remain an admin after the ownership transfer. If you
                                        wish, you will be able to resign anytime. You will also be able to delete your
                                        account.</p>
                                </div>

                                <!-- Footer -->
                                <div class="modal-footer mt-4 flex justify-between">
                                    <button class="button gray" @click="modalStore.closeModal">Cancel</button>
                                    <div class="flex space-x-2">
                                        <button type="button" class="button gray" @click="page -= 1">
                                            Back
                                        </button>
                                        <button class="button yellow" :disabled="password == ''" @click="transfer">
                                            Transfer ownership!
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { useAPI } from "@/composables/api";
import { useToastStore } from '@/stores/StoreToast';
import { useModalStore } from '@/stores/StoreModal';
import { useSiteStore } from '@/stores/StoreSite';
import { ref } from 'vue';
import { PERMISSIONS } from "@/composables/admin";
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

const site = useSiteStore();
const modalStore = useModalStore();
const toast = useToastStore();

const page = ref(1);
const accept = ref(false);
const target = ref('');
const password = ref('');

const transfer = async () => {
    await useAPI('/admin/add_admin', {
        body: {
            username: target.value,
            level: PERMISSIONS['owner'],
            password: password.value
        },
        method: "post"
    })
        .then(({ data }) => {
            if (data.value) {
                // Parse response.
                /*data = JSON.parse(JSON.stringify(data.value));
                console.log(data);*/
                // Show success toast.
                setTimeout(() => {
                    window.location.reload(true);

                    toast.addNotification({
                        header: "Ownership transfered",
                        message: 'So long!',
                        type: 'success'
                    });
                }, 400);
            } else {
                // Show error toast.
                setTimeout(() => {
                    toast.addNotification({
                        header: "Failed to transfer ownership",
                        message: "Something went wrong. Try again a bit later.",
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