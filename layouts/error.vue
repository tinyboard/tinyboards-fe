<template>
	<div id="layout-error" class="relative flex flex-1 flex-col overflow-hidden">
		<nav class="fixed w-full z-50">
			<div class="mx-auto max-w-8xl px-4 sm:px-6">
				<h1 class="sr-only">{{ site.name }}</h1>
			</div>
		</nav>
		<main class="relative flex flex-1 flex-col overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
			<section class="relative flex flex-1 flex-col items-center justify-center">
				<NuxtLink external to="/" class="font-bold text-2xl text-white mb-8">
					<img :src="site.icon" class="inline-block mr-2 max-w-[32px] max-h-[32px]" />
					<span>{{ site.name }}</span>
				</NuxtLink>
				<slot/>
			</section>
		</main>
		<footer class="relative mx-auto max-w-8xl bg-transparent">
			<div class="py-4 px-4 sm:px-6 md:px-8">
				<ul>
					<li class="flex items-center space-x-1 -mx-2 text-xs leading-normal">
						<NuxtLink external v-for="link in links" :key="link.name" :to="link.href" custom v-slot="{ isActive }">
							<span class="text-white/50 hover:text-white p-2">
								{{ link.name }}
							</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</footer>
		<DialogsToastList />
		<canvas id="space" class="fixed inset-0 z-[-1] pointer-events-none"></canvas>
	</div>
</template>

<script setup>
	import { useSiteStore } from '@/stores/StoreSite.js';

	const route = useRoute();
	const site = useSiteStore();

	// useHead({
	// 	title: `${site.name} | ${route.meta.title ?? 'Error'}`,
	// 	meta: [{ property: 'og:title',
	// 		content: `${site.name} | ${route.meta.title}`
	// 	}]
	// });

	const links = [
		{ name: 'About', href: '/help/about' },
		{ name: 'FAQ', href: '/help' },
		{ name: 'House Rules', href: '/help/rules' },
		];

	// https://codepen.io/hfer/pen/VQyqLg
	if (process.client) {
		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame
		})();

		var canvas = document.getElementById("space");
		var c = canvas.getContext("2d");

		var numStars = 900;
		var radius = '0.'+Math.floor(Math.random() * 9) + 1;
		var focalLength = canvas.width *2;

		var centerX, centerY;

		var stars = [], star;
		var i;

		var animate = true;

		initStars();
	}

	function executeFrame(){
		if (animate) {
			requestAnimFrame(executeFrame);
			moveStars();
			drawStars();
		}
	}

	function initStars(){
		centerX = canvas.width / 2;
		centerY = canvas.height / 2;

		stars = [];
		for(i = 0; i < numStars; i++){
			star = {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				z: Math.random() * canvas.width,
				o: `0.${Math.floor(Math.random() * 99) + 1}`
			};
			stars.push(star);
		}
	}

	function moveStars(){
		for(i = 0; i < numStars; i++){
			star = stars[i];
			star.z--;

			if(star.z <= 0){
				star.z = canvas.width;
			}
		}
	}

	function drawStars() {
		var pixelX, pixelY, pixelRadius;

  		// Resize to screen
		if(canvas.width != window.innerWidth || canvas.width != window.innerWidth){
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			initStars();
		}

		c.fillStyle = "rgba(0,0,0,1)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		c.fillStyle = `rgba(255, 255, 255, ${radius}`;
		for(i = 0; i < numStars; i++){
			star = stars[i];

			pixelX = (star.x - centerX) * (focalLength / star.z);
			pixelX += centerX;
			pixelY = (star.y - centerY) * (focalLength / star.z);
			pixelY += centerY;
			pixelRadius = 1 * (focalLength / star.z);

			c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
			c.fillStyle = `rgba(255, 255, 255, ${star.o})`
		}
	}

	if (process.client) {
		executeFrame();
	}
</script>