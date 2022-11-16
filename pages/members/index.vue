<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<MediaBanner
				title="Members"
				:sub-title="`Showing ${members.members.length} members`"
				image-url="https://i.imgur.com/TV07zoE.jpeg"
				class="col-span-full"/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
			<div class="col-span-full flex gap-6 -mx-2">
				<ul v-if="members" class="w-full flex flex-wrap overflow-hidden">
					<li v-for="(member, i) in members.members" :key="i" class="my-2 px-2 w-full overflow-hidden md:w-1/3 lg:w-1/5">
						<NuxtLink :to="`/user/${member.user.name}`" class="relative flex flex-col p-2 rounded-md hover:bg-white border shadow-inner-white">
							<span class="absolute top-1 right-3 font-bold text-xl text-gray-300">
								{{ i + 1 }}
							</span>
							<div class="flex items-center space-x-2">
								<img class="p-0.5 w-9 h-9 object-cover bg-white border" :src="member.user.avatar"/>
								<div class="flex flex-col justify-center">
									<strong class="text-primary leading-none">{{ member.user.name }}</strong>
									<small class="text-gray-500 block mt-0.5">
										<strong>{{ member.counts.post_score + member.counts.comment_score }}</strong>
										reputation
									</small>
								</div>
							</div>
							<div class="mt-2 text-sm text-gray-600">
								<ul class="flex flex-col space-y-1">
									<li class="flex items-center" :title="`${member.user.published}`">
										<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 opacity-70" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
											<path d="M3 20h18v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8z"></path>
											<path d="M2.996 14.803c.312 .135 .654 .204 1.004 .197a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35 .007 .692 -.062 1.004 -.197"></path>
											<path d="M12 4l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737z"></path>
										</svg>
										<p class="ml-1">
											{{ format(parseISO(member.user.published), "MMM dd, yyyy") }}
										</p>
									</li>
									<li class="flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 opacity-70" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
											<path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
											<line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
										</svg>
										<p class="ml-1">
											{{ member.counts.post_count === 1 ? '1 post' : `${member.counts.post_count} posts` }}
										</p>
									</li>
									<li class="flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 opacity-70" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
											<path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
										</svg>
										<p class="ml-1">
											{{ member.counts.comment_count === 1 ? '1 comment' : `${member.counts.comment_count} comments` }}
										</p>
									</li>
								</ul>
							</div>
						</NuxtLink>
					</li>
				</ul>
			</div>
			<div class="col-span-full mt-4">
				<NavigationPagination
				:total-pages="totalPages"
				:total="250"
				:per-page="25"
				:current-page="Number.parseInt(currentPage)"
				v-slot="{
					startPage,
					endPage,
					pages,
					isFirstPage,
					isLastPage,
					onClickPreviousPage,
					onClickPage,
					onClickNextPage,
					isPageActive
				}"
				@pagechanged="onPageChange">
					<ul class="flex items-center text-sm text-gray-500 font-bold space-x-3">
						<li>
							<button class="button white" @click="onClickPreviousPage" :disabled="isFirstPage">
								Prev
							</button>
						</li>
						<li v-if="totalPages >= 4" v-for="(page, i) in pages" :key="i">
							<button type="button" class="px-1 hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed" @click="onClickPage(page.name)" :disabled="page.isDisabled" :class="{ active: isPageActive(page.name) }" :aria-label="`Go to page ${page.name}`">
								{{ page.name }}
							</button>
						</li>
						<li v-if="totalPages >= 4" v-show="currentPage < totalPages - 1">
							<span class="text-gray-400">...</span>
						</li>
						<li v-if="totalPages >= 4" v-show="currentPage < totalPages - 1">
							<button type="button" class="px-1 hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed" @click="onClickPage(totalPages)" :disabled="isLastPage" :class="{ active: isPageActive(isLastPage) }" :aria-label="`Go to page ${totalPages}`">
								{{ totalPages }}
							</button>
						</li>
						<li>
							<button class="button white" type="button" @click="onClickNextPage" :disabled="isLastPage" aria-label="Next page">
								Next
							</button>
						</li>
					</ul>
				</NavigationPagination>
			</div>
		</section>
	</main>
</template>

<script setup>
	import { ref } from 'vue';

	import { useRoute } from 'vue-router';
	import { baseURL } from "@/server/constants";

	import { format, parseISO } from "date-fns";

	// Define route.
	const router = useRouter();
	const route = useRoute();

	const sort = ref(route.params.sort?? 'new');

	// Fetch members by sort.
	const { data: members, pending, error, refresh } = await useFetch("/members", {
		query: { sort: sort },
		limit: 25,
		baseURL
	});

	// Pagination
	const totalPages = 4;
	const currentPage = ref(route.query.page || 1);

	let isPageValid = currentPage === 'number';

	const onPageChange = (page) => {
		currentPage.value = page;
		router.push(`${route.path}?page=${page}`)
	}

    // Watch for sort change and refetch.
    const stopWatch = watch(() => route, () => {
    	sort.value = route.params.sort;
    	currentPage.value = route.query.page;
    	refresh();
    });

	// Links for sub navigation bar.
	const links = [
	{ name: 'Newest', href: `/members` },
	{ name: 'Oldest', href: `/members/old` },
	{ name: 'Most Posts', href: `/members/mostposts` },
	{ name: 'Most Comments', href: `/members/mostcomments` },
	{ name: 'Most Points', href: `/members/mostrep` }
	];

	// Before component unmounts
	onBeforeRouteLeave(stopWatch);
</script>