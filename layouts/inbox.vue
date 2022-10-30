<template>
	<div>
		<NavigationNavbarAuthenticated />
		<main class="flex flex-col pt-12 sm:pt-14">
			<!-- Mobile Banner -->
			<MediaBanner
			class="relative sm:hidden"
			title="Inbox"
			sub-title="View replies, mentions, and more"
			image-url="https://i.imgur.com/7PgqWij.png"
			/>
			<!-- Sub Navigation -->
			<section>
				<NavigationNavbarSub :links="links"/>
			</section>
			<!-- Main Content -->
			<section class="container mx-auto max-w-4xl grid grid-cols-12 sm:pt-10 sm:px-4 md:px-6">
				<div class="col-span-full flex flex-col gap-6 py-8 my-2.5 sm:my-0">
					<!-- Banner -->
					<MediaBanner
					class="hidden sm:block"
					title="Inbox"
					sub-title="View replies, mentions, and more"
					image-url="https://i.imgur.com/7PgqWij.png"
					/>
					<!-- Messages -->
					<slot/>
				</div>
			</section>
		</main>
		<NavigationFooter />
	</div>
</template>

<script setup>
	const links = [
	{ name: 'All', href: '/inbox' },
	{ name: 'Unread', href: '/inbox/unread' },
	{ name: 'Replies', href: '/inbox/replies' },
	{ name: 'Mentions', href: '/inbox/mentions' },
	];
</script>