<template>
    <component
        v-if="user"
        :user="user"
        :moderates="moderates"
        :is="canView ? Profile : ProfileRemoved"
    >
        <template v-slot:content>
            <div
                class="flex flex-row justify-between bg-white border-y sm:border p-4 sm:rounded-md mb-2"
            >
                <h3 class="text-lg text-gray-800 font-semibold">
                    Recent Posts
                </h3>
                <NuxtLink :to="`/@${username}/posts`">View All</NuxtLink>
            </div>
            <LazyListsPosts
                v-if="posts?.length"
                :posts="posts"
                :isCompact="!preferCardView"
                :isLoading="pending"
                :hasError="error"
            />
            <div v-else class="bg-white rounded-md border p-4 text-gray-400">
                @{{ username }} hasn't made any posts. At all.
            </div>
            <div
                class="flex flex-row justify-between bg-white border-y sm:border p-4 sm:rounded-md mt-4 mb-2"
            >
                <h3 class="text-lg text-gray-800 font-semibold">
                    Recent Comments
                </h3>
                <NuxtLink :to="`/@${username}/comments`">View All</NuxtLink>
            </div>
            <LazyListsComments
                v-if="comments?.length"
                :comments="comments"
                :cards="true"
            />
            <div v-else class="bg-white rounded-md border p-4 text-gray-400">
                @{{ username }} hasn't made any comments.
            </div>
        </template>
    </component>
</template>

<script setup>
import { useFetchUser } from "@/composables/user";
import { usePostsStore } from "@/stores/StorePosts";
import { getListing } from "@/composables/listing";
import { useSiteStore } from "@/stores/StoreSite";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { requirePermission } from "@/composables/admin";
import { ref } from "vue";

const route = useRoute();
const site = useSiteStore();
const userStore = useLoggedInUser();

definePageMeta({
    alias: ["/@:username/overview", "/user/:username", "/u/:username"],
    key: (route) => route.fullPath,
    isFooterDisabled: true,
    isLeftNavbarDisabled: true,
    title: "Profile",
    //isScrollDisabled: true
});

const title = ref(route.params.username);

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

const username = computed(() => route.params.username);

// Fetch user with posts and comments
const { data: userData, error } = await useFetchUser(username.value, {
    withPosts: true,
    withComments: true,
    sort: "new",
    limit: 5,
    page: 1,
});

if (error.value && error.value.response) {
    throw createError({
        statusCode: 404,
        statusMessage:
            "The user you're looking for has deleted their account or has never existed at all.",
        fatal: true,
    });
}

/*if (error) {
    throw createError({
        statusCode: 500,
        statusMessage: "Well shit.",
        fatal: true,
    });
}*/

//const personView = userData.value.person_view;
const user = userData.value?.user;
const moderates = user.moderates;

if (user.isDeleted) {
    title.value = "Deleted Account";
} else if (user.isBanned) {
    title.value = `@${user.name}: Suspended`;
} else {
    title.value = `${user.displayName ?? user.name} (@${user.name})`;
}

// Display preferences
const preferCardView = useCookie("preferCardView");
// true by default
preferCardView.value =
    preferCardView.value === undefined ? true : preferCardView.value;

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

/*const { items, totalCount, postsPaginate, postsPending, postsError, postsRefresh } = await getListing({
	sort: sort.value,
	limit: limit.value,
	page: page.value,
	creator_id: user.value.id
}, 'posts');*/

const posts = user.posts;
const comments = user.comments;
</script>
