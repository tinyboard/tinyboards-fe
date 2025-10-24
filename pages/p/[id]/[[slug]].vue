<template>
      <main id="page-post" class="flex flex-col pt-12 sm:pt-14">
            <!-- Sub Navigation -->
            <section class="hidden md:block">
                  <NavigationNavbarSub :links="links" disableActiveClass />
            </section>
            <!-- Breadcrumbs -->
            <section class="container mx-auto max-w-8xl sm:px-4 md:px-6 mt-4">
                  <NavigationBreadcrumbs
                        :board-slug="postResult.post?.board?.name"
                        :board-name="postResult.post?.board?.title || postResult.post?.board?.name"
                        :current-page="postResult.post?.title"
                  />
            </section>
            <!-- Main Content -->
            <section class="container mx-auto max-w-8xl grid grid-cols-12 md:mt-4 sm:px-4 md:px-6">
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
if (site.enableBoards && postResult.post.value?.board) {
    boardStore.setBoard(postResult.post.value.board);
}


// If boards are enabled, post.board is not null -> safe to assume not null
title.value = `${postResult.post.value?.title || 'Unknown Post'} ${site.enableBoards && postResult.post.value?.board ? '| ' + postResult.post.value.board.name : ''}`;

// Redirect to canonical URL using urlPath if available
if (postResult.post.value?.urlPath) {
      const canonicalPath = postResult.post.value.urlPath;
      const params = route.params ?? {};
      const currentPath = route.path;

      // Add comment ID if present
      const commentSuffix = params.hasOwnProperty("comment") ? "/" + route.params?.comment : '';
      const fullCanonicalPath = canonicalPath + commentSuffix;

      // Redirect if current path doesn't match canonical path
      if (currentPath !== fullCanonicalPath && currentPath !== canonicalPath) {
            await navigateTo(fullCanonicalPath, { redirectCode: 301 });
      }
}
// Fallback: if boards are enabled but no urlPath...
else if (site.enableBoards && postResult.post.value?.board?.name) {
      const boardName = postResult.post.value.board.name;
      const params = route.params ?? {};
      const hasBoard = params.hasOwnProperty("board");
      const boardInParams = typeof (params.board) === 'string' ? params.board : '';
      const slug = postResult.post.value.slug || postResult.post.value.titleChunk || 'post';

      // missing board name from route, or board name is incorrect => redirect to path with correct board name
      if (!hasBoard ||
            (hasBoard && boardInParams.toLowerCase() !== boardName.toLowerCase())) {
            await navigateTo(`/b/${boardName}/p/${postResult.post.value.id}/${slug}${params.hasOwnProperty("comment") ? "/" + route.params?.comment : ''}`, { redirectCode: 301 });
      }
} else if (route.params?.hasOwnProperty("board")) {
      // if it's there but shouldn't, also redirect
      const slug = postResult.post.value?.slug || postResult.post.value?.titleChunk || 'post';
      await navigateTo(`/p/${postResult.post.value?.id || 'unknown'}/${slug}${route.params?.hasOwnProperty("comment") ? "/" + route.params?.comment : ''}`, { redirectCode: 301 });
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
      if (v && postResult.post.value?.isRemoved && v.id === postResult.post.value?.creatorId) {
            return true;
      }

      return !(postResult.post.value?.isDeleted || postResult.post.value?.isRemoved);
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
if (postResult.post.value) {
  const post = postResult.post.value;

  // Strip HTML tags and get plain text description
  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '') || '';
  const description = post.body ? stripHtml(post.body).substring(0, 200) : post.title;

  // Determine media type and URL
  const isVideo = post.image && /\.(mp4|webm|mov|3gp|m4v|mpeg|mpg|ogv|avi|mkv)$/i.test(post.image);
  const isImage = post.image && /\.(jpe?g|png|gif|webp)$/i.test(post.image);
  const mediaUrl = post.image || post.thumbnailUrl || post.url;

  // Build full URL for sharing using canonical urlPath
  const config = useRuntimeConfig();
  const protocol = config.public.useHttps === 'true' ? 'https' : 'http';
  const canonicalPath = post.urlPath || (site.enableBoards && post.board
    ? `/b/${post.board.name}/p/${post.id}/${post.slug || post.titleChunk || 'post'}`
    : `/p/${post.id}/${post.slug || post.titleChunk || 'post'}`);
  const fullUrl = `${protocol}://${site.domain}${canonicalPath}`;

  const metaTags = [
    // Open Graph - Basic
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
      content: fullUrl
    },
    {
      property: 'og:site_name',
      content: site.name || 'TinyBoards'
    },
  ];

  // Add video-specific meta tags for Discord/social media
  if (isVideo && mediaUrl) {
    metaTags.push(
      {
        property: 'og:video',
        content: mediaUrl
      },
      {
        property: 'og:video:url',
        content: mediaUrl
      },
      {
        property: 'og:video:secure_url',
        content: mediaUrl
      },
      {
        property: 'og:video:type',
        content: 'video/mp4' // Discord works best with mp4 declaration
      },
      {
        property: 'og:video:width',
        content: '1280'
      },
      {
        property: 'og:video:height',
        content: '720'
      }
    );
  }
  // Add image meta tags
  else if (mediaUrl) {
    metaTags.push(
      {
        property: 'og:image',
        content: mediaUrl
      },
      {
        property: 'og:image:url',
        content: mediaUrl
      },
      {
        property: 'og:image:secure_url',
        content: mediaUrl
      },
      {
        property: 'og:image:type',
        content: isImage ? 'image/jpeg' : undefined
      },
      {
        property: 'og:image:width',
        content: '1200'
      },
      {
        property: 'og:image:height',
        content: '630'
      }
    );
  }

  // Twitter Card
  metaTags.push(
    {
      name: 'twitter:card',
      content: isVideo ? 'player' : (mediaUrl ? 'summary_large_image' : 'summary')
    },
    {
      name: 'twitter:title',
      content: post.title
    },
    {
      name: 'twitter:description',
      content: description
    }
  );

  if (isVideo && mediaUrl) {
    metaTags.push(
      {
        name: 'twitter:player',
        content: mediaUrl
      },
      {
        name: 'twitter:player:width',
        content: '1280'
      },
      {
        name: 'twitter:player:height',
        content: '720'
      }
    );
  } else if (mediaUrl) {
    metaTags.push({
      name: 'twitter:image',
      content: mediaUrl
    });
  }

  // Standard meta
  metaTags.push(
    {
      name: 'description',
      content: description
    },
    // Discord-specific
    {
      name: 'theme-color',
      content: post.board?.primaryColor ? `rgb(${post.board.primaryColor})` : '#3C6991'
    }
  );

  // Article meta
  if (post.creationDate) {
    metaTags.push({
      property: 'article:published_time',
      content: new Date(post.creationDate).toISOString()
    });
  }

  if (post.updated) {
    metaTags.push({
      property: 'article:modified_time',
      content: new Date(post.updated).toISOString()
    });
  }

  if (post.creator?.name) {
    metaTags.push({
      property: 'article:author',
      content: post.creator.name
    });
  }

  useHead({
    title: title.value,
    meta: metaTags.filter(tag => tag.content !== undefined)
  });
}
</script>