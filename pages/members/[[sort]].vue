<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<CardsBanner
				title="Members"
				:sub-title="`Showing ${members.members.length} members`"
				image-url="https://i.imgur.com/TV07zoE.jpeg"
				class="col-span-full"/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
			<div class="col-span-full px-2.5 sm:px-0">
				<ul v-if="members" class="w-full grid grid-cols-4 gap-2 sm:gap-4 overflow-hidden">
					<li v-for="(member, i) in members.members" :key="i" class="w-full col-span-full md:col-span-2 lg:col-span-1">
						<NuxtLink :to="`/user/${member.user.name}`" class="relative flex flex-col p-2.5 rounded-md bg-white hover:bg-gray-50 border shadow-inner-white">
							<span class="absolute top-1 right-3 font-bold text-lg text-gray-300">
								#{{ i + 1 }}
							</span>
							<div class="flex items-center space-x-2">
								<img class="p-0.5 w-9 h-9 object-cover bg-white border hover:bg-gray-200" :src="member.user.avatar"/>
								<div class="flex flex-col justify-center">
									<div class="flex">
										<strong class="text-gray-900 text-sm">{{ member.user.name }}</strong>
										<!-- Role -->
										<span v-if="member.user.admin" class="ml-1 badge badge-blue">Admin</span>
									</div>
									<!-- New or Old -->
									<small v-if="sort === 'new' || sort === 'old'" class="text-gray-400 block">
										Since
										<span class="font-medium">{{ format(parseISO(member.user.published), "MMM dd, yyyy") }}</span>
									</small>
									<!-- Post Count -->
									<small v-else-if="sort === 'mostcomments'" class="text-gray-400 block">
										<span class="font-medium">
											{{ member.counts.post_count }}
										</span>
										{{ member.counts.post_count === 1 ? 'post' : 'posts' }}
									</small>
									<!-- Commnent Count -->
									<small v-else-if="sort === 'mostcomments'" class="text-gray-400 block">
										<span class="font-medium">
											{{ member.counts.comment_count }}
										</span>
										{{ member.counts.comment_count === 1 ? 'comment' : 'comments' }}
									</small>
									<!-- Reputation -->
									<small v-else class="text-gray-400 block">
										<span class="font-medium">{{ member.counts.post_score + member.counts.comment_score }}</span>
										reputation
									</small>
								</div>
							</div>
						</NuxtLink>
					</li>
				</ul>
			</div>
			<div class="col-span-full mt-4 px-2.5 sm:px-0">
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
                      isPageActive,
                      pageChanged
                }"
                @page-changed="onPageChange">
					<ul class="flex items-center text-sm text-gray-500 font-bold space-x-1">
						<li>
							<button class="button button-sm white" @click="onClickPreviousPage" :disabled="isFirstPage">
								Prev
							</button>
						</li>
						<li v-if="totalPages >= 4" v-for="(page, i) in pages" :key="i">
							<button type="button" class="button button-sm" @click="onClickPage(page.name)" :class="isPageActive(page.name) ? 'primary opacity-100' : 'white'" :aria-label="`Go to page ${page.name}`">
								{{ page.name }}
							</button>
						</li>
						<li v-if="totalPages >= 4" v-show="currentPage < totalPages - 1">
							<span class="text-gray-400 px-2">...</span>
						</li>
						<li v-if="totalPages >= 4" v-show="currentPage < totalPages - 1">
							<button type="button" class="button button-sm" @click="onClickPage(totalPages)" :class="isPageActive(isLastPage) ? 'primary' : 'white'" :aria-label="`Go to page ${totalPages}`">
								{{ totalPages }}
							</button>
						</li>
						<li>
							<button class="button button-sm white" type="button" @click="onClickNextPage" :disabled="isLastPage" aria-label="Next page">
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
	useHead({
		title: 'TinyBoards | Members',
		meta: [
		{
			property: 'og:title',
			content: 'TinyBoards | Members'
		}
		]
	});

	import { computed, ref } from 'vue';
	import { useRoute } from 'vue-router';
	import { baseURL } from "@/server/constants";
	import { format, parseISO } from "date-fns";

	const router = useRouter();
	const route = useRoute();

	// Feed sorts.
	const sorts = ['new','old','mostcomments','mostposts','mostrep'];

	const sort = computed(() => {
		return sorts.includes(route.params.sort) ? route.params.sort : 'new';
	});

	// Fetch members by sort.
	const { data: members, pending, error, refresh } = await useFetch("/members", {
		query: { sort: sort },
		limit: 25,
		baseURL
	});

	// Pagination
	const totalPages = 4;
	const currentPage = ref(route.query.page || 1);

	const onPageChange = (page) => {
		currentPage.value = page;
		router.push(`${route.path}?page=${page}`)
	};

  // Watch for sort change and refetch.
	const stopWatch = watch(() => route, () => {
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

	// Before route changes, stop the watcher.
	onBeforeRouteLeave(stopWatch);
</script>