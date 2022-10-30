<template>
	<div>
		<!-- Messages -->
		<div v-if="messages.length">
		</div>
		<!-- Empty State -->
		<div v-else class="px-4 py-24 text-center text-gray-400 md:border md:border-dashed md:border-gray-300 md:rounded-md">
			There are no replies. You must not be popular.
		</div>
	</div>
</template>

<script setup>
	definePageMeta({ layout: "inbox" });

	const messages = [];
</script>