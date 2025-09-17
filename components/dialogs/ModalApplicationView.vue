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
              class="w-full max-w-2xl transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
              <!-- Header -->
              <DialogTitle as="h3" class="modal-title text-lg font-bold leading-6 text-gray-900 mb-4">
                Registration Application Details
              </DialogTitle>

              <!-- Application Details -->
              <div class="modal-body space-y-4">
                <!-- Applicant Information -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-600">Username</label>
                    <p class="text-primary font-semibold">{{ options.application?.username || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-600">User ID</label>
                    <p class="text-gray-900">{{ options.application?.userId || 'N/A' }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-600">Application ID</label>
                    <p class="text-gray-900">{{ options.application?.id || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-600">Submitted</label>
                    <p class="text-gray-900">{{ formatDate(options.application?.creationDate) }}</p>
                  </div>
                </div>

                <!-- Application Text -->
                <div>
                  <label class="block text-sm font-semibold text-gray-600 mb-2">Application Text</label>
                  <div class="bg-gray-50 rounded-md p-4 border">
                    <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {{ options.application?.answer || 'No application text provided' }}
                    </p>
                  </div>
                </div>

                <!-- Admin Information (if already processed) -->
                <div v-if="options.application?.adminId" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h4 class="text-sm font-semibold text-yellow-800 mb-2">Admin Action</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-yellow-700">Processed by Admin ID</label>
                      <p class="text-yellow-900">{{ options.application.adminId }}</p>
                    </div>
                    <div v-if="options.application?.denyReason">
                      <label class="block text-xs font-semibold text-yellow-700">Denial Reason</label>
                      <p class="text-yellow-900">{{ options.application.denyReason }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="modal-footer mt-6 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  Close
                </button>
                <button
                  v-if="!options.application?.adminId"
                  @click="approveFromModal"
                  class="button green"
                  :disabled="actionLoading"
                >
                  {{ actionLoading ? 'Approving...' : 'Approve' }}
                </button>
                <button
                  v-if="!options.application?.adminId"
                  @click="denyFromModal"
                  class="button red"
                  :disabled="actionLoading"
                >
                  {{ actionLoading ? 'Processing...' : 'Deny' }}
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
import { format, parseISO } from "date-fns";
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
  options: {
    type: Object
  }
});

const modalStore = useModalStore();
const toast = useToastStore();
const actionLoading = ref(false);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return format(parseISO(dateString), 'MMM dd, yyyy \'at\' HH:mm');
};

const approveFromModal = async () => {
  if (!props.options?.application?.id) return;

  actionLoading.value = true;
  try {
    await $fetch('#gql', {
      query: `
        mutation approveRegistrationApplication($applicationId: Int!) {
          approveRegistrationApplication(applicationId: $applicationId)
        }
      `,
      variables: { applicationId: props.options.application.id }
    });

    toast.addNotification({
      header: 'Application Approved',
      message: `The registration application from ${props.options.application.username} has been approved.`,
      type: 'success'
    });

    modalStore.closeModal();

    // Call the onSuccess callback if provided
    if (props.options.onSuccess) {
      props.options.onSuccess();
    }
  } catch (error) {
    toast.addNotification({
      header: 'Approval Failed',
      message: 'Failed to approve the application. Please try again.',
      type: 'error'
    });
  } finally {
    actionLoading.value = false;
  }
};

const denyFromModal = () => {
  // Close this modal and open the deny modal
  modalStore.closeModal();
  setTimeout(() => {
    modalStore.setModal({
      modal: 'ModalApplicationDeny',
      id: props.options.application.id,
      isOpen: true,
      options: {
        application: props.options.application,
        onSuccess: props.options.onSuccess
      }
    });
  }, 100);
};
</script>