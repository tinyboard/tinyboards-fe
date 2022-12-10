<template>
	<component v-if="user" :user="user" :comments="comments" type="comment" :is="isRemoved ? ProfileRemoved : Profile"/>
</template>

<script setup>
	import { baseURL } from '@/server/constants';
	import { useFetchUser } from '@/composables/user';
	import { useComments } from '@/composables/comments';

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

	// Comments
	const sort = ref(route.query.sort);

	// Fetch search results.
	const { data: comments, commentsPending, commentsError, commentsRefresh } = await useFetch("/comments", {
		query: {
			sort: sort.value,
			creator_id: user.value.id
		},
		baseURL
	});

	watch(() => route.query, () => commentsRefresh());

	// Pagination
	const totalPages = 4;
	const page = computed(() => route.query.page || 1);

	const onPageChange = (page) => {
		router.push(`${route.path}?page=${page}`)
	};

	// Sub navbar links
	const links = [
		{ name: 'Posts', href: `/user/${route.params.username}`},
		{ name: 'Comments', href: `/user/${route.params.username}/comments` }
		]
</script>