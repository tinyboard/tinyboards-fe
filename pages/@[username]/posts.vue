<template>
    <!-- Loading State -->
    <div v-if="userLoading && !user" class="container mx-auto max-w-4xl p-4 pt-16">
        <div class="bg-white dark:bg-gray-950 rounded-md border dark:border-gray-800 p-8 text-center">
            <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading user profile...</h2>
        </div>
    </div>

    <!-- User Profile -->
    <component
        v-else-if="user"
        :user="user"
        :type="'post'"
        :is="canView ? Profile : ProfileRemoved"
    />

    <!-- Error State -->
    <div v-else class="container mx-auto max-w-4xl p-4 pt-16">
        <div class="bg-white dark:bg-gray-950 rounded-md border dark:border-gray-800 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 class="text-xl font-semibold text-red-600 dark:text-red-400">User not found</h2>
            <p class="text-gray-600 dark:text-gray-400 mt-2">The user you're looking for doesn't exist or has been deleted.</p>
        </div>
    </div>
</template>

<script setup>
import { useFetchUser } from "@/composables/user";
import { usePostsStore } from "@/stores/StorePosts";
// import { getListing } from "@/composables/listing"; // Removed - using GraphQL instead
import { useSiteStore } from "@/stores/StoreSite";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { requirePermission } from "@/composables/admin";
import { usePreloadedPosts } from "@/composables/posts";
import { ref } from "vue";

const route = useRoute();
const site = useSiteStore();
const userStore = useLoggedInUser();

definePageMeta({
    alias: ["/@:username/posts"],
    key: (route) => route.fullPath,
    isFooterDisabled: true,
    isLeftNavbarDisabled: true,
    title: "Profile",
});

const title = ref(route.params?.username || 'Profile');

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

const username = computed(() => route.params?.username);

// Query parameters
const page = computed(() => route.query.page || 1);
const limit = computed(() => route.query.limit || 25);

const postsStore = usePostsStore();
postsStore.setQueryParams(route);

// Track loading state for SPA mode
const userLoading = ref(true);

// Fetch user with posts and comments
const { data: userData, error } = await useFetchUser(username.value, {
    withPosts: true,
    withComments: false,
    sort: postsStore.options.sort,
    limit: postsStore.options.limit,
    page: postsStore.options.page,
});

// Mark loading complete
userLoading.value = false;

if (error.value && error.value.response) {
    throw createError({
        statusCode: 404,
        statusMessage:
            "We could not find the page you were looking for. Try better next time.",
        fatal: true,
    });
}

const user = computed(() => userData.value?.user);

if (!user.value) {
    throw createError({
        statusCode: 404,
        statusMessage: "User not found",
        fatal: true,
    });
}

//postsStore.options.userId = user.id;

const { loading, loadMore } = usePreloadedPosts(user.value?.posts || [], user.value?.id);

if (user.value?.isDeleted) {
    title.value = "Deleted Account";
} else if (user.value?.isBanned) {
    title.value = `@${user.value.name}: Suspended`;
} else {
    title.value = `${user.value?.displayName ?? user.value?.name} (@${user.value?.name})`;
}

// Is Self
const isSelf = computed(() => {
    return !!userStore.user && userStore.user.name === user.value?.name;
});

// Admin - can bypass banned page if they have either the content or the users permission
const isAdmin = requirePermission("content") || requirePermission("users");

const canView = computed(() => {
    if (user.value?.isDeleted) {
        return false;
    }

    if (!user.value?.isBanned) {
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
</script>
