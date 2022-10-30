<template>
	<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
		<div class="px-4 py-5 sm:p-6 border-b border-gray-100">
			<h3 class="text-lg font-medium leading-6 text-gray-900">Security</h3>
			<p class="mt-1 text-sm text-gray-600">These preferences are visible only to you.</p>
		</div>
		<form action="#" method="POST">
			<div class="space-y-6 bg-white px-4 py-5 sm:p-6">
				<!-- Display Name -->
				<div class="grid grid-cols-3 gap-6">
					<div class="col-span-3 sm:col-span-2">
						<label for="email-address" class="block text-sm font-bold">Email Address</label>
						<input type="text" name="email-address" id="email-address" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="elon@spacex.com" />
						<p class="mt-2 text-sm text-gray-500">
							Used for account recovery purposes only.
						</p>
					</div>
				</div>
				<!-- Password -->
				<div class="grid grid-cols-3 gap-6">
					<div class="col-span-3 sm:col-span-2">
						<label for="password" class="block text-sm font-bold">Current Password</label>
						<input type="password" name="password" id="password" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"/>
					</div>
				</div>
				<!-- New Password -->
				<div class="grid grid-cols-3 gap-6">
					<div class="col-span-3 sm:col-span-2">
						<label for="new-password" class="block text-sm font-bold">New Password</label>
						<input type="password" name="new-password" id="new-password" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="Enter a new password"/>
					</div>
				</div>
				<!-- Confirm New Password -->
				<div class="grid grid-cols-3 gap-6">
					<div class="col-span-3 sm:col-span-2">
						<label for="confirm-password" class="block text-sm font-bold">New Password</label>
						<input type="password" name="confirm-password" id="confirm-password" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="Retype your new password"/>
					</div>
				</div>
			</div>
			<!-- Footer -->
			<div class="bg-gray-50 shadow-inner-white border-t p-4 sm:px-6">
				<button type="submit" class="button primary">Save</button>
			</div>
		</form>
	</div>
</template>

<script setup>
	import { ref } from 'vue';

	definePageMeta({ layout: "settings" });
</script>