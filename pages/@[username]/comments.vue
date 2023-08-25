<template>
	<component v-if="personView" :personView="personView" :comments="comments" type="comment" :is="isRemoved ? ProfileRemoved : Profile"/>
</template>

<script setup>
	// import { baseURL } from '@/server/constants';
	import { useFetchUser } from '@/composables/user';
	import { getListing } from '@/composables/listing';
	import { useCommentsStore } from '@/stores/StoreComments';

	const route = useRoute();

	definePageMeta({
		key: (route) => route.fullPath,
		'hasRepliesDisabled': true
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

	// Comments
	const page = computed(() => route.query.page || 1);
    const limit = computed(() => route.query.limit || 25);

	const commentsStore = useCommentsStore();

	const sorts = ['hot','top','new','old'];
	const sort = computed(() => {
		return sorts.includes(route.query.sort) ? route.query.sort : 'hot';
	});

	const { data: userData, error, pending, refresh } = await useFetchUser(username.value, {
		sort: sort.value,
		limit: limit.value,
		page: page.value,
	});

	const personView = userData.value.person_view;

	if (error.value && error.value.response) {
		throw createError({
			statusCode: 404,
			statusMessage: 'We could not find the page you were looking for. Try better next time.',
			fatal: true
		})
	};

	const isRemoved = computed(() => {
		const u = personView.person;
		return u.is_deleted || u.is_banned;
	});

	/*const { items, totalCount, commentsPaginate, commentsPending, commentsError, commentsRefresh } = await getListing({
		sort: sort.value,
		limit: limit.value,
		page: page.value,
		creator_id: user.value.id,
		format: "list",
	}, 'comments');*/

	//commentsStore.setComments(items.value);
	const totalCount = userData.value.comments_count_total;
	const comments = userData.value.comments;

	const totalPages = computed(() => {
        return Math.ceil(totalCount.value / limit.value || 1);
    });
</script>