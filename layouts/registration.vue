<template>
	<div id="layout-registration" class="relative flex flex-1 flex-col bg-primary dark:bg-gray-950">
		<nav class="fixed w-full z-50">
			<div class="mx-auto max-w-8xl px-4 sm:px-6">
				<h1 class="sr-only dark:text-gray-100">{{ site.name }}</h1>
			</div>
		</nav>
		<main class="relative flex flex-1 flex-col overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
			<section class="relative flex flex-1 flex-col items-center justify-center">
				<NuxtLink external to="/" class="font-bold text-2xl text-white mb-8">
					<span>{{ site.name }}</span>
				</NuxtLink>
				<slot/>
			</section>
		</main>
		<footer class="relative mx-auto max-w-8xl bg-transparent">
			<div class="py-4 px-4 sm:px-6 md:px-8">
				<ul>
					<li class="flex items-center space-x-1 -mx-2 text-xs leading-normal">
						<NuxtLink external v-for="link in links" :key="link.name" :to="link.href" custom v-slot="{ isActive }">
							<span class="text-white/50 hover:text-white p-2">
								{{ link.name }}
							</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</footer>
		<DialogsToastList />
	</div>
</template>

<script setup>
	import { useSiteStore } from '@/stores/StoreSite.js';
	const site = useSiteStore();

	const route = useRoute();

	useHead({
		bodyAttrs: {
			class: useCookie("theme") ?? 'dark'
		},
		title: `${site.name} | ${route.meta.title ?? 'Sign Up'}`,
		meta: [{ property: 'og:title',
			content: `${site.name} | ${route.meta.title}`
		}],
		style: [
			`
			:root {
				--color-primary: ${site.primaryColor} !important;
				--color-secondary: ${site.secondaryColor} !important;
				--color-primary-hover: ${site.hoverColor} !important;
			}
			`,
		],
		link: [
		{
			rel: 'icon',
			type: `image/png`,
			href: site.icon
		},
		]
	});

	const links = [
	{ name: 'About', href: '/help/about' },
	{ name: 'FAQ', href: '/help' },
	{ name: 'House Rules', href: '/help/rules' },
	// { name: 'Terms', href: '/terms' },
	// { name: 'Privacy', href: '/privacy' },
	// { name: 'Source Code', href: '/source-code' }
	];
</script>