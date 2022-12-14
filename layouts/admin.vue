<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-4xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<CardsBanner
				class="col-span-full"
				title="Admin Panel"
				sub-title="Manage your tinyboard."
				image-url="https://i.imgur.com/Q4Eidtx.jpeg"
				/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-4xl grid grid-cols-12 sm:px-4 sm:py-6 md:px-6">
			<div class="col-span-full flex flex-col gap-6">
				<!-- Settings -->
				<slot />
			</div>
		</section>
	</main>
</template>

<script setup>
	const route = useRoute();
	
	useHead({
		title: `TinyBoards | Admin ${route.meta.title ?? 'Overview'}`,
		meta: [
		{
			property: 'og:title',
			content: `TinyBoards | Admin ${route.meta.title ?? 'Overview'}`
		}
		]
	});

	const links = [
		{ name: 'Overview', href: '/admin/overview' },
		{ name: 'Settings', href: '/admin/settings' },
		{ name: 'Mod Queue', href: '/admin/queue' },
		{ name: 'Users', href: '/admin/users' }
		];
	</script>