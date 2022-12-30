<template>
	<component v-if="user" :user="user" :comments="comments.comments" type="comment" :is="isRemoved ? ProfileRemoved : Profile"/>
</template>

<script setup>
	import { baseURL } from '@/server/constants';
	import { useFetchUser } from '@/composables/user';

	definePageMeta({
		key: (route) => route.fullPath,
		'hasRepliesDisabled': true
	});

	useHead({
		title: `Tinyboards | ${route.query.username}'s profile`,
		meta: [
		{
			property: 'og:title',
			content: `Tinyboards | ${route.query.username}'s profile`
		}
		]
	});

	// Import thread components.
    const Profile = defineAsyncComponent(() => import('@/components/pages/Profile'));
    const ProfileRemoved = defineAsyncComponent(() => import('@/components/pages/ProfileRemoved'));

	const route = useRoute();

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
</script>