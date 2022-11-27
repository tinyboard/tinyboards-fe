<template>
	<NuxtLayout name="inbox">
		<!-- Messages -->
		<div v-if="messages.length">
		</div>
		<!-- Empty State -->
		<div v-else class="px-4 py-24 text-center text-gray-500 bg-white md:border md:rounded-md md:shadow-inner-xs">
			<p>
				<span class="font-medium">
					There are no mentions in your inbox...
				</span>
				<br/>
				you must not be popular
			</p>
		</div>
	</NuxtLayout>
</template>

<script setup>
	definePageMeta({
		'hasAuthRequired': true,
		'hasRepliesDisabled': true
	});

	const messages = [];
</script>