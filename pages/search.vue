<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Mobile Banner -->
		<MediaBanner
		class="relative sm:hidden"
		title="Search"
		:sub-title="`Showing 25 of 500 results for &ldquo;${route.query.q}&ldquo;`"
		image-url="https://i.imgur.com/7PgqWij.png"
		/>
		<!-- Sub Navigation -->
		<section>
			<NavigationNavbarSub :links="links"/>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:pt-10 sm:px-4 md:px-6">
			<div class="col-span-full flex gap-6 sm:py-8">
				<!-- Main Content -->
				<div class="w-full">
					<!-- Banner -->
					<MediaBanner
					class="hidden sm:block mb-6"
					title="Search"
					:sub-title="`Showing 25 of 500 results for &ldquo;${route.query.q}&ldquo;`"
					image-url="https://i.imgur.com/7PgqWij.png"
					/>
					<!-- Filters -->
					<div class="flex flex-col md:grid justify-between mb-4 p-4 border-b sm:border sm:rounded-md bg-white sm:shadow-inner-xs">
						<!-- NSFW Checkbox -->
						<div class="md:col-span-4 flex">
							<div class="flex h-5 items-center">
								<input id="comments" name="comments" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
							</div>
							<div class="ml-3 text-sm">
								<label for="comments" class="font-bold text-gray-700 select-none">Include NSFW results</label>
								<p class="text-gray-500">Show results marked "not safe for work".</p>
							</div>
						</div>
					</div>
					<!-- Loading State -->
					<div v-if="pending">
						Loading...
					</div>
					<!-- Feed -->
					<ContentItemTable v-else-if="posts" :posts="posts" title="Hot posts"/>
					<!-- Error State -->
					<div v-else-if="error">
						There was an error loading search results.
					</div>
					<!-- Empty State -->
					<div v-else class="px-4 py-24 text-center text-gray-400 md:border md:border-dashed md:border-gray-300 md:rounded-md">
						There are no results. This place must be boring.
					</div>
				</div>
				<!-- Sidebar -->
				<NavigationSidebar />
			</div>
		</section>
	</main>
</template>

<script setup>
	import { useRoute } from 'vue-router';
	// import { search } from '@/composables/posts';

	// Define route.
	const route = useRoute();

	// Search API.
	// This endpoint accepts a sort string, limit integer, and query string.
	// let { posts, paginate, pending, error, refresh } = await search({
	// 	sort: "new",
	// 	limit: 25,
	// 	query: route.query.q
	// }, "posts");

	// Refresh search query when search term changes.
	watch(() => route.query, () => refresh())

	// Links for sub-navigation bar.
	const links = [
	{ name: 'Latest', href: `/search?q=${route.query.q}&sort=new` },
	{ name: 'Top All', href: `/search?q=${route.query.q}&sort=top&time=all` },
	{ name: 'Top Month', href: `/search?q=${route.query.q}&sort=top&time=month` },
	{ name: 'Top Week', href: `/search?q=${route.query.q}&sort=top&time=week` },
	{ name: 'Top Day', href: `/search?q=${route.query.q}&sort=top&time=day` },
	{ name: 'Most Comments', href: `/search?q=${route.query.q}&sort=top&time=all&type=comments` },
	{ name: 'Latest Comments', href: `/search?q=${route.query.q}&sort=new&type=comments` }
	];
</script>