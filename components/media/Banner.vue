<template>
	<div id="banner" class="flex items-center justify-between p-4 sm:px-12 sm:py-8 bg-gray-200/50 sm:rounded-md sm:shadow-inner-white bg-cover bg-center" :style="{ backgroundImage: `url(${imageUrl})` }">
		<div class="relative overflow-hidden">
			<h1 class="text-2xl text-gray-100 leading-9 font-bold">
				{{ title }}
			</h1>
			<p class="text-base text-gray-200 leading-7 truncate text-ellipsis max-w-md sm:max-w-2xl">
				{{ subTitle }}
			</p>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		title: {
			type: String,
			default: "Feed"
		},
		subTitle: {
			type: String,
			default: "The front-page of foruhm. All your posts are belong to us."
		},
		imageUrl: {
			type: String,
			default: "https://i.imgur.com/HRYqKAf.jpg"
		}
	});
</script>

<style scoped>
	#banner {
		position: relative;
	}
	#banner > * {
		z-index: 10;
	}
	#banner::before {
		content: '';
		background: rgba(0,0,0,0.9);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0,0,0,0.8) 70%);
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		@apply sm:rounded-b-lg;
	}
</style>