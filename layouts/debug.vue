<template>
	<main id="layout-debug" class="flex flex-col pt-12 sm:pt-14">
		<section>
			<slot/>
		</section>
	</main>
</template>

<script setup>
	import { useSiteStore } from '@/stores/StoreSite';
	const site = useSiteStore();

	// useHead({
	// 	title: `${site.name} | debug`
	// });
</script>