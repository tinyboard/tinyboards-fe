<template>
	<div class="sm:fixed w-full bg-gray-100 border-b dark:bg-secondary dark:border-white/10 sm:z-30">
		<div class="mx-auto max-w-8xl flex items-center justify-between px-2.5 sm:px-6">
			<ul class="flex items-center overflow-x-auto scrollbar-hidden p-[1px] m-[-1px]">
				<li class="text-sm leading-6 flex-shrink-0" v-for="link in links" :key="link.name">
					<NuxtLink :external="link.isExternal" :to="link.href" custom v-slot="{ href, navigate, isActive }">
						<a :href="href" :target="link.target" @click="navigate" :class="[isActive && !disableActiveClass ? 'text-primary shadow-[0_1px_0_rgba(var(--color-primary))]' : 'text-gray-500 hover:text-primary', 'px-4 py-2.5 inline-block']">
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