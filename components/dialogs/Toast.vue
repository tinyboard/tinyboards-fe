<template>
  <div class="relative flex justify-between rounded-md shadow-lg border transition-all duration-200" :class="notification.type === 'success' ? 'bg-green-300 border-green-400' : 'bg-red-200 border-red-300'">
    <!-- Content -->
    <div class="flex items-center pr-3">
      <!-- Icon -->
      <div class="p-4">
        <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-900" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M5 12l5 5l10 -10"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-900" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M12 19v.01"></path>
           <path d="M12 15v-10"></path>
        </svg>
      </div>
      <!-- Text -->
      <div class="border-l px-4 py-3" :class="notification.type === 'success' ? 'text-green-900 border-green-400' : 'text-red-900 border-red-300'">
        <strong v-if="notification.header" class="text-base">
          {{ notification.header }}
        </strong>
        <p class="text-sm">
          {{ notification.message }}
        </p>
      </div>
    </div>
    <!-- Close Button -->
    <button class="absolute top-1 right-1 w-8 h-8 flex items-center justify-center rounded bg-transparent" :class="notification.type === 'success' ? 'text-green-700 hover:text-green-900 hover:bg-green-300' : 'text-red-700 hover:text-red-900 hover:bg-red-300'" aria-label="Close toast" @click="toast.removeNotification(notification)">
      <span>&#x2715</span>
    </button>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  import { useToastStore } from '@/stores/StoreToast';

  const toast = useToastStore();

  let timeout = ref(null);

  const props = defineProps({
    notification: Object
  })

  timeout = setTimeout(() => {
    toast.removeNotification(props.notification);
  }, 4000);

  onBeforeUnmount(() => {
    clearTimeout(timeout)
  });
</script>