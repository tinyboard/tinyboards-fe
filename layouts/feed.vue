<template>
	<div class="w-full">
		<!-- Banner -->
		<MediaBanner class="mb-6"/>
		<!-- Filters -->
		<div class="flex justify-between mb-4">
			<div></div>
			<NuxtLink to="/submit" class="button primary flex items-center">
		        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
				   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				   <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
				   <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
				</svg>
		        <span>New post</span>
		    </NuxtLink>
		</div>
		<!-- Loading State -->
		<div v-if="pending">
			Loading...
		</div>
		<!-- Feed -->
		<ContentItemTable v-else-if="posts" :posts="posts" title="Hot posts"/>
		<!-- Error State -->
		<div v-else-if="error">
			There was an error loading posts.
		</div>
		<!-- Empty State -->
		<div v-else class="p-4 text-center text-gray-400 md:border md:border-dashed md:border-gray-300 md:rounded-lg">
			There are no posts.
		</div>
	</div>
</template>

<script setup>
	import { getListing } from '@/composables/posts';

	let { posts, paginate, pending, error, refresh } = await getListing({
		sort: "new",
		limit: 25
	}, "posts");
</script>