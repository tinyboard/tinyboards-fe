<template>
  <Menu as="div" class="relative z-10">
    <div>
      <MenuButton class="group relative flex items-center text-sm text-gray-500 hover:text-gray-700">
        <span class="pointer-events-none flex items-center mr-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M3 9l4 -4l4 4m-4 -4v14"></path>
           <path d="M21 15l-4 4l-4 -4m4 4v-14"></path>
         </svg>
       </span>
       <span class="block truncate">
        Sort: <span class="font-medium">{{ sorts[selectedSort].name }}</span>
      </span>
      <span class="pointer-events-none flex items-center ml-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
         <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
         <polyline points="6 9 12 15 18 9"></polyline>
       </svg>
     </span>
   </MenuButton>
 </div>
 <transition
 leave-active-class="transition ease-[cubic-bezier(.2,0,0,1.3)]"
 leave-from-class="transform scale-100 opacity-100"
 leave-to-class="transform scale-95 opacity-0"
 >
 <MenuItems class="absolute w-48 max-h-72 mt-1 origin-top bg-white rounded-md shadow-xl border focus:outline-none">
  <div class="py-2">
    <!-- Menu Item -->
    <MenuItem v-slot="{ active, close }" v-for="(item, index) in sorts" :key="index">
      <NuxtLink :to="{ query: { ...route.query, sort: item.key } }" :class="[index === selectedSort ? 'font-medium text-secondary' : 'font-normal text-gray-700',{ 'bg-gray-100':active },'block text-sm px-4 py-2 truncate']" @click="sort = item.key; close()">
        {{ item.name }}
      </NuxtLink>
    </MenuItem>
  </div>
</MenuItems>
</transition>
</Menu>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';

  const router = useRouter();
  const route = useRoute();

  const props = defineProps({
    sorts: {
      type: Array,
      default: [
        {
          name: 'Hot',
          key: 'hot'
        },
        {
          name: 'Latest',
          key: 'new'
        },
        {
          name: 'Top All',
          key: 'topall'
        },
        {
          name: 'Top Month',
          key: 'topmonth'
        },
        {
          name: 'Top Week',
          key: 'topweek'
        },
        {
          name: 'Most Comments',
          key: 'mostcomments'
        },
        {
          name: 'Latest Comments',
          key: 'newcomments'
        }
      ]
    }
  });

  // const sortInit = user.default_sort_type ?? 'hot';

  const sort = ref(route.query.sort ?? props.sorts[0].key);

  const selectedSort = computed(() => {
    return props.sorts.findIndex(x => x.key === sort.value);
  });
</script>