<template>
      <ul class="flex items-center text-sm text-gray-500 font-bold space-x-1">
            <li>
                  <NuxtLink external :to="previousPage" class="button button-sm white" :class="{'disabled':isFirstPage}">
                        Prev
                  </NuxtLink>
            </li>
            <li v-if="totalPages >= 4" v-for="(page, i) in pages" :key="i">
                  <NuxtLink external :to="`${route.path}?page=${page.name}`" class="button button-sm" :class="isPageActive(page.name) ? 'primary' : 'white'" :aria-label="`Go to page ${page.name}`">
                        {{ page.name }}
                  </NuxtLink>
            </li>
            <li v-if="totalPages >= 4" v-show="page < totalPages - 1">
                  <span class="text-gray-400 px-2">...</span>
            </li>
            <li v-if="totalPages >= 4" v-show="page < totalPages - 1">
                  <NuxtLink external :to="`${route.path}?page=${totalPages}`" class="button button-sm" :disabled="isLastPage" :class="isPageActive(isLastPage) ? 'primary' : 'white'" :aria-label="`Go to page ${totalPages}`">
                        {{ totalPages }}
                  </NuxtLink>
            </li>
            <li v-if="page < totalPages">
                  <NuxtLink external :to="nextPage" class="button button-sm white">
                        Next
                  </NuxtLink>
            </li>
      </ul>
</template>

<script setup>
      import { computed } from 'vue';

      // Props
      const props = defineProps({
            maxVisibleButtons: {
                  type: Number,
                  required: false,
                  default: 3
            },
            totalPages: {
                  type: Number,
                  required: true
            },
            perPage: {
                  type: Number,
                  required: true
            },
            currentPage: {
                  type: Number,
                  required: true,
                  default: 1
            },
      });

      const route = useRoute();

      const page = computed(() => route.query.page || 1);

      // Computed properties
      const startPage = computed(() => {
            if (props.currentPage <= 1) {
                  return 1;
            } else if (props.currentPage === props.totalPages) { 
                  return props.totalPages - props.maxVisibleButtons + 1;
            } else {
                  return props.currentPage - 1;
            }
      });

      const endPage = computed(() => {
            return Math.min(startPage.value + props.maxVisibleButtons - 1, props.totalPages);
      });

      const previousPage = computed(() => {
            return props.currentPage === 1 ? `${route.path}` : `${route.path}?page=${props.currentPage - 1}`;
      });

      const nextPage = computed(() => {
            return `${route.path}?page=${props.currentPage + 1}`;
      })

      const pages = computed(() => {
            const range = [];

            for (let i = startPage.value; i <= endPage.value; i+= 1 ) {
                  range.push({
                        name: i,
                        isDisabled: i === props.currentPage 
                  });
            }

            return range;
      });

      const isFirstPage = computed(() => {
            return props.currentPage <= 1;
      });

      const isLastPage = computed(() => {
            return props.currentPage === props.totalPages;
      });

      // Methods
      const onClickFirstPage = () => {
            emit('pageChanged', 1);
      }

      const onClickPreviousPage = () => {
            emit('pageChanged', props.currentPage - 1);
      }

      const onClickPage = (page) => {
            emit('pageChanged', page);
      }

      const onClickNextPage = () => {
            emit('pageChanged', props.currentPage + 1);
      }

      const onClickLastPage = () => {
            emit('pageChanged', props.totalPages);
      }

      const isPageActive = (page) => {
            return props.currentPage === page;
      }
</script>