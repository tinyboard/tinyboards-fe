<template>
	<NuxtLayout name="settings">
		<div class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md">
			<div class="px-4 py-5 sm:p-6 border-b border-gray-100">
				<h3 class="text-lg font-medium leading-6 text-gray-900">Profile</h3>
				<p class="mt-1 text-sm text-gray-600">This information will be displayed on the World Wide Web just so you know.</p>
			</div>
			<form action="#" method="POST">
				<div class="space-y-6 bg-white px-4 py-5 sm:p-6">
					<!-- Photo -->
					<div>
						<label class="block text-sm font-bold">Photo</label>
						<div class="mt-1 flex items-center">
							<img :src="url" class="w-20 h-20 object-cover rounded-sm rounded-none p-0.5 border bg-white"/>
							<div class="ml-5">
								<label for="file-upload" class="inline-block button white cursor-pointer">
									Change
								</label>
								<input id="file-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif" @change="onFileChange"/>
								<small class="block mt-2 text-gray-400">
									Max file size allowed is 1mb. Supports PNG, JPG and GIF.
								</small>
							</div>
						</div>
					</div>
					<!-- Banner -->
					<div>
						<label class="block text-sm font-bold">Banner</label>
						<div class="mt-1 flex justify-center rounded-md border border-dashed border-gray-300 px-6 pt-5 pb-6">
							<div class="space-y-1 text-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-10 w-10 text-gray-400" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<path d="M15 8h.01"></path>
									<path d="M12 20h-5a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v5"></path>
									<path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l4 4"></path>
									<path d="M14 14l1 -1c.617 -.593 1.328 -.793 2.009 -.598"></path>
									<path d="M16 19h6"></path>
									<path d="M19 16v6"></path>
								</svg>
								<div class="flex text-sm text-gray-600">
									<label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
										<span>Upload a file</span>
										<input id="file-upload" name="file-upload" type="file" class="sr-only" />
									</label>
									<p class="pl-1">or drag and drop</p>
								</div>
								<p class="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
							</div>
						</div>
					</div>
					<!-- Display Name -->
					<div class="grid grid-cols-3 gap-6">
						<div class="col-span-3 sm:col-span-2">
							<label for="company-website" class="block text-sm font-bold">Display name</label>
							<input type="text" name="company-website" id="company-website" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="elon" />
							<p class="mt-2 text-sm text-gray-500">
								The name next to your posts and comments. Your profile URL will always be /elon.
							</p>
						</div>
					</div>
					<!-- Biography -->
					<div>
						<label for="about" class="block text-sm font-bold">Biography</label>
						<div class="mt-1">
							<textarea id="about" name="about" rows="3" class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" placeholder="A stranger surfing this World Wide Web." />
						</div>
						<p class="mt-2 text-sm text-gray-500">Brief description about yourself. Markdown supported.</p>
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

	const url = ref('https://i.imgur.com/nzY5zAg.jpg');

	const onFileChange = (e) => {
		const file = e.target.files[0];
		url.value = URL.createObjectURL(file);
		URL.revokeObjectURL(file);
	}
</script>