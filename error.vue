<template>
	<NuxtLayout name="error">
		<div class="flex flex-col items-center justify-center">
			<!-- Alert -->
			<div class="p-4 bg-white border rounded-md shadow-inner-white">
				<div class="flex items-center space-x-2">
					<h1 class="text-2xl md:text-4xl leading-normal font-bold dark:text-gray-100">
						{{ error.statusCode }}
					</h1>
					<h1 class="text-xl md:text-3xl leading-normal font-bold text-gray-600 dark:text-gray-300">
						{{ errorCodes[error.statusCode] || "" }}
					</h1>
				</div>
				<hr class="my-2" />
				<p class="text-gray-600">
					{{ error.statusMessage }}
				</p>
				<ul v-if="error.statusCode != 502" class="mt-2 pl-4 flex flex-col list-disc">
					<li>
						<NuxtLink @click="router.go(-1)" to="#">Go back</NuxtLink>
					</li>
					<li>
						<NuxtLink external to="/feed">Go to home</NuxtLink>
					</li>
				</ul>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup>
const props = defineProps({ error: Object });
const router = useRouter();

onMounted(() => console.log(props.error));

/*useHead({
	title: `${error.value.statusCode} ${errorCodes[error.statusCode] || ""}`
})*/

const errorCodes = {
	400: "Bad request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not found",
	500: "Internal server error",
	502: "Bad Gateway"
}
</script>