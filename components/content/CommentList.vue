<template>
	<div class="mt-5 first:mt-0">
		<!-- List of Comments -->
		<div v-if="comments.length">
			<ContentComment v-for="comment in comments" :key="comment.id" :comment="comment"></ContentComment>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		comments: Array,
		offset: {
			type: Number,
			default: 0
		}
	});

	// ======================================================================
	// TO-DO:
	// Decide whether we want to adjust limit based on mobile or desktop.
	// Client-side required to calculate window width.
	// Use a Nuxt feature to ignore this code during server-side rendering.
	// ======================================================================
 
	// let windowWidth = window.innerWidth;
	// const txt = '';

	// const onResize = () => { // set windowWidth to browser window width
	// 	windowWidth = window.innerWidth
	// }

	// onMounted(() => {
	// 	nextTick(() => {
	// 		window.addEventListener('resize', onResize);
	// 	});
	// })

	// onBeforeMount(() => {
	// 	window.removeEventListener('resize', onResize); 
	// })
</script>
