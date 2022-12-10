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
                              <div class="flex items-center mb-4 p-2.5 sm:p-4 bg-gray-100 border-b sm:border sm:shadow-inner-white sm:rounded-md">
                                    <MenusSort/>
                                    <div class="ml-auto flex space-x-2">
                                          <button class="ml-auto" @click="isCompact = false">
                                                <!-- Rows Icon -->
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="isCompact ? 'text-gray-500' : 'text-red-500'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                   <rect x="4" y="4" width="16" height="6" rx="2"></rect>
                                                   <rect x="4" y="14" width="16" height="6" rx="2"></rect>
                                                </svg>
                                          </button>
                                          <button class="ml-auto" @click="isCompact = true">
                                                <!-- Cards Icon -->
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="isCompact ? 'text-red-500' : 'text-gray-500'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                   <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                                                   <line x1="4" y1="12" x2="20" y2="12"></line>
                                                </svg>
                                          </button>
                                    </div>
                              </div>
                              <!-- Posts -->
                              <ListsPosts v-once :posts="postsStore.posts" :isCompact="isCompact" :isLoading="pending" :hasError="error"/>
                              <!-- <TablesPosts :posts="posts" :title="sort" :isLoading="pending" :hasError="error"/> -->
                              <!-- Pagination -->
                              <div v-if="posts.length" class="w-full mt-4 px-2.5 sm:px-0">
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
      import { usePostsStore } from '@/stores/StorePosts';
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

      // Posts store
      const postsStore = usePostsStore();

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

      postsStore.posts = posts;

      // Links for sub navigation.

      const links = [
            { name: 'New Thread', href: '/submit' },
            { name: 'House Rules', href: '/help/rules', target: '_blank' }
      ];
</script>