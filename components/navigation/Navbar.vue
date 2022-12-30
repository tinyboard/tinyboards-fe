<template>
	<nav class="fixed w-full bg-primary sm:border-b border-black/10 dark:bg-secondary dark:border-white/10 z-50">
		<div class="mx-auto max-w-8xl px-2.5 sm:px-6">
			<div class="flex items-center justify-between h-12 sm:h-14">
				<div class="flex flex-grow items-center">
					<div class="flex-shrink-0">
						<NuxtLink to="/feed" class="font-bold text-lg text-white">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 inline-block mr-2">
							  <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clip-rule="evenodd" />
							</svg>
							<span>{{ site.name }}</span>
						</NuxtLink>
					</div>
					<div class="hidden md:block w-1/3">
						<div class="ml-4 flex items-baseline space-x-4">
							<div class="relative">
								<PopoversSearch/>
							</div>
						</div>
					</div>
				</div>
				<div class="hidden md:flex space-x-4">
					<NuxtLink to="/login" class="button primary-25">
						Log in
					</NuxtLink>
					<NuxtLink to="/register" class="button white">
						Sign up
					</NuxtLink>
				</div>
				<div class="-mr-1 flex space-x-1 md:hidden">
					<!-- Search button -->
					<button class="inline-flex items-center justify-center p-1 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" @click="searchDrawer">
						<span class="sr-only">Search</span>
						<!-- Menu Icon -->
						<i class="far fa-search fa-fw fa-lg"></i>
					</button>
					<!-- Mobile menu button -->
					<button class="inline-flex items-center justify-center p-1 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" @click="drawer">
						<span class="sr-only">Open main menu</span>
						<!-- Menu Icon -->
						<i class="far fa-bars fa-fw fa-lg"></i>
					</button>
				</div>
				<!-- Mobile Menu -->
				<transition enter-class="opacity-0" enter-active-class="ease-out transition-all duration-100" enter-to-class="opacity-200" leave-class="opacity-100" leave-active-class="ease-out transition-all duration-200" leave-to-class="opacity-0">
					<div @keydown.esc="isOpen = false" v-show="isOpen" class="z-10 fixed inset-0 transition-opacity">
						<div @click="isOpen = false" class="absolute inset-0 bg-gray-900 opacity-80" tabindex="0"></div>
					</div>
				</transition>
				<aside class="transform top-0 right-0 w-5/6 bg-white dark:bg-gray-800 fixed h-full py-3 overflow-y-auto ease-in-out transition-all duration-200 z-75" :class="isOpen ? 'translate-x-0' : 'translate-x-full'">
					<div class="absolute top-4 left-3">
						<button class="inline-flex items-center justify-center p-1 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" @click="drawer">
							<span class="sr-only">Close menu</span>
							<!-- Menu Icon -->
							<i class="far fa-long-arrow-left fa-fw fa-lg"></i>
						</button>
					</div>
					<div class="flex flex-col items-center mt-8 px-4 py-2">
						<router-link to="/login" custom v-slot="{ navigate }">
							<button class="button outlinePrimary w-full" @click="navigate" @keypress.enter="navigate" role="link">
								Sign in
							</button>
						</router-link>
						<router-link to="/register" custom v-slot="{ navigate }">
							<button class="button primary mt-2 w-full" @click="navigate" @keypress.enter="navigate" role="link">
								Sign up
							</button>
						</router-link>
					</div>
					<router-link to="/following" class="block px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="isOpen = false">
						<i class="far fa-info-circle text-center fa-fw mr-3"></i><span>About</span>
					</router-link>
					<router-link to="/guilds" class="block px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="isOpen = false">
						<i class="far fa-scroll-old text-center fa-fw mr-3"></i><span>Rules</span>
					</router-link>
					<router-link to="/saved" class="block px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="isOpen = false">
						<i class="fab fa-github text-center fa-fw mr-3"></i><span>Source Code</span>
					</router-link>
					<router-link to="/settings" class="block px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="isOpen = false">
						<i class="fab fa-discord text-center fa-fw mr-3"></i><span>Discord</span>
					</router-link>
					<button class="flex items-center px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="dark = !dark">
						<i class="far text-center fa-fw mr-3" :class="dark ? 'fa-sunglasses' : 'fa-moon'"></i>
						<span>{{ dark ? 'Light Theme' : 'Dark Theme'}}</span>
					</button>
				</aside>
			</div>
		</div>
	</nav>
</template>

<script setup>
	import { useSiteStore } from '@/stores/StoreSite.js'

	const site = useSiteStore()
	const isOpen = false;
	const dark = false;
</script>