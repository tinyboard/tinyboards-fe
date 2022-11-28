<template>
	<NuxtLayout name="registration">
		<form action="/login" @submit.prevent="login" class="w-full max-w-sm bg-white border-0 shadow-lg rounded-md overflow-hidden">
			<div v-if="error" class="px-4 py-2 bg-red-500 rounded-t-md shadow-inner-white">
				<p class="text-center text-white text-sm">
					<strong>Login failed!</strong>
					Double-check your details.
				</p>
			</div>
			<div class="px-4 md:px-6 py-6">
				<h1 class="text-xl text-gray-900 font-bold mb-6">
					Sign in
				</h1>
				<div class="mb-4">
					<label for="email" class="block text-sm font-bold">Username</label>
					<input type="text" id="name" v-model="nameOrEmail" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" required="" />
				</div>
				<div class="mb-6">
					<label for="password" class="block text-sm font-bold">Password</label>
					<input type="password" id="password" v-model="password" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" required="" />
				</div>
				<button type="submit" class="button primary w-full" :disabled="isLoading">
					<span>{{ isLoading ? 'Doing the stuff...' : 'Sign in' }}</span>
				</button>
			</div>
			<div class="px-4 md:px-8 py-6 bg-gray-50 shadow-inner-xs">
				<ul class="flex flex-col space-y-2">
					<li>
						<a href="/password/reset" class="text-sm hover:underline">Forgot password?</a>
					</li>
					<li class="text-sm text-gray-400">
						Not a member? <NuxtLink href="/register" class="hover:underline">Sign up &rarr;</NuxtLink>
					</li>
				</ul>
			</div>
		</form>
	</NuxtLayout>
</template>

<script setup>
	import { ref } from 'vue';

	import { useLoggedInUser } from '@/stores/StoreAuth';
	import Cookies from 'js-cookie';

	definePageMeta({
		'isAuthAllowed': false,
		layout: false,
		'alias': '/sign-in'
	});

	let nameOrEmail = ref("");
	let password = ref("");
	const isLoading = ref(false);
	const error = ref(false);
	let reqError = false;

	let userStore = useLoggedInUser();
	let router = useRouter();

	// reqError may seem redundant - it is - it's a workaround to fix a really weird bug with changes I make to error.value in catch not persisting?
	function login() {
		reqError = false;
		error.value = reqError;
		isLoading.value = true;

		userStore.login({
			nameOrEmail: nameOrEmail.value,
			password: password.value
		})
		.then(data => {
			Cookies.set('token', data.jwt);
			router.push("/feed");
		})
		.catch(error => {
			reqError = true;
		})
		.finally(() => {
			isLoading.value = false;
			error.value = reqError;
		});
	}
</script>