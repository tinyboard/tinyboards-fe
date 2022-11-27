<template>
	<NuxtLayout name="inbox">
		<!-- Messages -->
		<div v-if="messages.length">
		</div>
		<!-- Empty State -->
		<div v-else class="px-4 py-24 text-center text-gray-400 md:border md:border-dashed md:border-gray-300 md:rounded-md">
			There are no unread messages. You must not be popular.
		</div>
	</NuxtLayout>
</template>

<script setup>
	definePageMeta({
		'hasRepliesDisabled': true
	});

	const messages = [];
</script>