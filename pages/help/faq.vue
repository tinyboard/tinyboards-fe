<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Sub Navigation & Banner -->
		<section class="flex flex-col">
			<NavigationNavbarSub :links="links" class="sm:order-first"/>
			<div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
				<!-- Banner -->
				<MediaBanner
				title="Help"
				sub-title="Rules, guides, and the like"
				image-url="https://i.imgur.com/kGhynxn.png"
				class="col-span-full"/>
			</div>
		</section>
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
			<div class="col-span-full flex gap-6">
				<!-- Main Content -->
				<div class="w-full flex flex-col space-y-4 sm:p-4 bg-white sm:border sm:shadow-inner-xs sm:rounded-md">
					<div>
						<h2 class="text-lg md:text-xl leading-normal font-bold dark:text-gray-100 mb-2">What is this place?</h2>
						<p>Lorem</p>
					</div>
				</div>
				<!-- Sidebar -->
				<NavigationSidebar />
			</div>
		</section>
	</main>
</template>

<script setup>
	const links = [
		{ name: 'Get Started', href: '/get-started' },
		{ name: 'About', href: '/help/about' },
		{ name: 'FAQ', href: '/help/faq' },
		{ name: 'House Rules', href: '/help/rules' },
		{ name: 'Formatting Guide', href: '/help/formatting' }
	];
</script>