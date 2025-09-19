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
                              <component v-if="staticPost" :post="staticPost" :comments="comments"
                                    :is="canViewPost ? thread : threadRemoved" />
                              <LazyContainersCommentSection v-if="staticPost" :post="staticPost" :comments="comments" />
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
                        <ContainersSidebarThread v-if="post?.value" :post="post.value" />
                  </div>
            </section>
      </main>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue';
// import { baseURL } from "@/server/constants";
import { usePostsStore } from '@/stores/StorePosts';
import { usePost } from '@/composables/post';
import { useSiteStore } from '@/stores/StoreSite';
import { useBoardStore } from '@/stores/StoreBoard';
import { useLoggedInUser } from "@/stores/StoreAuth";
import { requirePermission } from "@/composables/admin";
import { requireModPermission } from "@/composables/mod";

const title = ref("Post");

definePageMeta({
      key: (route) => route.fullPath
});

useHead({
      title: title
});

const route = useRoute();
const router = useRouter();
const site = useSiteStore();
const boardStore = useBoardStore();
const userStore = useLoggedInUser();
const modPermissions = boardStore.board?.myModPermissions;

// Import thread components.
const thread = defineAsyncComponent(() => import('@/components/containers/Thread.vue'));
const threadRemoved = defineAsyncComponent(() => import('@/components/containers/ThreadRemoved.vue'));

// Posts store
const postsStore = usePostsStore();

const isAuthed = userStore.isAuthed;
const v = userStore.user;

let postID: number = NaN;
if (typeof (route.params?.id) === 'string') {
      postID = parseInt(route.params?.id ?? '');
}

// handle invalid post ID
if (Number.isNaN(postID)) {
      throw createError({
            status: 400,
            statusText: "Bad post ID given. Do better."
      });
}

// Post
let { post, error, data } = await usePost(postID);

// Use staticPost approach to avoid hydration issues with computed refs
const staticPost = ref(null);
watch(() => data.value, (newDataValue) => {
  if (newDataValue?.post && !staticPost.value) {
    const postData = { ...newDataValue.post };

    // Fix media URLs to use correct backend domain/port
    const config = useRuntimeConfig();
    const backendUrl = `${config.public.useHttps ? 'https' : 'http'}://${config.public.domain}`;

    if (postData.url && postData.url.includes('/media/')) {
      // Extract just the media path and prepend correct backend URL
      const mediaPath = postData.url.substring(postData.url.indexOf('/media/'));
      postData.url = backendUrl + mediaPath;
    }
    if (postData.image && postData.image.includes('/media/')) {
      // Extract just the media path and prepend correct backend URL
      const mediaPath = postData.image.substring(postData.image.indexOf('/media/'));
      postData.image = backendUrl + mediaPath;
    }

    staticPost.value = postData;
  }
}, { immediate: true });

if (error.value && error.value.response) {
      throw createError({
            status: 404,
            statusText: 'We could not find the page you were looking for. Try better next time.'
      })
};

// Also check if post is null/undefined
if (!post || !post.value) {
      throw createError({
            status: 404,
            statusText: 'Post not found.'
      })
};

// Set board data in store if boards are enabled and post has board
if (site.enableBoards && post?.value?.board) {
    boardStore.setBoard(post.value.board);
}

// quick reference to comments
let comments = post?.value?.comments || [];

// If boards are enabled, post.board is not null -> safe to assume not null
title.value = `${post?.value?.title || 'Unknown Post'} ${site.enableBoards && post?.value?.board ? '| +' + post.value.board.name : ''}`;

// if boards are enabled...
if (site.enableBoards && post?.value?.board?.name) {
      const boardName = post.value.board.name;
      const params = route.params ?? {};
      const hasBoard = params.hasOwnProperty("board");
      const boardInParams = typeof (params.board) === 'string' ? params.board : '';

      // missing board name from route, or board name is incorrect => redirect to path with correct board name
      if (!hasBoard ||
            (hasBoard && boardInParams.toLowerCase() !== boardName.toLowerCase())) {
            await navigateTo(`/b/${boardName}/p/${post.value.id}/${post.value.titleChunk}${params.hasOwnProperty("comment") ? "/" + route.params?.comment : ''}`, { redirectCode: 301 });
      }
} else if (route.params?.hasOwnProperty("board")) {
      // if it's there but shouldn't, also redirect
      await navigateTo(`/p/${post?.value?.id || 'unknown'}/${post?.value?.titleChunk || 'unknown'}${route.params?.hasOwnProperty("comment") ? "/" + route.params?.comment : ''}`, { redirectCode: 301 });
}




// Comments
const id = computed(() => {
      return !!route.params?.comment ? route.params?.comment : route.params?.id
});
const type = computed(() => {
      return !!route.params?.comment ? 'comment' : 'post'
})
const sort = ref(route.query?.sort);

const onCommentPublished = (comment: Comment) => {
      comments.unshift(comment);
};

/*
 * Whether the user can see this post.
 *
 * Admins: see everything
 * Mods: can see removed posts, deleted content is hidden
 * Logged in regular user: can view their own removed content only
 * Everyone else: removed and deleted posts are unavailable
 */
const canViewPost = computed(() => {
      // Admin or mod
      if (
            requirePermission("content") ||
            requireModPermission(modPermissions, "content")
      ) {
            return true;
      }

      // Own post
      if (v && post?.value?.isRemoved && v.id === post?.value?.creatorId) {
            return true;
      }

      return !(post?.value?.isDeleted || post?.value?.isRemoved);
});

/*const { comments, commentsPending, commentsError, commentsRefresh } = await useComments(id.value, type.value, route.query, route.params?.id);

if (type.value === 'comment' && commentsError.value && commentsError.value.response) {
      throw createError({
            statusCode: 404,
            statusMessage: 'We could not find the page you were looking for. Try better next time.',
            fatal: true
      })
};

watch(() => route.query, () => commentsRefresh());*/

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