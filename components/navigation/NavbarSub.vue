<template>
	<div class="fixed w-full bg-gray-100 sm:border-b border-black/10 dark:bg-secondary dark:border-white/10 z-40">
	    <div class="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-0">
	          <ul class="flex items-center">
	                <li class="text-sm leading-6" v-for="link in navigation" :key="link.name">
	                      <NuxtLink :to="link.href" custom v-slot="{ isActive, href, navigate }">
	                      	<a :href="link.href" @click="navigate" :class="[isActive ? 'text-primary shadow-[0_1px_0_rgba(var(--color-primary))]' : 'text-gray-500 hover:text-primary', 'px-4 py-2 block']">
	                      		{{ link.name }}
	                      	</a>
	                      </NuxtLink>
	                </li>
	          </ul>
	    </div>
	</div>
</template>

<script setup>
// Define sub-navigation menu links
const navigation = [
	{ name: 'Feed', href: '/feed' },
	{ name: 'Leaderboard', href: '/learderboard' },
	{ name: 'Members', href: '/members' },
	{ name: 'House Rules', href: '/rules' },
	{ name: 'Wiki', href: '/wiki' }
]
</script>