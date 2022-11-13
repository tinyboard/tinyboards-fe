<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<!-- Page Heading & Description -->
			<div class="px-4 py-5 sm:p-6 border-b">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Security</h3>
				<p class="mt-1 text-sm text-gray-600">These preferences are visible only to you.</p>
			</div>
			<!-- Form -->
			<form action="#" method="POST">
				<div class="flex flex-col space-y-6 divide-y bg-white px-4 py-5 sm:p-6">
					<!-- Email Address -->
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Email address</label>
						</div>
						<!-- Inputs -->
						<div class="mt-5 md:col-span-2 md:mt-0">
							<input type="text" name="email-address" id="email-address" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="elon@spacex.com" />
							<p class="mt-2 text-sm text-gray-500">
								Used for account recovery purposes only.
							</p>
						</div>
					</div>
					<!-- Password -->
					<div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
						<!-- Label -->
						<div class="md:col-span-1">
							<label class="text-base font-bold leading-6 text-gray-900">Password</label>
						</div>
						<!-- Inputs -->
						<div class="mt-5 md:col-span-2 md:mt-0 flex flex-col space-y-4">
							<!-- Current Password -->
							<div>
								<label for="password" class="block text-sm font-bold">Current password</label>
								<input type="password" name="password" id="password" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"/>
							</div>
							<!-- New Password -->
							<div>
								<label for="new-password" class="block text-sm font-bold">New password</label>
								<input type="password" name="new-password" id="new-password" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="Enter a new password"/>
							</div>
							<!-- Confirm New Password -->
							<div>
								<label for="confirm-password" class="block text-sm font-bold">Confirm new password</label>
								<input type="password" name="confirm-password" id="confirm-password" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="Retype your new password"/>
							</div>
						</div>
					</div>
				</div>
				<!-- Footer -->
				<div class="bg-gray-50 shadow-inner-white border-t p-4 sm:px-6">
					<button type="submit" class="button primary">Save</button>
				</div>
			</form>
		</div>
	</NuxtLayout>
</template>

<script setup>
	import { ref } from 'vue';
</script>