<template>
      <main class="flex flex-col pt-12 sm:pt-14">
            <!-- Sub Navigation & Banner -->
            <section class="hidden md:flex flex-col">
                  <NavigationNavbarSub :links="links" class="sm:order-first"/>
                  <div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
                        <!-- Banner -->
                        <CardsBanner
                        :title="route.params.board ?? 'Feed'"
                        :sub-title="route.params.board ? 'Board description goes here' : 'The front-page. All your posts are belong to us.'"
                        image-url="https://i.imgur.com/TV07zoE.jpeg"
                        class="col-span-full"
                        />
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
                              <ListsPosts v-if="posts?.length" :posts="posts" :isCompact="isCompact" :isLoading="pending" :hasError="error"/>
                              <!-- Empty State -->
                              <div v-else class="px-4 py-24 text-center text-gray-500 bg-white border-y sm:border sm:rounded-md sm:shadow-inner-xs">
                                    <p>
                                          <span class="font-medium">
                                                There are not posts at this time.
                                          </span>
                                          <br/>
                                          Try posting something yourself
                                    </p>
                              </div>
                              <!-- Pagination -->
                              <div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
                                    <NavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page"/>
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
        'alias': ['/b/:board?/feed/:sort?','/b/:board?/:sort?'],
        key: (route) => route.fullPath
      });

      const isCompact = ref(false);

      // Pagination
      const page = computed(() => Number.parseInt(route.query.page) || 1);
      const limit = computed(() => Number.parseInt(route.query.limit) || 25);

      // Posts
      const postsStore = usePostsStore();

      const sorts = ['hot','new','topall','topmonth','topweek','topday','mostcomments','newcomments'];
      const sort = computed(() => {
            return sorts.includes(route.params.sort) ? route.params.sort : 'hot';
      });

      const { items, totalCount, paginate, pending, error, refresh } = await getListing({
            sort: sort.value,
            limit: limit.value,
            page: page.value
      }, 'posts');

      if (error.value && error.value.response) {
            throw createError({
                  statusCode: 404,
                  statusMessage: 'We could not find the page you were looking for. Try better next time.',
                  fatal: true
            })
      };

      postsStore.posts = items;
      const posts = postsStore.posts;

      const totalPages = computed(() => {
            return Math.ceil(totalCount.value / limit.value || 1);
      });

      // Links for sub navbar
      const links = [
            { name: 'New Thread', href: '/submit' },
            { name: 'House Rules', href: '/help/rules', target: '_blank' }
            ];
</script>