<template>
  <Popover v-slot="{ open }" class="relative inline-block text-left">
    <PopoverButton class="flex items-center justify-center bg-white border border-dashed group focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 rounded-sm w-[34px] h-[34px]" :style="{ 'background-color': innerColor }">
      <i class="fas fa-fill-drip fa-fw"></i>
    </PopoverButton>

    <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-1 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-1 opacity-0"
    >
    <PopoverPanel class="absolute right-0 origin-top-right w-56 z-10 mt-2 bg-white border rounded-sm">
      <ul class="inline-flex flex-wrap gap-2 mb-0 p-3">
        <li v-for="swatch in primarySwatches" :key="swatch">
          <label :for="swatch" class="flex flex-shrink-0 w-[1.325rem] h-[1.325rem] shadow-inner rounded-sm" :style="{ 'background-color': swatch }">
            <input type="radio" class="invisible" :id="swatch" :value="swatch" v-model="innerColor"/>
          </label>
        </li>
      </ul>
      <div class="flex items-center border-t p-3">
        <div class="uppercase tracking-wide font-semibold leading-none text-2xs text-gray-500">
          Custom
        </div>
        <div class="relative ml-8">
          <input type="color" id="color" name="color" class="w-[18px] h-[23px] rounded-full absolute left-2 top-[6px] bg-transparent" v-model="innerColor">
          <input type="text" class="form-input light pl-8" :placeholder="innerColor" v-model="innerColor"/>
        </div>
      </div>
    </PopoverPanel>
  </transition>
</Popover>
</template>

<script setup>
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
  import { ref, computed, watch } from 'vue';

  /*export default {
    components: { Popover, PopoverButton, PopoverPanel },
    props: {
      color: {
        type: String,
        default: '#000000'
      }
    },
    data() {
      return {
        primarySwatches: ['#EF4444', '#F43F5E', '#EC4899', '#D946EF', '#A855F7', '#8B5CF6', '#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4','#14B8A6', '#10B981', '#22C55E', '#84CC16', '#EAB308', '#F59E0B', '#F97316', '#78716C', '#71717A', '#6B7280', '#64748B']
      }
    },
    computed: {
      innerColor: {
        get: function () {
          return this.color
        },
        set: function (newValue) {
          this.$emit("update:color",newValue)
        }
      }
    }
  }*/
  const props = defineProps({
    color: {
      type: String,
      default: '#000000'
    }
  });

  const emit = defineEmits(['colorChanged']);

  const primarySwatches = ref(['#EF4444', '#F43F5E', '#EC4899', '#D946EF', '#A855F7', '#8B5CF6', '#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4','#14B8A6', '#10B981', '#22C55E', '#84CC16', '#EAB308', '#F59E0B', '#F97316', '#78716C', '#71717A', '#6B7280', '#64748B']);

  const innerColor = ref(props.color);

  function set(newValue) {
    emit('colorChanged', newValue);
  }

  watch(innerColor, (newValue, oldValue) => {
    if (oldValue != newValue) {
      set(newValue);
    }
  });
</script>
