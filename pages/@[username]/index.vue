<template>
    <!-- Loading State -->
    <div v-if="userResult.pending || (!user && !userResult.error)" class="container mx-auto max-w-4xl p-4">
        <div class="bg-white rounded-md border p-8 text-center">
            <h2 class="text-xl font-semibold text-gray-800">Loading user profile...</h2>
        </div>
    </div>
    <!-- User Profile -->
    <component
        v-else-if="user"
        :user="user"
        :moderates="moderates"
        :is="canView ? Profile : ProfileRemoved"
    >
        <template v-slot:content>
            <!-- User Flairs Section -->
            <div v-if="userFlairs && userFlairs.length > 0" class="bg-white border-y sm:border p-4 sm:rounded-md mb-2">
                <h3 class="text-lg text-gray-800 font-semibold mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    <span>User Flairs</span>
                </h3>
                <div class="flex flex-wrap gap-2">
                    <FlairDisplayFlairBadge
                        v-for="flair in userFlairs"
                        :key="flair.id"
                        :flair="flair.flair"
                        size="md"
                        :clickable="false"
                        :removable="false"
                    />
                </div>
            </div>

            <div
                class="flex flex-row justify-between bg-white border-y sm:border p-4 sm:rounded-md mb-2"
            >
                <h3 class="text-lg text-gray-800 font-semibold">
                    Recent Posts
                </h3>
                <NuxtLink :to="`/@${username}/posts`" v-if="username">View All</NuxtLink>
            </div>
            <LazyListsPosts
                v-if="posts?.length"
                :posts="posts"
                :isCompact="!preferCardView"
                :isLoading="userResult.pending"
                :hasError="userResult.error"
            />
            <div v-else class="bg-white rounded-md border p-4 text-gray-400">
                @{{ username || 'Unknown user' }} hasn't made any posts. At all.
            </div>
            <div
                class="flex flex-row justify-between bg-white border-y sm:border p-4 sm:rounded-md mt-4 mb-2"
            >
                <h3 class="text-lg text-gray-800 font-semibold">
                    Recent Comments
                </h3>
                <NuxtLink :to="`/@${username}/comments`" v-if="username">View All</NuxtLink>
            </div>
            <div v-if="comments?.length" class="space-y-4">
                <div v-for="comment in comments" :key="comment.id" class="p-4 bg-white border rounded shadow-sm">
                    <div v-if="comment.post" class="mb-3 pb-2 border-b border-gray-200">
                        <div class="flex items-center gap-2 text-sm mb-1">
                            <span v-if="comment.post.board" class="text-gray-500">in</span>
                            <NuxtLink
                                v-if="comment.post.board"
                                :to="`/b/${comment.post.board.name}`"
                                class="text-green-600 hover:text-green-800 hover:underline font-medium"
                            >
                                {{ comment.post.board.name }}
                            </NuxtLink>
                        </div>
                        <NuxtLink
                            :to="getPostUrl(comment.post)"
                            class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            <strong>{{ comment.post.title }}</strong>
                        </NuxtLink>
                    </div>
                    <div class="mb-3">
                        <p class="text-gray-800 leading-relaxed">{{ comment.body }}</p>
                    </div>
                    <div class="text-xs text-gray-500">
                        {{ new Date(comment.creationDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) }}
                    </div>
                </div>
            </div>
            <div v-else class="bg-white rounded-md border p-4 text-gray-400">
                @{{ username || 'Unknown user' }} hasn't made any comments.
            </div>
        </template>
    </component>
    <!-- Error State -->
    <div v-else class="container mx-auto max-w-4xl p-4">
        <div class="bg-white rounded-md border p-8 text-center">
            <h2 class="text-xl font-semibold text-red-600">User not found</h2>
            <p class="text-gray-600 mt-2">The user you're looking for doesn't exist or has been deleted.</p>
        </div>
    </div>
</template>

<script setup>
import { useFetchUser } from "@/composables/user";
import { usePostsStore } from "@/stores/StorePosts";
import { useCommentsStore } from "@/stores/StoreComments";
import { usePreloadedPosts } from "@/composables/posts";
import { useSiteStore } from "@/stores/StoreSite";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { requirePermission } from "@/composables/admin";
import { ref, computed, watch } from "vue";

const route = useRoute();
const site = useSiteStore();
const userStore = useLoggedInUser();
const commentsStore = useCommentsStore();
const { parseBackendStyle } = useFlairStyle();

