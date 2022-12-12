<template>
	<NuxtLayout name="default">
		<main class="flex flex-col pt-12 sm:pt-14">
		<!-- Main Content -->
		<section class="container mx-auto max-w-8xl my-48 px-4 sm:px-6">
			<div class="flex flex-col items-center justify-center">
				<!-- Alert -->
				<div class="p-4 bg-white border rounded-md shadow-inner-white">
					<div class="flex items-center">
						<h1 class="text-2xl md:text-4xl leading-normal font-bold dark:text-gray-100">
							{{ error.statusCode }}
						</h1>
					</div>
					<hr class="my-2"/>
					<p class="text-gray-600">
						{{ error.statusMessage }}
					</p>
					<ul class="mt-2 pl-4 flex flex-col list-disc">
						<li>
							<NuxtLink external to="/feed">Go to home</NuxtLink>
						</li>
					</ul>
				</div>
			</div>
		</section>
	</main>
	</NuxtLayout>
</template>

<script setup>
	const props = defineProps({ error: Object });

	onMounted(() => console.log(props.error))
</script>