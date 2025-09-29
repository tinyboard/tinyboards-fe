<template>
    <component
        v-if="user"
        :user="user"
        type="comment"
        :is="canView ? Profile : ProfileRemoved"
    />
</template>

<script setup>
// import { baseURL } from '@/server/constants';
import { useFetchUser } from "@/composables/user";
// import { getListing } from "@/composables/listing"; // Removed - using GraphQL instead
import { useCommentsStore } from "@/stores/StoreComments";
import { useSiteStore } from "@/stores/StoreSite";
import { useLoggedInUser } from "@/stores/StoreAuth";

const route = useRoute();
const site = useSiteStore();
const userStore = useLoggedInUser();

definePageMeta({
    key: (route) => route.fullPath,
    hasRepliesDisabled: true,
    isFooterDisabled: true,
    isLeftNavbarDisabled: true,
    title: "Profile",
});

// useHead({
// 	title: `${site.name} | ${route.params?.username}'s profile`,
// 	meta: [
// 		{
// 			property: 'og:title',
// 			content: `${site.name} | ${route.params?.username}'s profile`
// 		}
// 	]
// });

// Import thread components.
const Profile = defineAsyncComponent(
    () => import("@/components/pages/Profile"),
);
const ProfileRemoved = defineAsyncComponent(
    () => import("@/components/pages/ProfileRemoved"),
);

// User
const username = computed(() => route.params?.username);

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

// Comments
const page = computed(() => Number(route.query.page) || 1);
const limit = computed(() => Number(route.query.limit) || 25);

const commentsStore = useCommentsStore();

const sorts = ["hot", "top", "new", "old"];
const sort = computed(() => {
    return sorts.includes(route.query.sort) ? route.query.sort : "hot";
});

// Fetch user with posts and comments
const { data: userData, error } = await useFetchUser(username.value, {
    withPosts: false,
    withComments: true,
    sort: sort.value,
    limit: limit.value,
    page: page.value,
});

if (error.value && error.value.response) {
    throw createError({
        statusCode: 404,
        statusMessage:
            "The user you're looking for literally doesn't exist. Check your spelling.",
        fatal: true,
    });
}

const user = computed(() => userData.value?.user);


if (!user) {
    throw createError({
        statusCode: 404,
        statusMessage: "User not found",
        fatal: true,
    });
}

commentsStore.setComments(user?.comments);

if (user.isDeleted) {
    title.value = "Deleted Account";
} else if (user.isBanned) {
    title.value = `@${user.name}: Suspended`;
} else {
    title.value = `${user.displayName ?? user.name} (@${user.name})`;
}

// Is Self
const isSelf = computed(() => {
    return !!userStore.user && userStore.user.name === user.name;
});

// Admin - can bypass banned page if they have either the content or the users permission
const isAdmin = requirePermission("content") || requirePermission("users");

const canView = computed(() => {
    if (user.isDeleted) {
        return false;
    }

    if (!user.isBanned) {
        return true;
    }

    return isSelf.value || isAdmin;
});

/*const { items, totalCount, commentsPaginate, commentsPending, commentsError, commentsRefresh } = await getListing({
	sort: sort.value,
	limit: limit.value,
	page: page.value,
	creator_id: user.value.id,
	format: "list",
}, 'comments');*/

//commentsStore.setComments(items.value);
</script>
