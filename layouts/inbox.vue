<template>
	<main class="flex flex-col flex-grow min-h-full pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-4xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<CardsBanner
				class="col-span-full"
				title="Inbox"
				sub-title="Catch up on replies, mentions, and messages"
				image-url="https://forum.porpl.net/image/51bc2d71-6c70-4add-a7b0-03fed9024fb6.webp"
				/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-4xl h-full grid grid-cols-12 flex-grow sm:px-4 sm:py-6 md:px-6">
			<div class="h-full col-span-full flex flex-col gap-6">
				<!-- Messages -->
				<slot/>
			</div>
		</section>
	</main>
</template>

<script setup>
	const route = useRoute();

	useHead({
		title: `Tinyboards | ${route.meta.title ?? 'inbox'}`,
		meta: [{ property: 'og:title',
			content: `Tinyboards | ${route.meta.title}`
		}]
	});

	const links = [
	{ name: 'Replies', href: '/inbox' },
	{ name: 'Mentions', href: '/inbox/mentions' },
	{ name: 'Messages', href: '/inbox/messages' },
	];
</script>