<template>
	<Popover v-slot="{ open }">
		<PopoverButton as="div" class="w-96 appearance-none">
			<form class="group relative" @submit.prevent="search">
				<div class="absolute left-3 top-[8px]">
					<button class="text-white/20 hover:text-gray-400" type="submit">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
						  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
						</svg>
					</button>
				</div>
				<input required type="text" class="w-full form-input search pl-10" v-model="searchTerm" placeholder="Search this TinyBoard" @keyup.enter="search()"/>
				<div v-show="searchTerm" class="absolute right-3 top-[6px]">
					<button class="text-gray-400 hover:text-gray-500" @click="searchTerm = ''">
						<i class="far fa-times-circle fa-fw fa-sm"></i>
					</button>
				</div>
			</form>
		</PopoverButton>

		<transition
		enter-active-class="transition duration-300 ease-out"
		enter-from-class="opacity-70"
		enter-to-class="opacity-100"
		leave-active-class="transition duration-300 ease-in"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
		>
			<PopoverOverlay v-if="open && searchHistory.length" class="fixed inset-0 bg-black opacity-40" />
		</transition>

		<!-- Conditionally render your panel using `v-if` on another element -->
		<transition
		enter-active-class="transition duration-200 ease-out"
		enter-from-class="translate-y-1 opacity-0"
		enter-to-class="translate-y-0 opacity-100"
		leave-active-class="transition duration-150 ease-in"
		leave-from-class="translate-y-0 opacity-100"
		leave-to-class="translate-y-1 opacity-0"
		>
		<div v-if="open && searchHistory.length">
			<!-- Don't forget to add static to your PopoverPanel! -->
			<PopoverPanel static v-slot="{ close }" class="absolute right-0 w-96 mt-1 bg-white border rounded-lg shadow-lg">
				<div class="divide-y divide-gray-100">
					<div class="flex items-center px-4 py-3">
						<div class="font-medium leading-none text-sm text-gray-700">
							Recent Searches
						</div>
						<div class="ml-auto">
							<button class="text-xs text-red-400" @click="clearSearchHistory()">
								Clear
							</button>
						</div>
					</div>
					<div class="py-2">
						<ul class="flex flex-col-reverse mb-0">
							<router-link :to="`/search?q=${item}`" v-for="(item, index) in searchHistory" :key="index" custom v-slot="{ navigate }">
								<PopoverButton as="li" class="appearance-none flex items-center w-full px-3 py-1.5 text-base text-gray-700 hover:text-primary hover:bg-gray-100 focus:bg-gray-100 cursor-pointer group" @click="navigate" @keypress.enter="navigate" role="link">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 opacity-30 group-hover:opacity-100">
									  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
									</svg>
									<span class="inline-block leading-6 truncate ellipsis">{{ item }}</span>
								</PopoverButton>
							</router-link>
						</ul>
					</div>
				</div>
			</PopoverPanel>
		</div>
	</transition>
</Popover>
</template>
<script>
	import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from '@headlessui/vue';

	export default {
		components: { Popover, PopoverButton, PopoverPanel, PopoverOverlay },
		data() {
			return {
				searchTerm: this.$route.query.q,
				searchHistory: ['hello world','welcome','stickied']
			}
		},
		computed: {
			// ...mapState("persist", ["searchHistory"]),
		},
		methods: {
			// ...mapActions("persist", ["clearSearchHistory"]),
			search() {
				if (this.searchTerm) this.$router.push(`/search?q=${this.searchTerm}&sort=new`);
			}
		}
	}
</script>

<style scoped>
	.search {
		@apply text-white dark:text-gray-200 placeholder-white/30 dark:placeholder-gray-500 bg-black/10 dark:bg-gray-900 border-0 shadow-inner dark:border-gray-700 dark:border-opacity-70 focus:bg-white dark:focus:bg-white focus:border-primary focus:ring-primary dark:focus:border-primary dark:focus:ring-primary
	}
</style>