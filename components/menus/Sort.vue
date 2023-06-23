<template>
  <Menu as="div" id="dropdown-sort" class="dropdown relative z-20">
    <div>
      <MenuButton class="group relative flex items-center h-5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400">
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
 <MenuItems class="dropdown-menu absolute w-48 max-h-72 mt-1 bg-white dark:bg-gray-900 rounded-md shadow-xl border dark:border-gray-800 focus:outline-none" :class="isLeft ? 'right-0 origin-top-right' : 'left-0 origin-top-left'">
  <div class="py-2">
    <!-- Menu Item -->
    <MenuItem v-slot="{ active, close }" v-for="(item, index) in sorts" :key="index">
      <NuxtLink :to="item.href" :class="[index === selectedSort ? 'font-medium text-gray-200' : 'font-normal text-gray-700 dark:text-gray-400',{ 'bg-gray-100 dark:bg-gray-800':active },'block text-sm px-4 py-2 truncate']" @click="sort = item.key; close()">
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
    isLeft: {
      type: Boolean
    },
    sorts: {
      type: Array,
      default: [
        {
          name: 'Hot',
          key: 'hot',
          href: { params: { sort: 'hot' } }
        },
        {
          name: 'Latest',
          key: 'new',
          href: { params: { sort: 'new' } }
        },
        {
          name: 'Top All',
          key: 'topall',
          href: { params: { sort: 'topall' } }
        },
        {
          name: 'Top Month',
          key: 'topmonth',
          href: { params: { sort: 'topmonth' } }
        },
        {
          name: 'Top Week',
          key: 'topweek',
          href: { params: { sort: 'topweek' } }
        },
        {
          name: 'Most Comments',
          key: 'mostcomments',
          href: { params: { sort: 'mostcomments' } }
        },
        {
          name: 'Latest Comments',
          key: 'newcomments',
          href: { params: { sort: 'newcomments' } }
        }
      ]
    }
  });

  // const sortInit = user.default_sort_type ?? 'hot';

  const sort = ref(route.query.sort || route.params.sort);

  const selectedSort = computed(() => {
    const i = props.sorts.findIndex(x => x.key === sort.value);
    // If sort is invalid, index is -1 and return index 0 instead.
    return i === -1 ? 0 : i;
  });
</script>