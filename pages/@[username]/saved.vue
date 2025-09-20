<template>
    <component
        v-if="user"
        :user="user"
        type="saved"
        :is="canView ? Profile : ProfileRemoved"
    />
</template>

<script setup>
import { useFetchUser } from "@/composables/user";
import { usePostsStore } from "@/stores/StorePosts";
import { useSiteStore } from "@/stores/StoreSite";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { requirePermission } from "@/composables/admin";
import { ref } from "vue";

const route = useRoute();
const site = useSiteStore();
const userStore = useLoggedInUser();

definePageMeta({
    alias: ["/@:username/saved"],
    key: (route) => route.fullPath,
    isFooterDisabled: true,
    isLeftNavbarDisabled: true,
    title: "Saved Posts",
    hasAuthRequired: true
});

const title = ref(`${route.params?.username} - Saved Posts`);

useHead({
    title: title,
    meta: [
        {
            property: "og:title",
            content: title,
        },
    ],
});

// Import profile components
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

// Fetch saved posts using listPosts with savedOnly flag
const { data: savedPostsData, error: savedError, pending: savedPending } = await useAsyncGql({
    operation: 'listPosts',
    variables: {
        listingType: 'All',
        sort: postsStore.options.sort || 'New',
        page: postsStore.options.page,
        limit: postsStore.options.limit,
        savedOnly: true,
        includeBoard: site.enableBoards
    }
});

// Fetch user info separately since saved posts are for the current user
const { data: userData, error } = await useFetchUser(username.value, {
    withPosts: false,
    withComments: false
});

if (error.value && error.value.response) {
    throw createError({
        statusCode: 404,
        statusMessage:
            "The user you're looking for literally doesn't exist. Check your spelling.",
        fatal: true,
    });
}

const user = userData.value?.user;

// Is Self - only show saved posts to the owner
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
        return isSelf.value; // Only show saved posts to owner
    }

    return (isSelf.value || isAdmin) && isSelf.value; // Admin still needs to be the owner
});

if (user?.isDeleted) {
    title.value = "Deleted Account";
} else if (user?.isBanned) {
    title.value = `@${user.name}: Suspended`;
} else {
    title.value = `${user.displayName ?? user.name} (@${user.name}) - Saved Posts`;
}

// Check if current user is viewing their own saved posts
if (!isSelf.value) {
    throw createError({
        statusCode: 403,
        statusMessage: "You can only view your own saved posts.",
        fatal: true,
    });
}

// Add saved posts to the user object for the Profile component
if (user && savedPostsData.value?.listPosts) {
    user.savedPosts = savedPostsData.value.listPosts;
}
</script>