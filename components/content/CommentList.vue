<template>
	<!-- List of Comments -->
	<ul v-if="comments.length" class="mt-5 first:mt-0">
		<ContentComment v-for="comment in comments" :key="comment.comment.id" :item="comment"></ContentComment>
	</ul>
</template>

<script setup>
	const props = defineProps({
		comments: Array,
		offset: {
			type: Number,
			default: 0
		}
	});

	/*console.log('ok');
	let error = props.commentData.error;

	let comments = ref([]);
	//if (!error.value) {
	console.log('getting items');
	comments.value = props.commentData.listing.value.comments;
	console.log('done');*/
	//}

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
