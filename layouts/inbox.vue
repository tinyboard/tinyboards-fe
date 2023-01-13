<template>
	<main class="flex flex-col md:h-screen pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col md:hidden">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-4xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<CardsBanner
				class="col-span-full"
				title="Inbox"
				sub-title="Catch up on replies, mentions, and private messages"
				image-url="https://forum.porpl.net/image/51bc2d71-6c70-4add-a7b0-03fed9024fb6.webp"
				/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl h-full flex sm:p-4">
			<div class="h-full w-56 hidden md:flex flex-shrink-0 flex-col gap-4 bg-transparent overflow-y-auto mx-[-1px]">
				<NuxtLink to="/inbox/messages/new" class="flex items-center button primary mr-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z"></path>
						<path d="M13.5 6.5l4 4"></path>
						<path d="M16 18h4m-2 -2v4"></path>
					</svg>
					New message
				</NuxtLink>
				<ul class="flex flex-col z-10 text-sm">
					<li class="relative">
						<NuxtLink to="/inbox" custom v-slot="{ href, navigate, isActive }">
							<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 border border-r-0 rounded-l-md font-bold" :class="isActive ? 'text-gray-600 bg-gray-50 shadow-inner-white' : 'text-gray-400 hover:text-gray-600 border-transparent'">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								   <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
								</svg>
								Replies
							</a>
						</NuxtLink>
					</li>
					<li class="relative">
						<NuxtLink to="/inbox/mentions" custom v-slot="{ href, navigate, isActive }">
							<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 border border-r-0 rounded-l-md font-bold" :class="isActive ? 'text-gray-600 bg-gray-50 shadow-inner-white' : 'text-gray-400 hover:text-gray-600 border-transparent'">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								   <circle cx="12" cy="12" r="4"></circle>
								   <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"></path>
								</svg>
								Mentions
							</a>
						</NuxtLink>
					</li>
					<!-- <li class="relative">
						<NuxtLink to="/inbox/messages" custom v-slot="{ href, navigate, isActive }">
							<a :href="href" @click="navigate" class="flex items-center px-4 py-2.5 border border-r-0 rounded-l-md font-bold" :class="isActive ? 'text-gray-600 bg-gray-50 shadow-inner-white' : 'text-gray-400 hover:text-gray-600 border-transparent'">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								   <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10"></path>
								   <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2"></path>
								</svg>
								Messages
							</a>
						</NuxtLink>
					</li> -->
				</ul>
			</div>
			<div class="h-full w-full flex flex-col gap-6 md:p-4 bg-gray-50 md:border md:rounded-md md:shadow-inner-white">
				<!-- Messages -->
				<slot/>
			</div>
		</section>
	</main>
</template>

<script setup>
	const route = useRoute();

	useHead({
		bodyAttrs: {
	      class: 'md:overflow-hidden'
	    },
		title: `Tinyboards | ${route.meta.title ?? 'inbox'}`,
		meta: [{ property: 'og:title',
			content: `Tinyboards | ${route.meta.title}`
		}]
	});

	const links = [
	{ name: 'Replies', href: '/inbox' },
	{ name: 'Mentions', href: '/inbox/mentions' },
	// { name: 'Messages', href: '/inbox/messages' },
	];
</script>

<style scoped>
	.arrow__right::before {
		content: "";
		position: absolute;
		top: 11px;
		right: -8px;
		display: block;
		width: 16px;
		height: 16px;
		transform: rotate(45deg);
		box-sizing: content-box;
		@apply border-l border-b bg-gray-50;
	}
</style>