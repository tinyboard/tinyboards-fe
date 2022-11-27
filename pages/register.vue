<template>
	<NuxtLayout name="registration">
		<form action="/login" @submit.prevent="signup" class="w-full max-w-sm bg-white border shadow-lg rounded-md overflow-hidden">
			<div class="px-4 md:px-6 py-6">
				<h1 class="text-xl text-gray-900 font-bold mb-6">
					Sign up
				</h1>
				<div class="mb-4">
					<label for="username" class="block text-sm font-bold">Username</label>
					<input type="text" id="username" v-model="name" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" required="" />
				</div>
				<div class="mb-4">
					<label for="email" class="flex text-sm font-bold">
						Email
						<em class="ml-auto text-gray-400 font-normal">
							optional
						</em>
					</label>
					<input type="email" id="email" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" value/>
				</div>
				<div class="mb-6">
					<label for="password" class="block text-sm font-bold">Password</label>
					<input type="password" id="password" minlength="8" maxlength="60" v-model="password" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" required="" />
				</div>
				<button type="submit" class="button primary w-full" :disabled="loading">
					<span>
						{{ loading ? 'Signing up' : 'Sign up' }} for
						<span class="capitalize">{{ site.name }}</span>
					</span>
				</button>
			</div>
			<div class="px-4 md:px-8 py-6 bg-gray-50 shadow-inner-xs">
				<ul class="flex flex-col space-y-2">
					<li class="text-sm text-gray-400">
						Already have an account? <NuxtLink href="/login" class="hover:underline">Sign in &rarr;</NuxtLink>
					</li>
				</ul>
			</div>
		</form>
	</NuxtLayout>
</template>

<script setup>
	import { ref } from 'vue';

	import { useLoggedInUser } from '@/stores/StoreAuth';
	import { useSiteStore } from '@/stores/StoreSite';;
	import Cookies from 'js-cookie';

	definePageMeta({ layout: false });

	const site = useSiteStore();

	let name = ref("");
	let password = ref("");
	let loading = ref(false);

	let userStore = useLoggedInUser();
	let router = useRouter();

	function signup() {
		userStore.signup({
			username: name.value,
			password: password.value
		})
		.then(token => {
			Cookies.set('token', token);
			router.push("/feed");
		})
		.catch(error => {
			console.error(`ERROR: ${error}`);
		});
	}
</script>