<template>
	<footer class="mx-auto max-w-8xl bg-transparent sm:border-t dark:bg-secondary dark:border-white/10">
		<div class="py-4 px-4 sm:px-6 md:px-8">
			<ul>
				<li class="flex items-center space-x-1 -mx-2 text-xs leading-normal">
					<NuxtLink v-for="link in navigation" :key="link.name" :to="link.href" custom v-slot="{ isActive }">
						<span class="font-medium text-gray-500 hover:text-primary p-2">
							{{ link.name }}
						</span>
					</NuxtLink>
				</li>
			</ul>
			<p class="mt-1 text-xs text-gray-400">
				Handcrafted by community members.
			</p>
		</div>
	</footer>
</template>

<script setup>
// Define sub-navigation menu links
const navigation = [
{ name: 'About', href: '/about' },
{ name: 'FAQ', href: '/learderboard' },
{ name: 'Blog', href: '/members' },
{ name: 'House Rules', href: '/rules' },
{ name: 'Terms', href: '/terms' },
{ name: 'Privacy', href: '/privacy' },
{ name: 'Source Code', href: '/source-code' }
]
</script>