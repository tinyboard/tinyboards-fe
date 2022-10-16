<template>
	<div class="w-full p-4 lg:p-6 bg-gray-200/50 shadow-inner-xs rounded-lg">
	      <!-- Banner -->
	      <div class="col-span-full mb-5 -mt-1">
	            <h1 class="text-base text-gray-500 dark:text-gray-100">
	                  <strong>What are you currently pondering?</strong>
	                  Share it with the community.
	                  <NuxtLink to="/sign-up">Sign up to post</NuxtLink>
	            </h1>
	      </div>
	      <!-- Filters -->
	      <!-- Feed -->
	      <ContentItemList />
	</div>
</template>