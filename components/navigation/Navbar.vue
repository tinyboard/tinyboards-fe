<template>
	<nav id="header" class="fixed w-full bg-primary dark:bg-gray-900 dark:border-gray-800 z-50">
		<div class="mx-auto max-w-8xl px-2.5 sm:px-6">
			<div class="flex items-center justify-between h-12 sm:h-14">
				<div class="flex flex-grow items-center">
					<div class="relative flex-shrink-0">
						<div v-if="boardStore.boardActive" class="header-brand font-bold text-lg text-white flex space-x-1 items-center">
							<NuxtLink to="/feed">
								<img id="navbar-icon" :alt="site.name" :title="site.name" :src="site.icon" class="inline-block mr-2 max-w-[32px] max-h-[32px]"/>
							</NuxtLink>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 opacity-50" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M9 6l6 6l-6 6" />
							</svg>
							<NuxtLink :to="`/+${boardStore.boardView.board.name}`" class="font-bold text-lg text-white">+{{ boardStore.boardView.board.name }}</NuxtLink>
						</div>
						<NuxtLink v-else to="/feed" class="font-bold text-lg text-white dark:text-gray-100">
							<img :src="site.icon" class="inline-block mr-2 max-w-[32px] max-h-[32px]" />
							<span>{{ site.name }}</span>
						</NuxtLink>
						<span class="absolute -right-7 bottom-0 flashing-text font-mono">
							{{ selectedText }}
						</span>
					</div>
				</div>
				<div class="hidden md:flex space-x-4">
					<NuxtLink to="/register" class="button primary">
						Sign up
					</NuxtLink>
					<NuxtLink to="/login" class="button gray">
						Log in
					</NuxtLink>
				</div>
				<div class="-mr-1 flex space-x-2 md:hidden">
					<!-- Mobile menu button -->
					<button class="inline-flex items-center justify-center p-1 text-white" @click="toggleDrawer">
						<span class="sr-only">Open main menu</span>
						<!-- Menu Icon -->
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <line x1="4" y1="6" x2="20" y2="6"></line>
						   <line x1="4" y1="12" x2="20" y2="12"></line>
						   <line x1="4" y1="18" x2="20" y2="18"></line>
						</svg>
					</button>
				</div>
				<!-- Mobile Menu -->
				<transition enter-class="opacity-0" enter-active-class="duration-300 ease-out" enter-to-class="opacity-100" leave-class="opacity-100" leave-active-class="duration-200 ease-in" leave-to-class="opacity-0">
					<div @click="isOpen = false" @keydown.esc="isOpen = false" v-show="isOpen" class="fixed inset-0 bg-black/80"></div>
				</transition>
				<aside class="transform top-0 right-0 w-5/6 bg-white dark:bg-gray-800 fixed h-full py-3 overflow-y-auto ease-in-out transition-all duration-200 z-75" :class="isOpen ? 'translate-x-0' : 'translate-x-full'">
					<div class="absolute top-3 left-3">
						<button class="inline-flex items-center justify-center p-1 text-gray-700 dark:text-gray-400" @click="toggleDrawer">
							<span class="sr-only">Close menu</span>
							<!-- Arrow Left Icon -->
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <line x1="5" y1="12" x2="19" y2="12"></line>
							   <line x1="5" y1="12" x2="9" y2="16"></line>
							   <line x1="5" y1="12" x2="9" y2="8"></line>
							</svg>
						</button>
					</div>
					<div class="flex flex-col items-center mt-8 px-4 py-2">
						<NuxtLink to="/register" class="button primary w-full">
								Sign up
						</NuxtLink>
						<NuxtLink to="/login" class="button white mt-2 w-full">
								Log in
						</NuxtLink>
					</div>
					<NuxtLink to="/help/faq" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200" @click="isOpen = false">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <path d="M12 8h.01"></path>
						   <path d="M11 12h1v4h1"></path>
						   <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
						</svg>
						<span>About</span>
					</NuxtLink>
					<NuxtLink to="/help/rules" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200" @click="isOpen = false">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
						   <path d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5"></path>
						   <circle cx="6" cy="14" r="3"></circle>
						   <path d="M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5"></path>
						</svg>
						<span>Rules</span>
					</NuxtLink>
				</aside>
			</div>
		</div>
	</nav>
</template>

<script setup>
	import { useSiteStore } from '@/stores/StoreSite.js'
	import { useBoardStore } from '@/stores/StoreBoard.js';

	const site = useSiteStore()
	const boardStore = useBoardStore()
	const dark = false;

	// Yellow Text
	const yellowText = [
		'pre-alpha',
		'It\'s PHP!',
		'It\'s jQuery!',
		'It\'s Rails!',
		'It\'s SSR!',
		'est. 2024'
	];

	const selectedText = ref(null);

	if (typeof window === 'undefined') {
		selectedText.value = shuffle(yellowText)[0] ?? 'It\'s Rails!';
	};

	// Mobile menu
	const isOpen = ref(false);

	const toggleDrawer = () => {
		isOpen.value = !isOpen.value;
	}
</script>