<template>
  <div class="toast relative flex flex-col rounded-md shadow-lg border transition-all duration-200" :class="toastClasses">
    <div class="flex justify-between">
      <!-- Content -->
      <div class="toast-content flex items-center pr-3 flex-1">
        <!-- Icon -->
        <div class="p-4">
          <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="iconColor" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
             <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
             <path d="M5 12l5 5l10 -10"></path>
          </svg>
          <svg v-else-if="notification.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="iconColor" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
             <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
             <path d="M12 9v4"></path>
             <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z"></path>
             <path d="M12 16h.01"></path>
          </svg>
          <svg v-else-if="notification.type === 'info'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="iconColor" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
             <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
             <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
             <path d="M12 9h.01"></path>
             <path d="M11 12h1v4h1"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="iconColor" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
             <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
             <path d="M12 19v.01"></path>
             <path d="M12 15v-10"></path>
          </svg>
        </div>
        <!-- Text -->
        <div class="border-l px-4 py-3 flex-1" :class="[textColor, borderColor]">
          <p v-if="notification.header" class="first-letter:uppercase font-medium">
            {{ notification.header }}
          </p>
          <p class="text-sm">
            {{ notification.message }}
          </p>

          <!-- GraphQL Error Details -->
          <div v-if="hasErrors" class="mt-2 space-y-2">
            <!-- Error count toggle -->
            <button
              @click="showDetails = !showDetails"
              class="text-xs font-medium underline hover:no-underline"
              :class="textColor"
            >
              {{ showDetails ? '▼' : '▶' }} {{ errorCount }}
            </button>

            <!-- Error list (expandable) -->
            <div v-if="showDetails" class="mt-2 p-2 rounded text-xs space-y-1" :class="detailsBg">
              <div v-for="(error, index) in notification.details.errors" :key="index" class="pb-1">
                <p class="font-medium">• {{ error.message }}</p>
                <p v-if="error.path" class="text-xs opacity-75 ml-2">Path: {{ error.path.join('.') }}</p>
                <p v-if="error.code" class="text-xs opacity-75 ml-2">Code: {{ error.code }}</p>
                <p v-if="error.field" class="text-xs opacity-75 ml-2">Field: {{ error.field }}</p>
              </div>

              <!-- Error ID -->
              <div v-if="notification.details.errorId" class="pt-2 border-t" :class="borderColor">
                <div class="flex items-center justify-between">
                  <span class="opacity-75">Error ID: {{ notification.details.errorId }}</span>
                  <button
                    @click="copyErrorId"
                    class="px-2 py-1 text-xs rounded hover:bg-black/10"
                    :title="copied ? 'Copied!' : 'Copy Error ID'"
                  >
                    {{ copied ? '✓ Copied' : 'Copy' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Close Button -->
      <button class="toast-close w-8 h-8 flex items-center justify-center rounded bg-transparent self-start mt-1 mr-1" :class="closeButtonClass" aria-label="Close toast" @click="toast.removeNotification(notification)">
        <span>&#x2715</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useToastStore } from '@/stores/StoreToast';

  const route = useRoute();
  const toast = useToastStore();

  const props = defineProps({
    notification: Object
  })

  // Expandable details state
  const showDetails = ref(props.notification?.details?.showDetails || false);
  const copied = ref(false);

  // Computed properties for styling
  const toastClasses = computed(() => {
    switch (props.notification.type) {
      case 'success':
        return 'bg-green-300 border-green-400';
      case 'warning':
        return 'bg-yellow-200 border-yellow-400';
      case 'info':
        return 'bg-blue-200 border-blue-400';
      case 'error':
      default:
        return 'bg-red-200 border-red-300';
    }
  });

  const iconColor = computed(() => {
    switch (props.notification.type) {
      case 'success':
        return 'text-green-900';
      case 'warning':
        return 'text-yellow-900';
      case 'info':
        return 'text-blue-900';
      case 'error':
      default:
        return 'text-red-900';
    }
  });

  const textColor = computed(() => {
    switch (props.notification.type) {
      case 'success':
        return 'text-green-900';
      case 'warning':
        return 'text-yellow-900';
      case 'info':
        return 'text-blue-900';
      case 'error':
      default:
        return 'text-red-900';
    }
  });

  const borderColor = computed(() => {
    switch (props.notification.type) {
      case 'success':
        return 'border-green-400';
      case 'warning':
        return 'border-yellow-400';
      case 'info':
        return 'border-blue-400';
      case 'error':
      default:
        return 'border-red-300';
    }
  });

  const detailsBg = computed(() => {
    switch (props.notification.type) {
      case 'success':
        return 'bg-green-200/50';
      case 'warning':
        return 'bg-yellow-100/50';
      case 'info':
        return 'bg-blue-100/50';
      case 'error':
      default:
        return 'bg-red-100/50';
    }
  });

  const closeButtonClass = computed(() => {
    switch (props.notification.type) {
      case 'success':
        return 'text-green-700 hover:text-green-900 hover:bg-green-400';
      case 'warning':
        return 'text-yellow-700 hover:text-yellow-900 hover:bg-yellow-400';
      case 'info':
        return 'text-blue-700 hover:text-blue-900 hover:bg-blue-400';
      case 'error':
      default:
        return 'text-red-700 hover:text-red-900 hover:bg-red-300';
    }
  });

  // GraphQL error helpers
  const hasErrors = computed(() => {
    return props.notification?.details?.errors && props.notification.details.errors.length > 0;
  });

  const errorCount = computed(() => {
    const count = props.notification?.details?.errors?.length || 0;
    return count === 1 ? 'Show error details' : `Show ${count} errors`;
  });

  // Copy error ID to clipboard
  const copyErrorId = async () => {
    const errorId = props.notification?.details?.errorId;
    if (errorId && typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(errorId);
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy error ID:', err);
      }
    }
  };

  // Auto-dismiss timeout
  const duration = props.notification?.duration || 4000;
  let timeout = ref(null);

  timeout.value = setTimeout(() => {
    toast.removeNotification(props.notification);
  }, duration);

  onBeforeUnmount(() => {
    if (timeout.value) {
      clearTimeout(timeout.value);
    }
  });

  watch(() => route.name, () => {
    if (!props.notification.isVisibleOnRouteChange) {
      toast.removeNotification(props.notification);
      if (timeout.value) {
        clearTimeout(timeout.value);
      }
    }
  });
</script>