<template>
	<nav class="z-50 fixed w-full bg-primary dark:bg-secondary sm:dark:border-b dark:border-white/10">
		<div class="mx-auto max-w-8xl px-2.5 sm:px-6">
			<div class="flex items-center justify-between h-12 sm:h-14">
				<div class="flex flex-grow items-center">
					<div class="relative flex-shrink-0">
						<!-- Logo & Name -->
						<NuxtLink to="/feed" class="font-bold text-lg text-white">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 inline-block mr-2">
								<path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clip-rule="evenodd" />
							</svg>
							<span>{{ site.name }}</span>
						</NuxtLink>
						<span class="absolute -right-5 -bottom-1 flashing-text font-mono">
							{{ selectedText }}
						</span>
					</div>
					<!-- Core Navigation Links -->
					<div class="hidden md:block w-1/3 ml-8">
						<ul class="flex">
							<li class="flex items-center text-sm leading-5" v-for="link in links" :key="link.name">
								<NuxtLink :to="link.href" custom v-slot="{ isActive, href, navigate }">
									<a :href="link.href" @click="navigate" :class="[isActive ? 'text-white bg-black/10 shadow-inner-xs' : 'text-white/70 hover:text-white', 'px-4 py-2 font-bold rounded']">
										{{ link.name }}
									</a>
								</NuxtLink>
							</li>
						</ul>
					</div>
				</div>
				<div class="hidden md:flex items-center">
					<!-- Search Box -->
					<div class="mr-4 flex items-center space-x-4">
						<form class="group relative" @submit.prevent="search">
							<div class="absolute left-3 top-2">
								<button class="text-white/20 hover:text-white" type="submit">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
									</svg>
								</button>
							</div>
							<input required type="text" class="w-full form-input search px-10" v-model="text" placeholder="Search this place"/>
							<div v-show="text" class="absolute right-3 top-2">
								<button class="text-white/20 hover:text-white" @click="text = null">
									<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<circle cx="12" cy="12" r="9"></circle>
										<path d="M10 10l4 4m0 -4l-4 4"></path>
									</svg>
								</button>
							</div>
						</form>
					</div>
					<!-- User Links -->
					<div class="ml-4 flex items-center space-x-2 md:ml-6">
						<!-- Admin Link -->
						<NuxtLink v-if="v.is_admin" to="/admin" tag="button" class="flex items-center justify-center w-9 h-9 text-xl text-white dark:text-gray-400 hover:text-primary dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-inner-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white rounded-md">
							<span class="sr-only">View admin tools</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"></path>
							</svg>
						</NuxtLink>
						<!-- Create Link -->
						<NuxtLink to="/submit" class="flex items-center justify-center w-9 h-9 text-xl text-white dark:text-gray-400 hover:text-primary dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-inner-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white rounded-md">
							<span class="sr-only">Create new post</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
								<line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
							</svg>
						</NuxtLink>
						<!-- Inbox Link -->
						<NuxtLink to="/inbox" class="flex items-center justify-center w-9 h-9 text-xl text-white dark:text-gray-400 hover:text-primary dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-inner-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white rounded-md">
							<span class="sr-only">View inbox</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<rect x="3" y="5" width="18" height="14" rx="2"></rect>
								<polyline points="3 7 12 13 21 7"></polyline>
							</svg>
						</NuxtLink>
						<!-- Profile Dropdown -->
						<MenusProfile :user="v"/>
					</div>
				</div>
				<div class="-mr-1 flex space-x-1 md:hidden">
					<!-- Search button -->
					<button class="inline-flex items-center justify-center p-1 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" @click="searchDrawer">
						<span class="sr-only">Search</span>
						<!-- Menu Icon -->
						<i class="far fa-search fa-fw fa-lg"></i>
					</button>
					<!-- Create post button -->
					<NuxtLink tag="button" class="inline-flex items-center justify-center p-1 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" to="/submit">
						<span class="sr-only">Create post</span>
						<!-- Menu Icon -->
						<i class="far fa-feather fa-fw fa-lg"></i>
					</NuxtLink>
					<!-- Mobile menu button -->
					<button class="inline-flex items-center justify-center p-1 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" @click="drawer">
						<span class="sr-only">Open main menu</span>
						<!-- Menu Icon -->
						<i class="far fa-bars fa-fw fa-lg"></i>
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Menu -->
		<transition enter-class="opacity-0" enter-active-class="ease-out transition-all duration-100" enter-to-class="opacity-200" leave-class="opacity-100" leave-active-class="ease-out transition-all duration-200" leave-to-class="opacity-0">
			<div @keydown.esc="isOpen = false" v-show="isOpen" class="z-10 fixed inset-0 transition-opacity">
				<div @click="isOpen = false" class="absolute inset-0 bg-gray-900 opacity-80" tabindex="0">
				</div>
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
			<div class="flex flex-col items-center text-center px-6 py-2">
				<NuxtLink @click="isOpen = false" :to="`/user/${v.name}`">
					<img class="w-16 h-16 object-cover rounded-sm" :src="v.avatar" alt="user avatar"/>
				</NuxtLink>
				<div class="truncate mt-2">
					<NuxtLink @click="isOpen = false" :to="`/user/${v.name}`" class="text-xl font-bold leading-5 text-gray-900 dark:text-gray-200">
						{{ v.name }}
					</NuxtLink>
					<ul class="flex items-center space-x-2 mt-1 mb-0 text-xs text-gray-500 dark:text-gray-400">
						<li>
							503 followers
						</li>
						<li>
							<span class="font-hairline">
								|
							</span>
						</li>
						<li>
							2.4M Reputation
						</li>
					</ul>
				</div>
			</div>
			<hr class="my-2 dark:border-gray-700 dark:border-opacity-70">
			<!-- <NuxtLink to="/inbox" class="block px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="isOpen = false">
				<i class="far fa-envelope text-center fa-fw mr-3"></i><span>Inbox</span>
			</NuxtLink>
			<NuxtLink to="/following" class="block px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="isOpen = false">
				<i class="far fa-user text-center fa-fw mr-3"></i><span>Following</span>
			</NuxtLink>
			<NuxtLink to="/guilds" class="block px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="isOpen = false">
				<i class="far fa-users-crown text-center fa-fw mr-3"></i><span>Guilds</span>
			</NuxtLink>
			<NuxtLink to="/saved" class="block px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="isOpen = false">
				<i class="far fa-bookmark text-center fa-fw mr-3"></i><span>Saved</span>
			</NuxtLink>
			<NuxtLink to="/settings" class="block px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="isOpen = false">
				<i class="far fa-cog text-center fa-fw mr-3"></i><span>My Account</span>
			</NuxtLink>
			<NuxtLink to="/mod" class="block px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="isOpen = false">
				<i class="far fa-crown text-center fa-fw mr-3"></i><span>Moderation</span>
			</NuxtLink> -->
			<!-- <div class="hidden items-center px-4 py-2 text-lg text-gray-700 dark:text-gray-200">
				<i class="far fa-signal-stream text-center fa-fw mr-3" :class="{'text-green-500':online}"></i><span>Appear Online</span>
				<t-toggle v-model="online" variant="success" class="ml-auto"/>
			</div> -->
			<!-- <button class="flex items-center px-4 py-2 text-lg text-gray-700 dark:text-gray-200" @click="dark = !dark">
				<i class="far text-center fa-fw mr-3" :class="dark ? 'fa-sunglasses' : 'fa-moon'"></i>
				<span>{{ dark ? 'Light Theme' : 'Dark Theme'}}</span>
			</button> -->
			<hr class="my-2 dark:border-gray-700 dark:border-opacity-70">
			<NuxtLink to="#" class="block px-4 py-2 text-lg text-red-500" role="menuitem" @click="isOpen = false">
				<i class="far fa-sign-out fa-rotate-180 text-center fa-fw mr-3"></i><span>Sign Out</span>
			</NuxtLink>
		</aside>
	</nav>
