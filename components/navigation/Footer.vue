<template>
	<footer class="w-full bg-transparent sm:border-t dark:bg-secondary dark:border-white/10">
		<div class="mx-auto max-w-8xl py-5 px-2.5 sm:px-6">
			<ul class="flex justify-center sm:justify-start gap-2 -mx-1">
				<li v-for="link in links" :key="link.name" class="px-1 flex-shrink-0">
					<NuxtLink :to="link.href" class="text-xs text-gray-500 hover:text-primary">
						<strong>{{ link.name }}</strong>
					</NuxtLink>
				</li>
			</ul>
			<p class="mt-2 text-xs text-gray-400 text-center sm:text-left">
				Powered by TinyBoards. Handcrafted by community members.
			</p>
		</div>
	</footer>
</template>

<script setup>
	// Define footer links
	const links = [
		{ name: 'About', href: '/help/about' },
		{ name: 'Members', href: '/members' },
		{ name: 'House Rules', href: '/help/rules' },
		]
</script>