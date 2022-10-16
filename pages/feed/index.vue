<template>
	<main class="flex pt-12 sm:pt-14">
	    <!-- Sub Navigation -->
	    <section>
	          <NavigationNavbarSub />
	    </section>
	    <!-- Main Content -->
	    <section class="container mx-auto max-w-8xl grid grid-cols-12 pt-10 px-4 sm:px-6">
	    	<div class="col-span-full flex gap-6 py-8 my-2.5 sm:my-0">
	            <!-- Main Content -->
	             <NuxtLayout name="feed"/>
	            <!-- Sidebar -->
	            <NavigationSidebar />
	    	</div>
	    </section>
	</main>
</template>