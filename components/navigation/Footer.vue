<template>
	<footer class="w-full bg-transparent border-t dark:bg-secondary dark:border-white/10">
		<div class="mx-auto max-w-8xl py-5 px-4 sm:px-6 md:px-8">
			<ul class="flex flex-wrap md:flex-nowrap md:items-center md:space-x-2 -mx-2 gap-2 md:gap-0">
				<li v-for="link in links" :key="link.name" class="flex-shrink-0 text-xs leading-normal">
					<NuxtLink :to="link.href" custom v-slot="{ isActive }">
						<span class="font-bold text-gray-500 hover:text-primary p-2">
							{{ link.name }}
						</span>
					</NuxtLink>
				</li>
			</ul>
			<p class="mt-2 text-xs text-gray-400">
				Powered by TinyBoards. Handcrafted by community members.
			</p>
		</div>
	</footer>
</template>

<script setup>
// Define footer links
const links = [
{ name: 'About', href: '/help/about' },
{ name: 'Blog', href: '/members' },
{ name: 'House Rules', href: '/help/rules' },
// { name: 'Terms', href: '/terms' },
// { name: 'Privacy', href: '/privacy' },
// { name: 'Source Code', href: '/source-code' }
]
</script>