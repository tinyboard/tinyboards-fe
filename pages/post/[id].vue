<template>
      <main id="page-post" class="flex flex-col pt-12 sm:pt-14">
            <!-- Sub Navigation -->
            <section class="hidden md:block">
                  <NavigationNavbarSub :links="links" disableActiveClass />
            </section>
            <!-- Main Content -->
            <section class="container mx-auto max-w-8xl grid grid-cols-12 md:mt-10 sm:px-4 md:px-6">
                  <div class="col-span-full flex gap-6 sm:py-6">
                        <!-- Thread -->
                        <div class="relative w-full">
                              <component v-if="item" :item="item" :comments="comments"
                                    :is="item.post.is_deleted ? threadDeleted : thread" />
                              <!-- Error -->
                              <div v-else class="relative w-full">
                                    <div class="w-full sm:p-4 bg-white sm:border sm:shadow-inner-xs sm:rounded">
                                          <div role="status" class="max-w-sm">
                                                <h1>There was an error.</h1>
                                          </div>
                                    </div>
                              </div>
                        </div>
                        <!-- Sidebar -->
                        <ContainersSidebarThread :item="item" :stats="stats" />
                  </div>
            </section>
      </main>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';
// import { baseURL } from "@/server/constants";
import { usePostsStore } from '@/stores/StorePosts';
import { usePost } from '@/composables/post';
import { useComments } from '@/composables/comments';
import { useSiteStore } from '@/stores/StoreSite';
import { useBoardStore } from '@/stores/StoreBoard';

const title = ref("Post");

definePageMeta({
      alias: ['/post/:id/:chunk?', '/+:board?/post/:id/:chunk?', '/+:board?/p/:id/:chunk/:comment?', '/p/:id/:chunk/:comment?', '/+:board?/post/:id/:chunk/:comment?', '/post/:id/:chunk/:comment?'],
      key: (route) => route.fullPath
});

useHead({
      title: title
});

const route = useRoute();
const router = useRouter();
const site = useSiteStore();
const boardStore = useBoardStore();

// Import thread components.
const thread = defineAsyncComponent(() => import('@/components/containers/Thread'));
const threadDeleted = defineAsyncComponent(() => import('@/components/containers/ThreadDeleted'));

// Posts store
const postsStore = usePostsStore();

// Post
let { item, pending, error, refresh } = await usePost(route.params.id);

if (error.value && error.value.response) {
      throw createError({
            statusCode: 404,
            statusMessage: 'We could not find the page you were looking for. Try better next time.',
            fatal: true
      })
};

title.value = `${item.value.post_view.post.title} ${site.enableBoards ? '| +' + item.value.board_view.board.name : ''}`;

// if boards are enabled...
if (site.enableBoards) {
      const boardName = item.value.board_view.board.name;
      const params = route.params;
      const hasBoard = params.hasOwnProperty("board");
      console.log(boardName);
      // ...and the `+board` is not present, or is incorrect, redirect correctly
      if (!hasBoard ||
            (hasBoard && params.board.toLowerCase() !== boardName.toLowerCase())) {
            router.push(`/+${boardName}/post/${item.value.post_view.post.id}/${item.value.post_view.post.title_chunk}${params.hasOwnProperty("comment") ? "/" + route.params.comment : ''}`);
      }

      /*if(!hasBoard) {
            router.push(`/+${boardName}/post/${item.value.post_view.post.id}${params.hasOwnProperty("comment") ? "/" + route.params.comment : ''}`);
      }

      if(hasBoard && params.board.toLowerCase() !== boardName.toLowerCase()) {
            router.push(`/+${boardName}/post/${item.value.post_view.post.id}${params.hasOwnProperty("comment") ? "/" + route.params.comment : ''}`);
      }*/
} else if (route.params.hasOwnProperty("board")) {
      // if it's there but shouldn't, also redirect
      router.push(`/post/${item.value.post_view.post.id}/${item.value.post_view.post.title_chunk}${route.params.hasOwnProperty("comment") ? "/" + route.params.comment : ''}`);
}


// Author stats
const stats = ref(null);
stats.value = item.value.author_counts;

postsStore.posts = [item.value.post_view];
item = computed(() => postsStore.getPost(route.params.id));

// Comments
const id = computed(() => {
      return !!route.params.comment ? route.params.comment : route.params.id
});
const type = computed(() => {
      return !!route.params.comment ? 'comment' : 'post'
})
const sort = ref(route.query.sort);

const { comments, commentsPending, commentsError, commentsRefresh } = await useComments(id.value, type.value, route.query, route.params.id);

if (type.value === 'comment' && commentsError.value && commentsError.value.response) {
      throw createError({
            statusCode: 404,
            statusMessage: 'We could not find the page you were looking for. Try better next time.',
            fatal: true
      })
};

watch(() => route.query, () => commentsRefresh());

// Links
const links = [{ name: 'Comments', href: '#comments' }];

// Document head
// useHead({
//       title: `${site.name} | ${item.value.post.title}`,
//       meta: [
//             {
//                   property: 'og:title',
//                   content: `${site.name} | ${item.value.post.title}`
//             },
//             {
//                   name: 'og:description',
//                   content: item.value.post.body.substring(0, 60)
//             },
//             {
//                   name: 'description',
//                   content: item.value.post.body.substring(0, 160)
//             }
//       ]
// });
</script>