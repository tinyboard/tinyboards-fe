<template>
	<div class="relative flex flex-col items-end w-full">
		<textarea placeholder="Write a comment..." rows="4" class="block w-full min-h-[48px] rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" :value="props.body"/>
		<div class="flex space-x-2 mt-2">
			<button class="button white" @click="$emit('cancel')">Cancel</button>
			<button class="button primary">Save changes</button>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		body: 'String'
	})
</script>