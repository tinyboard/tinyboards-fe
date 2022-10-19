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
		<!-- Feed -->
		<ContentItemTable title="Hot posts"/>
	</div>
</template>