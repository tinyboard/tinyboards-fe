<template>
      <main class="flex flex-col pt-12 sm:pt-14">
            <!-- Sub Navigation & Banner -->
            <section class="flex flex-col">
                  <NavigationNavbarSub :links="links" class="sm:order-first"/>
                  <div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
                        <!-- Banner -->
                        <MediaBanner class="col-span-full"/>
                  </div>
            </section>
            <!-- Main Content -->
            <section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
                  <div class="col-span-full flex gap-6">
                        <!-- Main Content -->
                        <div class="w-full">
                              <!-- Loading State -->
                              <div v-if="pending">
                                    Loading...
                              </div>
                              <!-- Feed -->
                              <ContentItemTable v-else-if="posts.length" :posts="posts" title="Hot posts"/>
                              <!-- Error State -->
                              <div v-else-if="error" class="w-full">
                                    <div class="bg-red-500 text-white font-bold sm:rounded px-4 py-2">
                                          Failed to load posts.
                                    </div>
                              </div>
                              <!-- Empty State -->
                              <div v-else class="px-4 py-24 text-center text-gray-400 md:border md:border-dashed md:border-gray-300 md:rounded-md">
                                    There are no posts. This place must be boring.
                              </div>
                        </div>
                        <!-- Sidebar -->
                        <NavigationSidebar />
                  </div>
            </section>
      </main>
</template>

<script setup>
      import { getListing } from '@/composables/posts';

      let sort = useRoute().params.sort ?? 'new';

      let { items: posts, paginate, pending, error, refresh } = await getListing({
            sort: sort,
            limit: 25
      }, "posts");

      const links = [
      { name: 'Hot', href: '/feed' },
      { name: 'Latest', href: '/feed/new' },
      { name: 'Top All', href: '/feed/topall' },
      { name: 'Top Month', href: '/feed/topmonth' },
      { name: 'Top Week', href: '/feed/topweek' },
      { name: 'Top Day', href: '/feed/topday' },
      { name: 'Most Comments', href: '/feed/mostcomments' },
      { name: 'Latest Comments', href: '/feed/newcomments' }
      ];
</script>