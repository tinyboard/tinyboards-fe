<template>
      <main class="flex flex-col pt-12 sm:pt-14">
            <!-- Sub Navigation -->
            <section class="hidden md:block">
                  <NavigationNavbarSub :links="links" disableActiveClass/>
            </section>
            <!-- Main Content -->
            <section class="container mx-auto max-w-8xl grid grid-cols-12 md:mt-10 sm:px-4 md:px-6">
             <div class="col-span-full flex gap-6 sm:py-6">
                  <!-- Thread -->
                  <div class="relative w-full">
                        <component v-if="item" :item="item" :comments="comments" :is="item.post.deleted ? threadDeleted : thread"/>
                        <!-- Banned -->
                        <!-- <ContentThreadBanned v-else-if="item && item.post.banned" :item="item" :comments="comments"/> -->
                        <!-- Error -->
                        <div v-else class="relative w-full">
                              <div class="w-full sm:p-4 bg-white sm:border sm:shadow-inner-xs sm:rounded-md">
                                    <div role="status" class="max-w-sm animate-pulse">
                                          <h1>There was an error.</h1>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <!-- Sidebar -->
                  <ContainersSidebarThread :item="item" />
            </div>
      </section>
</main>
</template>

<script setup>
      import { computed, defineAsyncComponent, ref } from 'vue';
      import { baseURL } from "@/server/constants";
      import { usePost } from '@/composables/post';
      import { usePostComments } from '@/composables/comments';

      definePageMeta({
            key: (route) => route.fullPath,
            alias: '/post/:id/:comment'
      });

      let route = useRoute();

      // Import thread components.
      const thread = defineAsyncComponent(() => import('@/components/containers/Thread'));
      const threadDeleted = defineAsyncComponent(() => import('@/components/containers/ThreadDeleted'));

      // Post
      let { item, pending, error, refresh } = await usePost(route.params.id);
      
      let post = null;

      if (!error.value) {
            item = item.value.post_view;
            post = item.post;
      } else {
            console.error(`Error: ${error.value}`);
      };

      // Comments
      const sort = ref(route.query.sort);
      const type = computed(() => {
            return route.params.comment ? 'comment' : 'post'
      })

      const { comments, commentsPending, commentsError, commentsRefresh } = await usePostComments(route.params.id, { sort: sort.value });

      watch(() => route.query, () => commentsRefresh());

      // Sub Navigation Links
      const links = [{ name: 'Comments', href: '#comments' }];
</script>