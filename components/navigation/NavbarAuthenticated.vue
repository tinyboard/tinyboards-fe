<template>
	<nav id="header" class="z-50 fixed w-full bg-primary dark:bg-gray-96 sm:dark:border-b dark:border-white/10">
		<div class="mx-auto max-w-8xl px-2.5 sm:px-6">
			<div class="flex items-center justify-between h-12 sm:h-14">
				<div class="flex flex-grow items-center">
					<div class="relative flex-shrink-0">
						<!-- Logo & Name -->
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
						<NuxtLink v-else to="/feed" class="header-brand font-bold text-lg text-white">
							<img id="navbar-icon" :src="site.icon" class="inline-block mr-2 max-w-[32px] max-h-[32px]"/>
							<span>{{ site.name }}</span>
						</NuxtLink>
						<span class="absolute -right-5 -bottom-1 flashing-text font-mono">
							{{ selectedText }}
						</span>
					</div>
					<!-- Main Navigation Links -->
					<div v-if="!site.enableBoards" class="header-menu-main hidden md:block w-1/3 ml-8">
						<ul class="flex">
							<li class="header-menu-item flex items-center text-sm leading-5" v-for="link in links"
								:key="link.name">
								<NuxtLink :to="link.href" custom v-slot="{ href, navigate, isActive }">
									<a :href="link.href" @click.prevent="navigate(link.href)"
										:class="[isActive ? 'text-white bg-black/10 shadow-inner-xs' : 'text-white/70 hover:text-white', 'px-4 py-2 font-bold rounded']">
										{{ link.name }}
									</a>
								</NuxtLink>
							</li>
						</ul>
					</div>
				</div>
				<div class="header-search hidden md:flex items-center">
					<!-- Search Box -->
					<div class="mr-4 flex items-center space-x-4">
						<form class="header-search-form group relative" @submit.prevent="search">
							<div class="absolute left-3 top-2">
								<button class="text-white/20 hover:text-white" type="submit">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
										stroke="currentColor" class="w-5 h-5">
										<path stroke-linecap="round" stroke-linejoin="round"
											d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
									</svg>
								</button>
							</div>
							<input id="header-search" required type="text" class="w-full form-input search px-10"
								v-model="text" placeholder="Search" />
							<div v-show="text" class="absolute right-3 top-2">
								<button class="text-white/20 hover:text-white" @click="text = null">
									<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<circle cx="12" cy="12" r="9"></circle>
										<path d="M10 10l4 4m0 -4l-4 4"></path>
									</svg>
								</button>
							</div>
						</form>
					</div>
					<!-- User Links -->
					<div class="header-menu-profile ml-4 flex items-center space-x-2 md:ml-6">
						<!-- Admin Tools Link -->
						<NuxtLink v-if="v.is_admin" to="/admin"
							class="relative flex items-center justify-center w-9 h-9 text-xl text-white dark:text-gray-400 rounded"
							title="Admin control panel">
							<span class="sr-only">View admin tools</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
								stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path
									d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3">
								</path>
							</svg>
						</NuxtLink>
						<!-- Create Post Link -->
						<NuxtLink to="/submit"
							class="relative flex items-center justify-center w-9 h-9 text-xl text-white dark:text-gray-400 rounded"
							title="Submit a post">
							<span class="sr-only">Create new post</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
								stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
								<line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
							</svg>
						</NuxtLink>
						<!-- Inbox Link -->
						<NuxtLink to="/inbox"
							class="relative flex items-center justify-center w-9 h-9 text-xl text-white dark:text-gray-400 rounded"
							title="Inbox">
							<span class="sr-only">View inbox</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
								stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<rect x="4" y="4" width="16" height="16" rx="2"></rect>
								<path d="M4 13h3l3 3h4l3 -3h3"></path>
							</svg>
							<span v-if="unread > 0"
								class="absolute top-0 right-0 flex items-center justify-center p-1 leading-none rounded-sm bg-white">
								<strong class="text-xs text-primary">{{ unread < 99 ? unread : '99+' }}</strong>
							</span>
						</NuxtLink>
						<!-- Profile Dropdown -->
						<MenusProfile :user="v" :counts="counts" :unread="unread" />
					</div>
				</div>
				<div class="-mr-1 flex space-x-2 md:hidden">
					<!-- Admin Tools Link -->
					<NuxtLink v-if="v.is_admin" to="/admin" class="inline-flex items-center justify-center p-1 text-white">
						<span class="sr-only">View admin tools</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
							stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3">
							</path>
						</svg>
					</NuxtLink>
					<!-- Create Post Link -->
					<NuxtLink class="inline-flex items-center justify-center p-1 text-white" to="/submit">
						<span class="sr-only">Create post</span>
						<!-- Pencil Icon -->
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
							stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
							<line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
						</svg>
					</NuxtLink>
					<!-- Inbox Link -->
					<NuxtLink to="/inbox" class="inline-flex items-center justify-center p-1 text-white">
						<span class="sr-only">View inbox</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
							stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<rect x="4" y="4" width="16" height="16" rx="2"></rect>
							<path d="M4 13h3l3 3h4l3 -3h3"></path>
						</svg>
						<span v-if="unread > 0" class="absolute" style="top: 1px; right: 1px">
							<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
								class="w-3 h-3 text-white border-2 border-primary">
								<circle cx="100" cy="100" r="100" />
							</svg>
						</span>
					</NuxtLink>
					<!-- Mobile Menu Button -->
					<button class="inline-flex items-center justify-center p-1 text-white" @click="toggleDrawer">
						<span class="sr-only">Open main menu</span>
						<!-- Menu Icon -->
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
							stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<line x1="4" y1="6" x2="20" y2="6"></line>
							<line x1="4" y1="12" x2="20" y2="12"></line>
							<line x1="4" y1="18" x2="20" y2="18"></line>
						</svg>
					</button>
				</div>
			</div>
		</div>
		<!-- Mobile Menu -->
		<transition enter-class="opacity-0" enter-active-class="duration-300 ease-out" enter-to-class="opacity-100"
			leave-class="opacity-100" leave-active-class="duration-200 ease-in" leave-to-class="opacity-0">
			<div @click="isOpen = false" @keydown.esc="isOpen = false" v-show="isOpen" class="fixed inset-0 bg-black/80">
			</div>
		</transition>
		<aside
			class="transform top-0 right-0 w-5/6 bg-white dark:bg-gray-800 fixed h-full py-3 overflow-y-auto ease-in-out transition-all duration-200 z-75"
			:class="isOpen ? 'translate-x-0' : 'translate-x-full'">
			<div class="absolute top-3 left-3">
				<button class="inline-flex items-center justify-center p-1 text-gray-700 dark:text-gray-400"
					@click="toggleDrawer">
					<span class="sr-only">Close menu</span>
					<!-- Arrow Left Icon -->
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
						stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<line x1="5" y1="12" x2="19" y2="12"></line>
						<line x1="5" y1="12" x2="9" y2="16"></line>
						<line x1="5" y1="12" x2="9" y2="8"></line>
					</svg>
				</button>
			</div>
			<!-- Mobile Search -->
			<form class="group relative mx-4 mt-10 mb-4" @submit.prevent="search(); toggleDrawer();">
				<div class="absolute" style="top: 9px; left: 0.625rem;">
					<button class="text-gray-300" type="submit">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
							stroke="currentColor" class="w-4 h-4">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
						</svg>
					</button>
				</div>
				<input id="header-search-sm" required type="text" class="form-input gray px-8" v-model="text"
					placeholder="Search posts, @users and +boards" />
				<div v-show="text" class="absolute" style="top: 9px; right: 0.625rem;">
					<button class="text-gray-300" @click="text = null">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="24" height="24" viewBox="0 0 24 24"
							stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
							stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<circle cx="12" cy="12" r="9"></circle>
							<path d="M10 10l4 4m0 -4l-4 4"></path>
						</svg>
					</button>
				</div>
			</form>
			<div class="flex flex-col mb-2 px-4">
				<NuxtLink :to="`/@${v.name}`" class="flex items-center" @click="toggleDrawer">
					<!-- User Avatar -->
					<img class="w-9 h-9 object-cover rounded" :src="v.avatar" alt="user avatar" />
					<div class="pl-2 truncate">
						<!-- Username -->
						<p class="text-sm text-gray-900 leading-normal">
							<strong>{{ v.name }}</strong>
							<span v-if="v.is_admin" class="ml-1 badge badge-red">Admin</span>
						</p>
						<!-- User Reputation -->
						<div class="flex items-center text-xs">
							<span class="text-yellow-500">&#9733;&nbsp;</span>
							<span class="text-gray-600">
								{{ counts.rep ?? 0 }} reputation
							</span>
						</div>
					</div>
				</NuxtLink>
			</div>
			<!-- Inbox Link -->
			<NuxtLink to="/inbox"
				class="group flex items-center w-full px-4 py-1.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				@click="toggleDrawer">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
					stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<rect x="4" y="4" width="16" height="16" rx="2"></rect>
					<path d="M4 13h3l3 3h4l3 -3h3"></path>
				</svg>
				<span>Inbox</span>
				<strong v-if="unread > 0" class="text-primary">&nbsp;{{ unread }}</strong>
			</NuxtLink>
			<!-- My Posts Link -->
			<NuxtLink :to="`/@${v.name}/posts`"
				class="group flex items-center w-full px-4 py-1.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				@click="toggleDrawer">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
					stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
					<line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
				</svg>
				<span>Posts</span>
			</NuxtLink>
			<!-- My Settings Link -->
			<NuxtLink to="/settings/profile"
				class="group flex items-center w-full px-4 py-1.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				@click="toggleDrawer">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
					stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path
						d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z">
					</path>
					<circle cx="12" cy="12" r="3"></circle>
				</svg>
				<span>Settings</span>
			</NuxtLink>
			<!-- Divider -->
			<hr class="my-2 dark:border-gray-700 dark:border-opacity-70">
			<!-- About Link -->
			<NuxtLink to="/help/faq" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200"
				@click="isOpen = false">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
					stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M12 8h.01"></path>
					<path d="M11 12h1v4h1"></path>
					<path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
				</svg>
				<span>About</span>
			</NuxtLink>
			<!-- Rules Link -->
			<NuxtLink to="/help/rules" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200"
				@click="isOpen = false">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
					stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
					<path d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5"></path>
					<circle cx="6" cy="14" r="3"></circle>
					<path d="M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5"></path>
				</svg>
				<span>Rules</span>
			</NuxtLink>
			<!-- Members Link -->
			<NuxtLink to="/members" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200"
				@click="isOpen = false">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
					stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<circle cx="9" cy="7" r="4"></circle>
					<path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
					<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
					<path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
				</svg>
				<span>Members</span>
			</NuxtLink>
			<!-- Divider -->
			<hr class="my-2 dark:border-gray-700 dark:border-opacity-70">
			<!-- Sign Out Button -->
			<button @click="logout(); toggleDrawer()"
				class="group flex items-center w-full px-4 py-1.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2"
					stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M13 12v.01"></path>
					<path d="M3 21h18"></path>
					<path d="M5 21v-16a2 2 0 0 1 2 -2h7.5m2.5 10.5v7.5"></path>
					<path d="M14 7h7m-3 -3l3 3l-3 3"></path>
				</svg>
				<span>Sign Out</span>
			</button>
		</aside>
	</nav>
</template>

<script setup>
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
import { useSiteStore } from '@/stores/StoreSite.js';
import { useLoggedInUser } from '@/stores/StoreAuth';
import { useBoardStore } from '@/stores/StoreBoard.js';
import { shuffle } from "@/utils/shuffleArray";
import Cookies from 'js-cookie';

const route = useRoute();
const router = useRouter();
const userStore = useLoggedInUser();

const site = useSiteStore();
const boardStore = useBoardStore();

const text = ref(route.query.q);

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
const counts = userStore.counts;
const unread = ref(userStore.unread);

// Notifications count
const authCookie = useCookie("token").value;

const fetchNotifcationCount = () => {
	useApi("/notifications/unread")
		.then(({ data }) => {
			unread.value = data.value.total_count
		})
};

watch(route, (to) => {
	fetchNotifcationCount()
});

// Define sub-navigation menu links
const links = [
	{ name: 'Home', href: '/feed' },
	{ name: 'All', href: '/all' },
	{ name: 'Members', href: '/members' },
]

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

const logout = () => {
	Cookies.remove('token');
	userStore.logout();
	router.go({ path: '/feed' });
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
			toggleDrawer() {
				this.isOpen = !this.isOpen;
			},
			searchtoggleDrawer() {
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
