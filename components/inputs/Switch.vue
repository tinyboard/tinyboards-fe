<template>
  <Switch v-model="innerEnabled" :disabled="isDisabled" :class="[innerEnabled ? 'bg-green-500' : 'bg-gray-200', { 'opacity-50 cursor-not-allowed':isDisabled }]" class="relative inline-flex flex-shrink-0 h-[18px] w-[32px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
    <!-- <em class="absolute top-[3px] left-[3px] fas fa-check text-[10px] text-white transform-all origin-bottom-left duration-200 ease-in-out" :class="innerEnabled ? 'scale-100' : '-rotate-90 scale-0'">&#10003;</em> -->
    <span class="sr-only">Toggle</span>
    <span aria-hidden="true" :class="innerEnabled ? 'translate-x-[14px]' : 'translate-x-0'" class="pointer-events-none inline-block h-[14px] w-[14px] rounded-full bg-white shadow-md transform ring-0 transition ease-in-out duration-200"/>
  </Switch>
</template>

<script setup>
  import { Switch } from '@headlessui/vue';

  const emit = defineEmits(['enabled']);

  const props = defineProps({
    isEnabled: {
      type: Boolean
    },
    isDisabled: {
      type: Boolean
    }
  });

  const innerEnabled = computed({
    get: function () {
      return props.isEnabled;
    },
    set: function (newValue) {
      emit('enabled', newValue);
    }
  });
</script>