</template>

<script setup>
	import { ref } from 'vue';
	import { useSiteStore } from '@/stores/StoreSite.js';
	import { useLoggedInUser } from '@/stores/StoreAuth';
	import { shuffle } from "@/utils/shuffleArray";

	const route = useRoute();
	const router = useRouter();
	const userStore = useLoggedInUser();

	const site = useSiteStore();

	const isOpen = ref(false);

	const text = ref(route.query.q)

	const search = () => {
		router.push({
			path: '/search',
			query: {
				...route.query,
				type: route.query.type ?? 'post',
				query: text.value ?? '404',
				sort: route.query.sort ?? 'new'
			}
		})
	};

	const v = userStore.user;

	// Define sub-navigation menu links
	const links = [
	{ name: 'Home', href: '/feed' },
	{ name: 'Members', href: '/members' },
	{ name: 'FAQ', href: '/help/faq' }
	]

	// Yellow Text
	const yellowText = [
		'pre-alpha',
		'seq-approved',
		'kroner',
		'It\'s PHP!',
		'It\'s jQuery!',
		'It\'s Rails!',
		'It\'s SSR!',
		'In Motion',
		'est. 2023'
	];

	const selectedText = ref(null);

	if (typeof window === 'undefined') {
		selectedText.value = shuffle(yellowText)[0] ?? 'It\'s Rails!';
	};
