<template>
      <main class="flex flex-col pt-12 sm:pt-14">
            <!-- Sub Navigation & Banner -->
            <section class="hidden md:flex flex-col">
                  <NavigationNavbarSub :links="links" class="sm:order-first"/>
                  <div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
                        <!-- Banner -->
                        <CardsBanner class="col-span-full"/>
                  </div>
            </section>
            <!-- Main Content -->
            <section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
                  <div class="col-span-full flex gap-6">
                        <div class="w-full">
                              <!-- Sorts & View Options -->
                              <div class="flex items-center sm:mb-4 p-2.5 sm:px-4 sm:pt-0 sm:pb-2 sm:border-b">
                                    <MenusSort isPath/>
                                    <button class="ml-auto" @click="isCompact = !isCompact">Toggle</button>
                              </div>
                              <!-- Posts -->
                              <ListsPosts :posts="posts" :isCompact="isCompact" :isLoading="pending" :hasError="error"/>
                              <!-- <TablesPosts :posts="posts" :title="sort" :isLoading="pending" :hasError="error"/> -->
                              <!-- Pagination -->
                              <div v-if="posts.length" class="w-full mt-4">
                                    <NavigationPagination
                                    :total-pages="totalPages"
                                    :total="250"
                                    :per-page="25"
                                    :current-page="Number.parseInt(page)"
                                    v-slot="{
                                          startPage,
                                          endPage,
                                          pages,
                                          isFirstPage,
                                          isLastPage,
                                          onClickPreviousPage,
                                          onClickPage,
                                          onClickNextPage,
                                          isPageActive,
                                          pageChanged
                                    }"
                                    @page-changed="onPageChange">
                                          <ul class="flex items-center text-sm text-gray-500 font-bold space-x-1">
                                                <li>
                                                      <button class="button button-sm white" @click="onClickPreviousPage" :disabled="isFirstPage">
                                                            Prev
                                                      </button>
                                                </li>
                                                <li v-if="totalPages >= 4" v-for="(page, i) in pages" :key="i">
                                                      <button type="button" class="button button-sm" @click="onClickPage(page.name)" :class="isPageActive(page.name) ? 'primary' : 'white'" :aria-label="`Go to page ${page.name}`">
                                                            {{ page.name }}
                                                      </button>
                                                </li>
                                                <li v-if="totalPages >= 4" v-show="page < totalPages - 1">
                                                      <span class="text-gray-400 px-2">...</span>
                                                </li>
                                                <li v-if="totalPages >= 4" v-show="page < totalPages - 1">
                                                      <button type="button" class="button button-sm" @click="onClickPage(totalPages)" :disabled="isLastPage" :class="isPageActive(isLastPage) ? 'primary' : 'white'" :aria-label="`Go to page ${totalPages}`">
                                                            {{ totalPages }}
                                                      </button>
                                                </li>
                                                <li>
                                                      <button class="button button-sm white" type="button" @click="onClickNextPage" :disabled="isLastPage" aria-label="Next page">
                                                            Next
                                                      </button>
                                                </li>
                                          </ul>
                                    </NavigationPagination>
                              </div>
                        </div>
                        <!-- Sidebar -->
                        <ContainersSidebar />
                  </div>
            </section>
      </main>
</template>

<script setup>
      import { computed, ref } from 'vue';
      import { getListing } from '@/composables/posts';

      const router = useRouter();
      const route = useRoute();

      definePageMeta({
        key: (route) => route.fullPath
      });

      const isCompact = ref(false);

      // Pagination
      const totalPages = 4;
      const page = computed(() => route.query.page || 1);

      const onPageChange = (page) => {
            router.push(`${route.path}?page=${page}`)
      };

      // Fetch posts
      const sorts = ['hot','new','topall','topmonth','topweek','topday','mostcomments','newcomments'];
      const sort = computed(() => {
            return sorts.includes(route.params.sort) ? route.params.sort : 'hot';
      });

      const { items: posts, paginate, pending, error, refresh } = await getListing({
            sort: sort,
            limit: 25,
            page: page
      }, 'posts');

      // Watch for sort change and refetch.
      // const stopWatch = watch(() => route, () => {
      //       console.log('refresh')
      //       currentPage.value = route.query.page;
      //       refresh();
      // });

      // Links for sub navigation.

      const links = [
            { name: 'New Thread', href: '/submit' },
            { name: 'House Rules', href: '/help/rules', target: '_blank' }
      ];

      // Before route changes, stop the watcher.
      // onBeforeRouteLeave(stopWatch);
</script>