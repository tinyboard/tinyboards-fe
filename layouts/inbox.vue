<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-4xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<CardsBanner
				class="col-span-full"
				title="Inbox"
				sub-title="View replies, mentions, and more"
				image-url="https://i.imgur.com/7PgqWij.png"
				/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-4xl grid grid-cols-12 sm:px-4 sm:py-6 md:px-6">
			<div class="col-span-full flex flex-col gap-6">
				<!-- Messages -->
				<slot/>
			</div>
		</section>
	</main>
</template>

<script setup>
	const links = [
	{ name: 'All', href: '/inbox' },
	{ name: 'Unread', href: '/inbox/unread' },
	{ name: 'Replies', href: '/inbox/replies' },
	{ name: 'Mentions', href: '/inbox/mentions' },
	];
</script>