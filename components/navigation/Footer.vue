<template>
	<footer class="w-full bg-transparent sm:border-t dark:bg-secondary dark:border-white/10">
		<div class="mx-auto max-w-8xl py-5 px-2.5 sm:px-6 md:px-8">
			<ul class="flex justify-center sm:justify-start gap-2 -mx-2">
				<li v-for="link in links" :key="link.name" class="flex-shrink-0 text-xs leading-normal">
					<NuxtLink :to="link.href" custom v-slot="{ isActive }">
						<span class="font-bold text-gray-500 hover:text-primary px-2">
							{{ link.name }}
						</span>
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
// { name: 'Terms', href: '/terms' },
// { name: 'Privacy', href: '/privacy' },
// { name: 'Source Code', href: '/source-code' }
]
</script>