<template>
	<NuxtLayout name="registration">
		<!-- Notice -->
		<!-- Display if site mode requires invite code or application and the invite code is invalid -->
		<!--<div v-if="isDisabled && si site.requireApplication" class="w-full max-w-sm flex items-center justify-center sm:justify-start mb-6 p-2.5 text-center sm:text-left text-yellow-900 bg-yellow-100 border border-yellow-300 rounded-md shadow-inner-white">
			<svg xmlns="http://www.w3.org/2000/svg" class="hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
			   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
			   <rect x="5" y="11" width="14" height="10" rx="2"></rect>
			   <circle cx="12" cy="16" r="1"></circle>
			   <path d="M8 11v-4a4 4 0 0 1 8 0v4"></path>
			</svg>
			<div>
				<strong>
					{{ isDisabled ? 'Invite' : 'Application' }} needed
				</strong>
				<br/>
				<p class="text-sm text-yellow-800">
					{{ isDisabled ? 'You need a valid invite code to create an account.' :
					'Admins will need to approve your account before you can log in.' }}
				</p>
			</div>
		</div>-->
		<!-- Message-->
		<div v-if="message" class="w-full max-w-sm bg-white border dark:border-gray-700 shadow-lg rounded-md overflow-hidden">
			<div class="px-4 md:px-6 py-6">
				<h1 class="text-xl text-gray-900 font-bold mb-6">
					{{ message.title }}
				</h1>
				<p class="text-md text-gray-700">{{ message.text }}</p>
			</div>
		</div>
		<!-- Form -->
		<form v-else action="/register" @submit.prevent="signup" class="w-full max-w-sm bg-white border dark:border-gray-700 shadow-lg rounded-md overflow-hidden">
			<div class="px-4 md:px-6 py-6">
				<h1 class="text-xl text-gray-900 font-bold mb-6">
					{{ isValidInvite ? 'Someone invited you to join' : 'Sign up' }}
				</h1>
				<!-- Username Input -->
				<div class="mb-4">
					<label for="username" class="block text-sm font-bold">Username</label>
					<input type="text" id="username" v-model="name" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" required/>
				</div>
				<div class="mb-4">
					<label for="email" class="flex text-sm font-bold">
						Email
						<em v-if="!site.requireEmailVerification" class="ml-auto text-gray-400 font-normal">
							optional
						</em>
					</label>
					<input type="email" id="email" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" v-model="email"/>
					<p v-if="site.requireEmailVerification" class="text-xs text-gray-400">You will be prompted to verify your email to finish creating your account.</p>
				</div>
				<!-- Password Input -->
				<div :class="site.requireApplication ? 'mb-4' : 'mb-6'">
					<label for="password" class="block text-sm font-bold">Password</label>
					<input type="password" id="password" minlength="8" maxlength="60" v-model="password" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" required/>
				</div>
				<!-- Invite Code Input -->
				<div v-if="site.inviteOnly" class="mb-4">
					<label for="invite" class="block text-sm font-bold">Invite code</label>
					<input type="text" id="invite" v-model="invite" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" required/>
				</div>
				<!-- Application Mode Answer Input -->
				<div v-if="site.requireApplication" class="mb-6">
					<label for="answer" class="block text-sm font-bold">Application</label>
					<p class="text-sm text-gray-600">{{ site.applicationQuestion }}</p>
					<textarea rows="3" placeholder="Briefly explain why you'd like to join..." class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary" v-model="answer"></textarea>
				</div>
				<!-- Submit Button -->
				<button type="submit" class="button primary w-full" :disabled="isLoading">
					<span>
						{{
							site.requireApplication ?
								isLoading ? "Submitting application" : "Apply for an account"
								: isLoading ? "Signing up..." : "Sign up"
						}}
					</span>
				</button>
			</div>
			<div class="px-4 md:px-8 py-6 bg-gray-50 shadow-inner-xs">
				<ul class="flex flex-col space-y-2">
					<li class="text-sm text-gray-400">
						Already have an account? <NuxtLink to="/login" class="hover:underline">Sign in &rarr;</NuxtLink>
					</li>
				</ul>
			</div>
		</form>
	</NuxtLayout>
</template>

<script setup>
	import { computed, ref } from 'vue';
	// import { baseURL } from "@/server/constants";
	import { useApi } from "@/composables/api";
	import { useLoggedInUser } from '@/stores/StoreAuth';
	import { useToastStore } from '@/stores/StoreToast';
	import { useSiteStore } from '@/stores/StoreSite';

	import Cookies from 'js-cookie';

	definePageMeta({
		'isAuthAllowed': false,
		layout: false,
		'alias': '/sign-up',
		'title': 'Sign Up'
	});

	const route = useRoute();
	const router = useRouter();

	const userStore = useLoggedInUser();
	const toast = useToastStore();

	const redirect = route.params.redirect ?? "/feed";

	// Site
	// const site = useSiteStore();
	// fetch site
	//const { data: site, pending, error, refresh } = await useApi("/admin/site");
	const site = useSiteStore();

	// Invite
	const invite = ref(route.query.invite);
	const isValidInvite = ref(false);

	/*if (!!invite.value) {
		// Validate invite code
		const { data, pending, error, refresh } = await useApi(`/validate_invite/${invite.value}`, {
			method: "post",
			body: {
				'invite_token': invite.value
			}
		});
		// Set state
		if (!error.value) {
			isValidInvite.value = true;
		} else {
			console.log(`${invite.value} is not a valid invite code.`)
			invite.value = null;
		}
	};*/

	/*const isDisabled = computed(() => {
		return site.value.site_mode === 'InviteMode' && !isValidInvite.value;
	});*/
	const message = ref(null);

	// Registration
	const name = ref(null);
	const email = ref(null);
	const password = ref(null);
	const answer = ref(null);


	const isLoading = ref(false);
	//const adminApprovalRequired = ref(false);

	function signup() {
		isLoading.value = true;

		userStore.signup({
			username: name.value,
			email: email.value,
			password: password.value,
			inviteCode: invite.value,
			answer: answer.value
		})
		.then(({ accountCreated, applicationSubmitted }) => {
			if (accountCreated) {
				// Account created
				router.push(redirect);
			} else {
				// Application submitted - display message
				message.value = {
					title: "Almost there...",
					text: `Your registration application has been submitted. Contact a ${site.name} admin to finish creating your account.`
				};
			}
		})
		.catch(error => {
			// Log the error.
			// console.error(error);
			// Show error toast.
			toast.addNotification({
				header:'Registration failed',
				message:`${site.inviteOnly ? 'Do you have a valid invite code?' : 'Failed to create account.'}`,
				type:'error'
			});
		})
		.finally(() => isLoading.value = false);
	}
</script>