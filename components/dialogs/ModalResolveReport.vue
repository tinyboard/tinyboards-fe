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
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900">
                Resolve {{ type === 'post' ? 'Post' : 'Comment' }} Report
              </DialogTitle>
              <!-- Body -->
              <div class="modal-body mt-2">
                <p class="text-sm text-gray-500 mb-3">
                  This report will be marked as resolved and removed from the queue.
                </p>
                <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                  <p class="text-sm font-semibold text-gray-700">Report reason:</p>
                  <p class="text-sm text-gray-600">{{ options.reason }}</p>
                </div>
                <div>
                  <label for="resolution-reason" class="block text-sm font-semibold text-gray-700 mb-1">
                    Resolution notes (optional)
                  </label>
                  <textarea
                    id="resolution-reason"
                    v-model="resolutionReason"
                    class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"
                    placeholder="Add notes about why this report was resolved..."
                    rows="3"
                    maxlength="500"
                  ></textarea>
                </div>
              </div>
              <!-- Footer -->
              <div class="modal-footer mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="modalStore.closeModal">
                  Cancel
                </button>
                <button class="button green" @click="resolveReport" :disabled="isLoading">
                  {{ isLoading ? 'Resolving...' : 'Resolve Report' }}
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
import { ref } from 'vue';
import { useToastStore } from '@/stores/StoreToast';
import { useModalStore } from '@/stores/StoreModal';
import { useGraphQLMutation } from '@/composables/useGraphQL';
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
  type: {
    type: String,
    required: true,
    validator: (value) => ['post', 'comment'].includes(value)
  },
  options: {
    type: Object,
    required: true
  }
});

const modalStore = useModalStore();
const toast = useToastStore();

const resolutionReason = ref('');
const isLoading = ref(false);

const resolveReport = async () => {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    let mutation;
    let result;

    if (props.type === 'post') {
      mutation = `
        mutation ResolvePostReport($reportId: Int!, $resolutionReason: String) {
          resolvePostReport(reportId: $reportId, resolutionReason: $resolutionReason) {
            success
            reportId
            message
          }
        }
      `;
      result = await useGraphQLMutation(mutation, {
        variables: {
          reportId: props.options.reportId,
          resolutionReason: resolutionReason.value.trim() || null
        }
      });
    } else {
      mutation = `
        mutation ResolveCommentReport($reportId: Int!, $resolutionReason: String) {
          resolveCommentReport(reportId: $reportId, resolutionReason: $resolutionReason) {
            success
            reportId
            message
          }
        }
      `;
      result = await useGraphQLMutation(mutation, {
        variables: {
          reportId: props.options.reportId,
          resolutionReason: resolutionReason.value.trim() || null
        }
      });
    }

    const mutationKey = props.type === 'post' ? 'resolvePostReport' : 'resolveCommentReport';

    if (result.data.value?.[mutationKey]?.success) {
      toast.addNotification({
        header: 'Report resolved',
        message: result.data.value[mutationKey].message || 'The report has been successfully resolved.',
        type: 'success'
      });

      // Emit event to refresh the reports list
      if (props.options.onResolved) {
        props.options.onResolved();
      }
    } else {
      throw new Error(result.data.value?.[mutationKey]?.message || 'Failed to resolve report');
    }
  } catch (error) {
    console.error('Error resolving report:', error);
    toast.addNotification({
      header: 'Resolution failed',
      message: error.message || 'Failed to resolve the report. Please try again.',
      type: 'error'
    });
  } finally {
    isLoading.value = false;
    modalStore.closeModal();
  }
};
</script>
