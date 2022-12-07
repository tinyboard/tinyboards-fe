<template>
	<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl my-48 px-4 sm:px-6">
			<div class="flex flex-col items-center justify-center">
				<!-- Alert -->
				<div class="p-4 bg-white border rounded-md shadow-inner-white">
					<div class="flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600 mr-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						   <path d="M14.274 10.291a4 4 0 1 0 -5.554 -5.58m-.548 3.453a4.01 4.01 0 0 0 2.62 2.65"></path>
						   <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 1.147 .167m2.685 2.681a4 4 0 0 1 .168 1.152v2"></path>
						   <line x1="3" y1="3" x2="21" y2="21"></line>
						</svg>
						<h1 class="text-lg md:text-xl leading-normal font-bold dark:text-gray-100">
							The user you are looking for is no more.
						</h1>
					</div>
					<hr class="my-2"/>
					<p class="text-gray-600">
						This user {{ user.is_deleted ? 'deleted their account' : 'was removed by the site admins' }}, and their content is no longer available. Try visiting a different profile.
					</p>
					<ul class="mt-2 pl-4 flex flex-col list-disc">
						<li>
							<NuxtLink to="/feed">Go to home</NuxtLink>
						</li>
					</ul>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
	import { format, parseISO } from "date-fns";

	const props = defineProps({
		user: {
			type: Object,
			required: true
		}
	});
</script>

<style scoped>
	#details > * {
		z-index: 10;
	}
	#details::before {
		content: '';
		background: rgba(0,0,0,0.9);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0,0,0,0.9) 60%);
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 0;
		@apply sm:rounded-b-lg;
	}
</style>