definePageMeta({
    alias: ["/@:username/overview", "/user/:username", "/u/:username"],
    key: (route) => route.fullPath,
    isFooterDisabled: true,
    isLeftNavbarDisabled: true,
    title: "Profile"
    //isScrollDisabled: true
});

const title = ref("Loading profile...");

useHead({
    title: title,
    meta: [
        {
            property: "og:title",
            content: title,
        },
    ],
});

// Import thread components.
const Profile = defineAsyncComponent(
    () => import("@/components/pages/Profile"),
);
const ProfileRemoved = defineAsyncComponent(
    () => import("@/components/pages/ProfileRemoved"),
);

const username = computed(() => {
    const param = route.params?.username;
    return typeof param === 'string' ? param : undefined;
});

// Fetch user with posts and comments - don't destructure to preserve reactivity
const userResult = await useFetchUser(username.value, {
    withPosts: true,
    withComments: true,
    sort: "new",
    limit: 5,
    page: 1,
});


// More defensive error checking - only throw error if we have a real error, not just empty data
if (userResult.error.value && userResult.error.value.response && !userResult.data.value) {
    throw createError({
        statusCode: 404,
        statusMessage:
            "The user you're looking for has deleted their account or has never existed at all.",
        fatal: true,
    });
}

// Create reactive computed for user data
const user = computed(() => {
    const userData = userResult.data.value?.user;
    return userData;
});
const moderates = computed(() => user.value?.moderates || []);
const userFlairs = computed(() => {
  const flairs = user.value?.flairs || [];
  // Parse styleConfig for each flair - create new objects to avoid mutation
  return flairs.map(assignment => {
    const originalFlair = assignment.flair;
    const parsedStyle = originalFlair?.styleConfig
      ? parseBackendStyle(originalFlair.styleConfig)
      : parseBackendStyle(null);

    return {
      ...assignment,
      flair: {
        ...originalFlair,
        style: parsedStyle
      }
    };
  });
});

// Update title reactively
watch(user, (newUser) => {
    if (!newUser) {
        title.value = "Loading profile...";
    } else if (newUser.isDeleted) {
        title.value = "Deleted Account";
    } else if (newUser.isBanned) {
        title.value = `@${newUser.name || username.value} - Banned`;
    } else {
        const displayName = newUser.displayName || newUser.name || username.value;
        const userName = newUser.name || username.value;
        title.value = `${displayName} (@${userName})`;
    }
}, { immediate: true });

// Display preferences
const preferCardView = useCookie("preferCardView");
// true by default
preferCardView.value =
    preferCardView.value === undefined ? true : preferCardView.value;

// Is Self
const isSelf = computed(() => {
    return !!userStore.user && userStore.user.name === user?.name;
});

// Admin - can bypass banned page if they have either the content or the users permission
const isAdmin = requirePermission("content") || requirePermission("users");

const canView = computed(() => {
    if (user?.isDeleted) {
        return false;
    }

    if (!user?.isBanned) {
        return true;
    }

    return isSelf.value || isAdmin;
});

/*const { items, totalCount, postsPaginate, postsPending, postsError, postsRefresh } = await getListing({
	sort: sort.value,
	limit: limit.value,
	page: page.value,
	creator_id: user.value.id
}, 'posts');*/

const posts = computed(() => user.value?.posts || []);
const comments = computed(() => {
    const userComments = user.value?.comments || [];
    return userComments;
});

// Watch for changes and update stores
watch(posts, (newPosts) => {
    if (newPosts.length) {
        usePreloadedPosts(newPosts);
    }
}, { immediate: true });

// Helper function to construct post URLs based on postType
const getPostUrl = (post) => {
    // Use urlPath if available
    if (post.urlPath) return post.urlPath;

    const slug = post.slug || post.titleChunk || 'post';
    // Map backend postType to route segment (thread -> threads)
    const typeSegment = post.postType === 'thread' ? 'threads' : 'feed';

    if (site.enableBoards && post.board) {
        return `/b/${post.board.name}/${typeSegment}/${post.id}/${slug}`;
    }

    return `/${typeSegment}/${post.id}/${slug}`;
};

watch(comments, (newComments) => {
    if (newComments.length) {
        commentsStore.setComments(newComments);
    }
}, { immediate: true });
</script>
