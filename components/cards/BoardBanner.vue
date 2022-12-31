<template>
	<div id="banner" class="flex flex-row space-x-6 items-center p-4 sm:px-12 sm:py-4 bg-gray-200/50 sm:rounded-md sm:shadow-inner-white bg-cover bg-center lights" :style="{ backgroundImage: `url(${board.banner_url || 'https://i.imgur.com/O4ivfHf.jpg'})` }">
        <img :src="board.icon_url || 'https://i.imgur.com/mt4KFVX.png'" class="w-28 h-28 rounded-md border border-gray-400" />
		<div class="relative flex flex-col justify-between overflow-hidden">
			<h1 class="text-3xl text-gray-100 leading-9 font-extrabold">
				{{ board.title || board.name }}
			</h1>
            <h6 class="font-bold text-gray-100 text-sm">
                /b/{{ board.name }}
            </h6>
			<p class="text-base text-lg text-gray-200 leading-7 truncate text-ellipsis max-w-md sm:max-w-2xl">
				{{ board.description || 'this text will eventually be customizable by mods' }}
			</p>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps(['board']);
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

	.lights::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		height: 57px;
		width: 100%;
		background:url(https://i.imgur.com/BdGY6tH.png);
		animation: lights 1s infinite steps(2);
		pointer-events: none;
	}
	@keyframes lights {
		0% {
			/*Two zeros, not one !!*/
			/*[0] is equivalent to [0 50%] and will create a different animation */
			background-position:0 0; 
		} 
		100% {
			background-position:0 -138px;
		}
	}
</style>