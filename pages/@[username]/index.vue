<template>
	<component v-if="personView" :personView="personView" :posts="posts" :totalPages="totalPages" :limit="limit"
		:page="page" :is="canView ? Profile : ProfileRemoved" />
</template>

<script setup>
import { useFetchUser } from '@/composables/user';
import { usePostsStore } from '@/stores/StorePosts';
import { getListing } from '@/composables/listing';
import { useSiteStore } from '@/stores/StoreSite';
import { useLoggedInUser } from '@/stores/StoreAuth';
import { requirePermission } from '@/composables/admin';
import { ref } from "vue";

const route = useRoute();
const site = useSiteStore();
const userStore = useLoggedInUser();

definePageMeta({
	'alias': ['/@:username/overview', '/@:username/posts', '/user/:username', '/u/:username'],
	key: (route) => route.fullPath,
});

const title = ref(route.params.username);

useHead({
	title: title,
	meta: [
		{
			property: 'og:title',
			content: title
		}
	]
});

// Import thread components.
const Profile = defineAsyncComponent(() => import('@/components/pages/Profile'));
const ProfileRemoved = defineAsyncComponent(() => import('@/components/pages/ProfileRemoved'));

const username = computed(() => route.params.username);

// Query parameters
const page = computed(() => route.query.page || 1);
const limit = computed(() => route.query.limit || 25);

const postsStore = usePostsStore();

const sorts = ['hot', 'new', 'topall', 'topmonth', 'topweek', 'topday', 'mostcomments', 'newcomments'];
const sort = computed(() => {
	return sorts.includes(route.query.sort) ? route.query.sort : 'hot';
});

// Fetch user with posts and comments
const { data: userData, error, pending, refresh } = await useFetchUser(username.value, {
	sort: sort.value,
	limit: limit.value,
	page: page.value,
});

if (error.value && error.value.response) {
	throw createError({
		statusCode: 404,
		statusMessage: 'We could not find the page you were looking for. Try better next time.',
		fatal: true
	})
};

const personView = userData.value.person_view;
const user = personView.person;

if (user.is_deleted) {
	title.value = "Deleted Account";
} else if (user.is_banned) {
	title.value = `@${user.name}: Suspended`;
} else {
	title.value = `${user.display_name ?? user.name} (@${user.name})`;
}

// Is Self
const isSelf = computed(() => {
	return !!userStore.user && userStore.user.name === user.name
});

// Admin - can bypass banned page if they have either the content or the users permission
const isAdmin = requirePermission("content") || requirePermission("users");

const canView = computed(() => {
	const u = personView.person;

	if (u.is_deleted) {
		return false;
	}

	if (!u.is_banned) {
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

postsStore.posts = userData.value.posts;
const posts = postsStore.posts;
const totalCount = userData.value.posts_count_total;

const totalPages = computed(() => {
	return Math.ceil(totalCount / limit.value || 1);
});
</script>