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
                Deny Registration Application
              </DialogTitle>
              <!-- Body -->
              <div class="modal-body mt-2">
                <p class="text-sm text-gray-500">
                  You are about to deny the registration application from <strong>{{ options.application?.username }}</strong>.
                  This action cannot be undone.
                </p>

                <!-- Application Preview -->
                <div v-if="options.application?.answer" class="mt-3 p-3 bg-gray-50 rounded-md">
                  <p class="text-xs text-gray-600 font-semibold mb-1">Application Text:</p>
                  <p class="text-sm text-gray-800">{{ options.application.answer }}</p>
                </div>

                <!-- Denial Reason -->
                <div class="mt-4">
                  <label for="reason" class="block text-sm text-gray-600 font-semibold">Denial Reason (Optional)</label>
                  <textarea
                    name="reason"
                    id="reason"
                    v-model="reason"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"
                    placeholder="Enter the reason for denying this application..."
                    maxlength="500"
                  />
                  <p class="mt-1 text-xs text-gray-500">This reason will be recorded for administrative purposes.</p>
                </div>
              </div>

              <!-- Footer -->
              <div class="modal-footer mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal" :disabled="loading">
                  Cancel
                </button>
                <button class="button red" @click="denyApplication" :disabled="loading">
                  {{ loading ? 'Denying...' : 'Deny Application' }}
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
const reason = ref('');
const loading = ref(false);

const denyApplication = async () => {
  if (!props.options?.application?.id) return;

  loading.value = true;
  try {
    await $fetch('#gql', {
      query: `
        mutation denyRegistrationApplication($applicationId: Int!, $reason: String) {
          denyRegistrationApplication(applicationId: $applicationId, reason: $reason)
        }
      `,
      variables: {
        applicationId: props.options.application.id,
        reason: reason.value || null
      }
    });

    toast.addNotification({
      header: 'Application Denied',
      message: `The registration application from ${props.options.application.username} has been denied.`,
      type: 'success'
    });

    // Call the onSuccess callback if provided
    if (props.options.onSuccess) {
      props.options.onSuccess();
    }

    modalStore.closeModal();
  } catch (error) {
    toast.addNotification({
      header: 'Denial Failed',
      message: 'Failed to deny the application. Please try again.',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};
</script>