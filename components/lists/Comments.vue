<template>
	<!-- List of Comments -->
	<ul v-if="comments.length" class="mt-4 first:mt-0 first-of-type:mt-0">
		<li v-for="item in comments" :key="item.comment.id" class="mt-4 first:mt-0">
			<component v-if="item" :item="item" :is="item.comment.deleted || item.comment.removed ? commentRemoved : comment"/>
		</li>
	</ul>
</template>

<script setup>
	import { defineAsyncComponent } from 'vue';

	const props = defineProps({
		comments: Array,
		offset: {
			type: Number,
			default: 0
		}
	});

	// Import comment components.
	const comment = defineAsyncComponent(() => import('@/components/cards/Comment'));
	const commentRemoved = defineAsyncComponent(() => import('@/components/cards/CommentRemoved'));

	/*
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
