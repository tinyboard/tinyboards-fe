<template>
    <component
        v-if="user"
        :user="user"
        :type="'post'"
        :is="canView ? Profile : ProfileRemoved"
    />
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

// Fetch user with posts and comments
const { data: userData, error } = await useFetchUser(username.value, {
    withPosts: true,
    withComments: false,
    sort: postsStore.options.sort,
    limit: postsStore.options.limit,
    page: postsStore.options.page,
});

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
