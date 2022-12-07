<template>
	<div class="col-span-full">
		<div class="flex flex-col">
			This user was removed.
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		user: {
			type: Object,
			required: true
		}
	})
</script>