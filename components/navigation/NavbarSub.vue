<template>
	<div class="fixed w-full bg-gray-100 sm:border-b border-black/10 dark:bg-secondary dark:border-white/10 z-40">
	    <div class="mx-auto max-w-8xl flex items-center justify-between px-4 sm:px-6">
	          <ul class="flex items-center">
	                <li class="text-sm leading-7" v-for="link in links" :key="link.name">
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
const route = useRoute()

// Sub-navigation links by page type
const feed = [
	{ name: 'Hot', href: '/feed' },
	{ name: 'Latest', href: '/learderboard' },
	{ name: 'Top All', href: '/members' },
	{ name: 'Top Month', href: '/rules' },
	{ name: 'Top Week', href: '/rules' },
	{ name: 'Top Day', href: '/wiki' },
	{ name: 'Most Comments', href: '/wiki' },
	{ name: 'Latest Comments', href: '/wiki' }
];

const profile = [
	{ name: 'Overview', href: '/user' },
	{ name: 'Posts', href: '/user/:id/posts' },
	{ name: 'Comments', href: '/user/:username/comments' }
];

const post = [
	{ name: 'Comments', href: '/comments' },
];

// Select links by page type
let links = [];

switch(true) {
  case route.name === 'index':
    links = feed;
    break;
  case route.name === 'user-username':
    links = profile;
    break;
  case route.name === 'post-id':
    links = post;
    break;
  default:
    links = feed;
} 
</script>