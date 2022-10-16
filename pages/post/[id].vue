<template>
	<main class="flex pt-12 sm:pt-14">
            <!-- Sub Navigation -->
            <section>
                  <NavigationNavbarSub />
            </section>
            <!-- Main Content -->
            <section class="container mx-auto max-w-7xl max-w-7xl grid grid-cols-12 pt-10">
	    		<div class="col-span-full flex gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-0 my-2.5 sm:my-0">
	                <!-- Main Content -->
	                 <NuxtLayout name="post"/>
	                <!-- Sidebar -->
	                <NavigationSidebarPost />
                 </div>
            </section>
      </main>
</template>