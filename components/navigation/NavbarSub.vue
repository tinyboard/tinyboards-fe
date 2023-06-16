<template>
	<div id="sub-header" class="sm:fixed w-full h-11 bg-gray-100 border-b dark:bg-gray-950 dark:border-gray-800 sm:z-30">
		<div class="mx-auto max-w-8xl h-full flex items-center justify-between px-2.5 sm:px-6">
			<ul class="menu flex items-center h-full overflow-x-auto scrollbar-hidden box-content p-[1px] m-[-1px]">
				<li class="menu-item flex-shrink-0 h-full text-sm leading-6" v-for="link in links" :key="link.name">
					<NuxtLink :external="link.isExternal" :to="link.href" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" :target="link.target" @click="navigate" :class="[isActive && !disableActiveClass ? 'text-primary shadow-[0_1px_0_rgba(var(--color-primary))]' : 'text-gray-500 hover:text-primary', 'inline-flex items-center h-full px-4']">
							{{ link.name }}
						</a>
					</NuxtLink>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
	import { useRoute } from 'vue-router';

	// Define route.
	const route = useRoute();

	const props = defineProps({
		links: Array,
		disableActiveClass: Boolean
	});
</script>