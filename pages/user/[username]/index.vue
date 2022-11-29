<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation -->
		<section v-if="!error">
			<NavigationNavbarSub :links="links"/>
		</section>
		<!-- No User State -->
		<section v-if="error" class="container mx-auto my-24 px-4 flex justify-center">
			<div class="text-center">
				<h1 class="text-5xl font-bold text-gray-900">404</h1>
				<p class="mt-1 text-xl font-bold">The user you are looking for is an unperson</p>
				<p class="mt-2 text-gray-700">You are likely seeing this because you typed the username manually and made a typo. Please do better next time.</p>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
			<!-- Profile Details -->
			<component v-if="user" :user="user" :is="user.is_deleted ? ProfileDeleted : Profile"/>
		</section>
		<!-- User Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
			<div class="col-span-full flex gap-6">
				<div class="w-full">
					<!-- Posts -->
					<TablesPosts v-if="type !== 'comment' && posts.length" :posts="posts" :title="sort" :isLoading="pending"/>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
	import { useFetchUser } from '@/composables/user';
	import { getListing } from '@/composables/posts';

	definePageMeta({
		'alias': '/user/:username/overview'
	});

	const route = useRoute();

	// Import profile components.
	const Profile = defineAsyncComponent(() => import('@/components/containers/Profile'));
    // const ProfileDeleted = defineAsyncComponent(() => import('@/components/containers/ProfileDeleted'));
    // const ProfileRemoved = defineAsyncComponent(() => import('@/components/containers/ProfileRemoved'));

	// User
	const username = computed(() => route.params.username);

	const { data: user, error, pending, refresh } = await useFetchUser(username.value);

	const reputation = computed(() => {
		const u = JSON.parse(JSON.stringify(user.value));
		const score = u.posts_score + u.comments_score;
		const count = u.posts_count + u.comments_count;
		const num = score / count * 100
		if (!isFinite(num)) return 0;
		return num.toFixed(0);
	});

	// Pagination
	const totalPages = 4;
	const page = computed(() => route.query.page || 1);

	const onPageChange = (page) => {
		router.push(`${route.path}?page=${page}`)
	};

	// Posts
	const sorts = ['hot','new','topall','topmonth','topweek','topday','mostcomments','newcomments'];
	const sort = computed(() => {
		return sorts.includes(route.params.sort) ? route.params.sort : 'hot';
	});

	const { items: posts, postsPaginate, postsPending, postsError, postsRefresh } = await getListing({
		sort: sort,
		limit: 25,
		page: page
	}, 'posts');

	// Sub navbar links
	const links = [
		{ name: 'Overview', href: `/user/${route.params.username}`},
		{ name: 'Posts', href: `/user/${route.params.username}/posts` },
		{ name: 'Comments', href: `/user/${route.params.username}/comments` }
		]
</script>