</script>

<!-- <script>
	// import Notifications from "@/components/dropdowns/navbar/Notifications.vue";
	// import Profile from "@/components/dropdowns/navbar/Profile.vue";
	// import Search from "@/components/popovers/PopoverSearch.vue";

	export default {
		name: "NavbarAuthenticated",
		data() {
			return {
				online: false,
				searchTerm: this.$route.query.q,
				notifications: [1,2,3],
				isOpen: false,
				isSearch: false
			}
		},
		computed: {
			...mapState("persist", ["v", "darkMode"]),
			site() {
				return this.$store.getters['site/getSite'];
			},
			loginOrRegister() {
				return this.$route.name == 'LoginView' || this.$route.name == 'RegisterView'
			},
			dark: {
				get () {
					return this.darkMode
				},
				set (value) {
					this.$store.dispatch('persist/toggle_dark', value)
				}
			}
		},
		watch: {
			isOpen: {
				immediate: true,
				handler(isOpen) {
					if (isOpen) document.body.style.setProperty("overflow", "hidden");
					else document.body.style.removeProperty("overflow");
				}
			},
			isSearch: {
				immediate: true,
				handler(isSearch) {
					if (isSearch) document.body.style.setProperty("overflow", "hidden");
					else document.body.style.removeProperty("overflow");
				}
			}
		},
		methods: {
			...mapActions("persist", ["logout"]),
			createPost() {
				if (this.$route.path.startsWith === '/+') {
					this.$store.commit('create/TOGGLE_POST_CREATION_MODAL', {show: true})
				} else {
					this.$router.push('/create/post')
				}
			},
			search() {
				this.$router.push("/search?q="+this.searchTerm);
			},
			drawer() {
				this.isOpen = !this.isOpen;
			},
			searchDrawer() {
				this.isSearch = !this.isSearch;
			}
		},
		mounted() {
			document.addEventListener("keydown", e => {
				if (e.keyCode == 27 && this.isOpen) this.isOpen = false;
				if (e.keyCode == 27 && this.isSearch) this.isSearch = false;
			});
			window.addEventListener('popstate', () => {
				if (this.isOpen) this.isOpen = false, this.$router.go(1);
				if (this.isSearch) this.isSearch = false, this.$router.go(1);
			})
		}
	}
</script> -->

<style scoped>
	.search {
		@apply text-white dark:text-gray-200 placeholder-white/30 dark:placeholder-gray-500 bg-black/10 dark:bg-gray-900 border-0 shadow-inner dark:border-gray-700 dark:border-opacity-70 focus:bg-black/20 dark:focus:bg-black/20 focus:border-white focus:ring-white dark:focus:border-primary dark:focus:ring-primary transition duration-150 ease-out
	}
</style>
