<template>
	<div id="sub-header" class="sm:fixed w-full h-12 bg-white border-b dark:bg-gray-950 dark:border-gray-800 sm:z-40">
		<div class="mx-auto max-w-8xl h-full flex items-center justify-between px-2.5 sm:px-6">
			<ul class="menu flex items-center h-full overflow-x-auto scrollbar-hidden box-content p-[1px] m-[-1px]">
				<li class="menu-item flex-shrink-0 h-full text-base leading-6" v-for="link in links" :key="link.name">
					<NuxtLink :external="link.isExternal" :to="link.href" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" :target="link.target" @click="navigate" :class="[isActive && !disableActiveClass ? 'text-primary font-bold border-b-[3px] border-primary' : 'text-gray-600 hover:text-primary border-b-[3px] border-transparent hover:border-gray-300', 'inline-flex items-center h-full px-5 transition-all']">
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