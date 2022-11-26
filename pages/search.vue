<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<MediaBanner
				title="Search"
				:sub-title="`Showing 25 of 500 results`"
				image-url="https://i.imgur.com/kGhynxn.png"
				class="col-span-full"/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
			<div class="col-span-full flex gap-6">
				<!-- Main Content -->
				<div class="w-full">
					<!-- Filters -->
					<div class="flex flex-col md:grid grid-cols-4 gap-3 justify-between mb-4 px-4 py-5 sm:p-6 border-b sm:border sm:rounded-md bg-white sm:shadow-inner-xs">
						<!-- Search Input -->
						<div class="md:col-span-full">
							<form class="group relative w-full" @submit.prevent="onSubmit" @submit="submitSearch(text)">
								<div class="absolute left-3 top-3">
									<button class="text-gray-300 hover:text-gray-400" type="submit">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
											<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
										</svg>
									</button>
								</div>
								<input required type="text" class="pl-10 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="text" placeholder="Search and hit enter"/>
								<!-- <div v-show="text" class="absolute right-3 top-[6px]">
									<button class="text-gray-400 hover:text-gray-500" @click="text = ''">
										<i class="far fa-times-circle fa-fw fa-sm"></i>
									</button>
								</div> -->
							</form>
						</div>
						<!-- NSFW Checkbox -->
						<div class="md:col-span-4 flex">
							<div class="flex h-5 items-center">
								<input id="nsfw" name="nsfw" type="checkbox" v-model="hasNsfw" class="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary">
							</div>
							<div class="ml-3 text-sm">
								<label for="nsfw" class="font-bold text-gray-700 select-none">Include NSFW results</label>
								<p class="text-gray-500">Show results marked "not safe for work"</p>
							</div>
						</div>
					</div>
					<!-- Sorts -->
					<div class="mb-2 px-4">
						<MenusSort/>
					</div>
					<!-- Feed -->
					<ContentItemTable :posts="results.posts" title="Results" :isLoading="pending" :hasError="error"/>
				</div>
				<!-- Sidebar -->
				<NavigationSidebar />
			</div>
		</section>
	</main>
</template>

<script setup>
	import { ref } from 'vue';

	import { useRoute } from 'vue-router';

	import { baseURL } from "@/server/constants";
	// import { search } from '@/composables/posts';

	// Define route & router.
	const route = useRoute();
	const router = useRouter();

	definePageMeta({
		key: (route) => route.fullPath
	});

	const text = ref(route.query.query);
	const sort = ref(route.query.sort);
	const type = ref(route.query.type);
	const hasNsfw = ref(false);

	// Fetch members by sort.
	const { data: results, pending, error, refresh } = await useFetch("/search", {
		query: {
			type: type ?? 'post',
			query: route.query.query,
			sort: route.query.sort,
			nsfw: false,
			limit: 25
		},
		baseURL
	});

	// Handle search input.
	const submitSearch = (text) => router.push({ 
		path: '/search',
		query: {
			type: type ?? 'post',
			query: text,
			sort: sort.value,
			type: type.value,
		}
	});

	// Links for sub navigation bar.
	const links = [
		{ name: 'Posts', href: { query: { ...route.query, type: 'posts' } } },
		{ name: 'Comments', href: { query: { ...route.query, type: 'comments' } } },
	];
</script>