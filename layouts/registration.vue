<template>
	<NavigationNavbar/>
	<main class="relative flex flex-1 flex-col overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
		<section class="relative flex flex-1 flex-col items-center justify-center pt-12 pb-16">
			<slot/>
		</section>
	</main>
	<NavigationFooter/>
</template>