<template>
  <div class="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm">
    <!-- Header -->
    <div class="p-4 border-b dark:border-gray-800 flex items-center justify-between">
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Flair Requests</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ pendingCount }} pending approval
        </p>
      </div>
      <div class="flex gap-2">
        <select v-model="filterStatus" class="form-select gray text-sm">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredRequests.length === 0" class="p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
        <path d="M9 14l2 2l4 -4" />
      </svg>
      <p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">
        {{ filterStatus === 'all' ? 'No flair requests' : `No ${filterStatus} requests` }}
      </p>
    </div>

    <!-- Requests List -->
    <div v-else class="divide-y dark:divide-gray-800">
      <div
        v-for="request in filteredRequests"
        :key="request.id"
        class="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50"
      >
        <div class="flex items-start gap-4">
          <!-- User Avatar -->
          <NuxtLink :to="`/@${request.user.name}`" class="flex-shrink-0">
            <img
              :src="request.user.avatar"
              :alt="request.user.name"
              class="w-10 h-10 rounded object-cover"
            />
          </NuxtLink>

          <!-- Request Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <NuxtLink
                :to="`/@${request.user.name}`"
                class="font-medium text-gray-900 dark:text-gray-100 hover:text-primary"
              >
                {{ request.user.name }}
              </NuxtLink>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatTimeAgo(request.creationDate) }}
              </span>
              <span
                class="px-2 py-0.5 text-xs font-medium rounded-full"
                :class="{
                  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300': request.status === 'pending',
                  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300': request.status === 'approved',
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300': request.status === 'rejected'
                }"
              >
                {{ request.status }}
              </span>
            </div>

            <!-- Requested Flair -->
            <div class="mb-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">Requested flair:</span>
              <div class="mt-1">
                <div
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :style="{
                    backgroundColor: request.flair.backgroundColor || '#e5e7eb',
                    color: request.flair.textColor || '#374151'
                  }"
                >
                  {{ request.flair.displayText }}
                </div>
              </div>
            </div>

            <!-- Request Message -->
            <div v-if="request.message" class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md border dark:border-gray-800">
              <p class="text-sm text-gray-700 dark:text-gray-300">{{ request.message }}</p>
            </div>

            <!-- Rejection Reason -->
            <div v-if="request.status === 'rejected' && request.rejectionReason" class="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
              <p class="text-sm text-red-900 dark:text-red-100">
                <strong>Rejection reason:</strong> {{ request.rejectionReason }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div v-if="request.status === 'pending'" class="flex-shrink-0 flex gap-2">
            <button
              @click="approveRequest(request)"
              class="button primary text-sm"
              :disabled="isProcessing"
            >
              Approve
            </button>
            <button
              @click="openRejectModal(request)"
              class="button red text-sm"
              :disabled="isProcessing"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="pendingRequests.length > 1" class="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <button
        @click="bulkApprove"
        class="button primary text-sm"
        :disabled="isProcessing"
      >
        Approve All Pending ({{ pendingCount }})
      </button>
    </div>

    <!-- Rejection Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeRejectModal"
    >
      <div class="bg-white dark:bg-gray-950 rounded-lg shadow-xl max-w-md w-full m-4">
        <div class="p-6">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Reject Flair Request
          </h4>

          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Please provide a reason for rejecting this flair request:
          </p>

          <textarea
            v-model="rejectionReason"
            rows="4"
            class="form-input gray w-full"
            placeholder="Reason for rejection..."
            autofocus
          />

          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="closeRejectModal"
              class="button gray"
            >
              Cancel
            </button>
            <button
              @click="confirmReject"
              class="button red"
              :disabled="!rejectionReason.trim() || isProcessing"
            >
              Reject Request
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';

const props = defineProps({
  requests: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['approve', 'reject', 'bulkApprove']);

const filterStatus = ref('all');
const isProcessing = ref(false);
const showRejectModal = ref(false);
const selectedRequest = ref(null);
const rejectionReason = ref('');

const filteredRequests = computed(() => {
  if (filterStatus.value === 'all') {
    return props.requests;
  }
  return props.requests.filter(req => req.status === filterStatus.value);
});

const pendingRequests = computed(() => {
  return props.requests.filter(req => req.status === 'pending');
});

const pendingCount = computed(() => pendingRequests.value.length);

const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

const approveRequest = async (request) => {
  isProcessing.value = true;
  try {
    await emit('approve', request);
  } finally {
    isProcessing.value = false;
  }
};

const openRejectModal = (request) => {
  selectedRequest.value = request;
  rejectionReason.value = '';
  showRejectModal.value = true;
};

const closeRejectModal = () => {
  showRejectModal.value = false;
  selectedRequest.value = null;
  rejectionReason.value = '';
};

const confirmReject = async () => {
  if (!rejectionReason.value.trim()) return;

  isProcessing.value = true;
  try {
    await emit('reject', {
      request: selectedRequest.value,
      reason: rejectionReason.value
    });
    closeRejectModal();
  } finally {
    isProcessing.value = false;
  }
};

const bulkApprove = async () => {
  if (!confirm(`Are you sure you want to approve all ${pendingCount.value} pending requests?`)) {
    return;
  }

  isProcessing.value = true;
  try {
    await emit('bulkApprove', pendingRequests.value);
  } finally {
    isProcessing.value = false;
  }
};
</script>
