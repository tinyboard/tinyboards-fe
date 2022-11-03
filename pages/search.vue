<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Mobile Banner -->
		<MediaBanner
		class="relative sm:hidden"
		title="Search"
		:sub-title="`Showing 25 of 500 results for ${route.query.q}`"
		image-url="https://i.imgur.com/kGhynxn.png"
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
					:sub-title="`Showing 25 of 500 results for ${route.query.q}`"
					image-url="https://i.imgur.com/kGhynxn.png"
					/>
					<!-- Filters -->
					<div class="flex flex-col md:grid grid-cols-4 gap-3 justify-between mb-4 px-4 py-5 sm:p-6 border-b sm:border sm:rounded-md bg-white sm:shadow-inner-xs">
						<!-- Search Input -->
						<div class="md:col-span-full">
							<form class="group relative w-full" @submit.prevent="onSubmit" @submit="search()">
								<div class="absolute left-3 top-3">
									<button class="text-gray-300 hover:text-gray-400" type="submit">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
											<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
										</svg>
									</button>
								</div>
								<input required type="text" class="pl-10 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="searchTerm" placeholder="Search and hit enter" @keyup.enter="search()"/>
								<div v-show="searchTerm" class="absolute right-3 top-[6px]">
									<button class="text-gray-400 hover:text-gray-500" @click="searchTerm = ''">
										<i class="far fa-times-circle fa-fw fa-sm"></i>
									</button>
								</div>
							</form>
						</div>
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
	const router = useRouter();

	// Define search term.
	const searchTerm = ref(route.query.q);

	// Search API.
	// This endpoint accepts a sort string, limit integer, and query string.
	// let { posts, paginate, pending, error, refresh } = await search({
	// 	sort: "new",
	// 	limit: 25,
	// 	query: route.query.q
	// }, "posts");

	// Refresh search query when search term changes.
	// watch(() => route.query, () => refresh())

	// Handle search input.
	const search = () => {
		if (route.query.q !== searchTerm.value) {
			router.push("/search?q="+searchTerm.value);
		}
	};

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