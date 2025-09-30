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
                              <!-- Loading State -->
                              <div v-if="postResult.pending" class="relative w-full">
                                    <div class="w-full sm:p-4 bg-white sm:border sm:shadow-inner-xs sm:rounded">
                                          <div role="status" class="max-w-sm">
                                                <h1>Loading post...</h1>
                                          </div>
                                    </div>
                              </div>
                              <!-- Post Content -->
                              <template v-else-if="postResult.post">
                                    <component :post="postResult.post"
                                          :is="canViewPost ? thread : threadRemoved" />
                                    <LazyContainersCommentSection :post="postResult.post" />
                              </template>
                              <!-- Error State -->
                              <div v-else class="relative w-full">
                                    <div class="w-full sm:p-4 bg-white sm:border sm:shadow-inner-xs sm:rounded">
                                          <div role="status" class="max-w-sm">
                                                <h1>There was an error loading this post.</h1>
                                          </div>
                                    </div>
                              </div>
                        </div>
                        <!-- Sidebar -->
                        <ContainersSidebarThread v-if="postResult.post" :post="postResult.post" />
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

// Post - don't destructure to preserve reactivity with error handling
let postResult;
try {
  postResult = await usePost(postID);

  // Handle authentication errors
  if (postResult.error.value?.isAuthError) {
    // Clear invalid token and redirect to login
    const tokenCookie = useCookie('token');
    tokenCookie.value = null;
    await navigateTo('/login?redirect=' + encodeURIComponent(useRoute().fullPath));
  }
} catch (error) {
  console.error('Error fetching post:', error);
  throw createError({
    status: 500,
    statusText: 'Failed to load post data'
  });
}

// More defensive error checking - only throw error if we have a real error, not just empty data
if (postResult.error.value && postResult.error.value.response && !postResult.data.value) {
      throw createError({
            status: 404,
            statusText: 'We could not find the page you were looking for. Try better next time.'
      })
};

// Set board data in store if boards are enabled and post has board
if (site.enableBoards && postResult.post?.value?.board) {
    boardStore.setBoard(postResult.post.value.board);
}


// If boards are enabled, post.board is not null -> safe to assume not null
title.value = `${postResult.post?.value?.title || 'Unknown Post'} ${site.enableBoards && postResult.post?.value?.board ? '| ' + postResult.post.value.board.name : ''}`;

// if boards are enabled...
if (site.enableBoards && postResult.post?.value?.board?.name) {
      const boardName = postResult.post.value.board.name;
      const params = route.params ?? {};
      const hasBoard = params.hasOwnProperty("board");
      const boardInParams = typeof (params.board) === 'string' ? params.board : '';

      // missing board name from route, or board name is incorrect => redirect to path with correct board name
      if (!hasBoard ||
            (hasBoard && boardInParams.toLowerCase() !== boardName.toLowerCase())) {
            await navigateTo(`/b/${boardName}/p/${postResult.post.value.id}/${postResult.post.value.titleChunk || 'post'}${params.hasOwnProperty("comment") ? "/" + route.params?.comment : ''}`, { redirectCode: 301 });
      }
} else if (route.params?.hasOwnProperty("board")) {
      // if it's there but shouldn't, also redirect
      await navigateTo(`/p/${postResult.post?.value?.id || 'unknown'}/${postResult.post?.value?.titleChunk || 'post'}${route.params?.hasOwnProperty("comment") ? "/" + route.params?.comment : ''}`, { redirectCode: 301 });
}




// Comments
const id = computed(() => {
      return !!route.params?.comment ? route.params?.comment : route.params?.id
});
const type = computed(() => {
      return !!route.params?.comment ? 'comment' : 'post'
})
const sort = ref(route.query?.sort);


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
      if (v && postResult.post?.value?.isRemoved && v.id === postResult.post?.value?.creatorId) {
            return true;
      }

      return !(postResult.post?.value?.isDeleted || postResult.post?.value?.isRemoved);
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

// Document head - SEO and social sharing meta tags
if (postResult.post?.value) {
  const post = postResult.post.value;
  const description = post.body?.substring(0, 160) || post.title;
  const imageUrl = post.thumbnail || post.url;

  useHead({
    title: title.value,
    meta: [
      // Open Graph
      {
        property: 'og:title',
        content: post.title
      },
      {
        property: 'og:description',
        content: description
      },
      {
        property: 'og:type',
        content: 'article'
      },
      {
        property: 'og:url',
        content: `https://${site.domain}/p/${post.id}/${post.titleChunk || 'post'}`
      },
      // Add image if available
      ...(imageUrl ? [{
        property: 'og:image',
        content: imageUrl
      }] : []),
      // Twitter Card
      {
        name: 'twitter:card',
        content: imageUrl ? 'summary_large_image' : 'summary'
      },
      {
        name: 'twitter:title',
        content: post.title
      },
      {
        name: 'twitter:description',
        content: description
      },
      ...(imageUrl ? [{
        name: 'twitter:image',
        content: imageUrl
      }] : []),
      // Standard meta
      {
        name: 'description',
        content: description
      }
    ]
  });
}
</script>