<template>
	<form action="/login" class="w-full max-w-sm bg-white border shadow-lg rounded-md overflow-hidden">
		<div class="px-4 md:px-8 py-8">
			<h1 class="text-xl text-gray-900 font-bold mb-6">
				Sign in
			</h1>
			<div class="mb-4">
				<label for="email" class="block text-sm font-bold">Username</label>
				<input type="email" id="email" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" required="" value=""/>
			</div>
			<div class="mb-6">
				<label for="password" class="block text-sm font-bold">Password</label>
				<input type="password" id="password" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" required="" value=""/>
			</div>
			<button type="submit" class="button primary w-full">
				<span>Sign in</span>
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
</template>

<script setup>
	definePageMeta({ layout: "registration" });
</script>