<template>
	<component v-if="user" :user="user" :posts="posts" :totalPages="totalPages" :limit="limit" :page="page" :is="isRemoved ? ProfileRemoved : Profile"/>
</template>

<script setup>
	import { useFetchUser } from '@/composables/user';
	import { usePostsStore } from '@/stores/StorePosts';
	import { getListing } from '@/composables/listing';

	const route = useRoute();

	definePageMeta({
		'alias': ['/@:username/overview','/@:username/posts', '/user/:username', '/u/:username'],
		key: (route) => route.fullPath,
	});

	useHead({
		title: `Tinyboards | ${route.params.username}'s profile`,
		meta: [
		{
			property: 'og:title',
			content: `Tinyboards | ${route.params.username}'s profile`
		}
		]
	});

	// Import thread components.
    const Profile = defineAsyncComponent(() => import('@/components/pages/Profile'));
    const ProfileRemoved = defineAsyncComponent(() => import('@/components/pages/ProfileRemoved'));

	// User
	const username = computed(() => route.params.username);

	const { data: user, error, pending, refresh } = await useFetchUser(username.value);

	if (error.value && error.value.response) {
		throw createError({
			statusCode: 404,
			statusMessage: 'We could not find the page you were looking for. Try better next time.',
			fatal: true
		})
	};

	const isRemoved = computed(() => {
		const u = JSON.parse(JSON.stringify(user.value));
		return u.is_deleted || u.is_banned;
	});

	// Posts
	const page = computed(() => route.query.page || 1);
    const limit = computed(() => route.query.limit || 25);

	const postsStore = usePostsStore();

	const sorts = ['hot','new','topall','topmonth','topweek','topday','mostcomments','newcomments'];
	const sort = computed(() => {
		return sorts.includes(route.query.sort) ? route.query.sort : 'hot';
	});

	const { items, totalCount, postsPaginate, postsPending, postsError, postsRefresh } = await getListing({
		sort: sort.value,
		limit: limit.value,
		page: page.value,
		creator_id: user.value.id
	}, 'posts');

	postsStore.posts = items;
	const posts = postsStore.posts;

	const totalPages = computed(() => {
        return Math.ceil(totalCount.value / limit.value || 1);
    });
</script>