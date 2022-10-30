<template>
	<div>
		<NavigationNavbarAuthenticated />
		<main class="flex flex-col pt-12 sm:pt-14">
			<!-- Mobile Banner -->
			<MediaBanner
			class="relative sm:hidden"
			title="Settings"
			sub-title="Manage your public profile and more."
			image-url="https://i.imgur.com/7PgqWij.png"
			/>
			<!-- Sub Navigation -->
			<section>
				<NavigationNavbarSub :links="links"/>
			</section>
			<!-- Main Content -->
			<section class="container mx-auto max-w-4xl grid grid-cols-12 sm:pt-10 sm:px-4 md:px-6">
				<div class="col-span-full flex flex-col gap-6 sm:py-8 my-0">
					<!-- Banner -->
					<MediaBanner
					class="hidden sm:block"
					title="Settings"
					sub-title="Manage your public profile and more."
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
	{ name: 'Profile', href: '/settings/profile' },
	{ name: 'Security', href: '/settings/security' },
	];
</script>