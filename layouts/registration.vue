<template>
	<div id="registration" class="relative flex flex-1 flex-col overflow-hidden bg-cover bg-center">
		<nav class="fixed w-full z-50">
			<div class="mx-auto max-w-8xl px-4 sm:px-6">
				<h1 class="sr-only">{{ site.name }}</h1>
			</div>
		</nav>
		<main class="relative flex flex-1 flex-col overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
			<section class="relative flex flex-1 flex-col items-center justify-center">
				<router-link to="/" class="font-bold text-2xl text-white mb-8">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block mr-2">
						<path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clip-rule="evenodd" />
					</svg>
					<span>{{ site.name }}</span>
				</router-link>
				<slot/>
			</section>
		</main>
		<footer class="relative mx-auto max-w-8xl bg-transparent">
			<div class="py-4 px-4 sm:px-6 md:px-8">
				<ul>
					<li class="flex items-center space-x-1 -mx-2 text-xs leading-normal">
						<NuxtLink v-for="link in navigation" :key="link.name" :to="link.href" custom v-slot="{ isActive }">
							<span class="text-white/50 hover:text-white p-2">
								{{ link.name }}
							</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</footer>
	</div>
</template>

<script setup>
	import { useSiteStore } from '@/stores/StoreSite.js'

	const site = useSiteStore()

	const navigation = [
	{ name: 'About', href: '/about' },
	{ name: 'FAQ', href: '/learderboard' },
	{ name: 'Blog', href: '/members' },
	{ name: 'House Rules', href: '/rules' },
	{ name: 'Terms', href: '/terms' },
	{ name: 'Privacy', href: '/privacy' },
	{ name: 'Source Code', href: '/source-code' }
	]
</script>

<style scoped>
	#registration {
		background-image: url('https://i.imgur.com/1rGd3Ki.gif');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	#registration::before {
		content: '';
		position: fixed;
		pointer-events: none;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.9);
	}
</style>