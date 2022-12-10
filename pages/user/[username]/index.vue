<template>
	<component v-if="user" :user="user" :posts="postsStore.posts" :is="isRemoved ? ProfileRemoved : Profile"/>
</template>

<script setup>
	import { useFetchUser } from '@/composables/user';
	import { usePostsStore } from '@/stores/StorePosts';
	import { getListing } from '@/composables/posts';

	definePageMeta({
		'alias': ['/user/:username/overview','/user/:username/posts'],
		key: (route) => route.fullPath
	});

	// Import thread components.
    const Profile = defineAsyncComponent(() => import('@/components/pages/Profile'));
    const ProfileRemoved = defineAsyncComponent(() => import('@/components/pages/ProfileRemoved'));

	const route = useRoute();

	// User
	const username = computed(() => route.params.username);

	const { data: user, error, pending, refresh } = await useFetchUser(username.value);

	const isRemoved = computed(() => {
		const u = JSON.parse(JSON.stringify(user.value));
		return u.is_deleted || u.is_banned;
	});

	// Pagination
	const totalPages = 4;
	const page = computed(() => route.query.page || 1);

	const onPageChange = (page) => {
		router.push(`${route.path}?page=${page}`)
	};

	// Posts
	const postsStore = usePostsStore();

	const sorts = ['hot','new','topall','topmonth','topweek','topday','mostcomments','newcomments'];
	const sort = computed(() => {
		return sorts.includes(route.query.sort) ? route.query.sort : 'hot';
	});

	const { items: posts, postsPaginate, postsPending, postsError, postsRefresh } = await getListing({
		sort: sort.value,
		limit: 25,
		page: page.value,
		creator_id: user.value.id
	}, 'posts');

	postsStore.posts = posts;
</script>