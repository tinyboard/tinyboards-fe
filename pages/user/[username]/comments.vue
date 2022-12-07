<template>
	<component v-if="user" :user="user" :is="isRemoved ? ProfileRemoved : Profile"/>
</template>

<script setup>
	import { useFetchUser } from '@/composables/user';
	import { getListing } from '@/composables/posts';

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

	// Sub navbar links
	const links = [
		{ name: 'Overview', href: `/user/${route.params.username}`},
		{ name: 'Posts', href: `/user/${route.params.username}/posts` },
		{ name: 'Comments', href: `/user/${route.params.username}/comments` }
		]
</script>