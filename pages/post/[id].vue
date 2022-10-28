<template>
	<main class="flex pt-12 sm:pt-14">
            <!-- Sub Navigation -->
            <section>
                  <NavigationNavbarSub :links="links" disableActiveClass/>
            </section>
            <!-- Main Content -->
            <section class="container mx-auto max-w-8xl grid grid-cols-12 pt-10 sm:px-4 md:px-6">
	    		<div class="col-span-full flex gap-6 py-8 my-2.5 sm:my-0">
	                <!-- Main Content -->
	                 <NuxtLayout name="post"/>
	                <!-- Sidebar -->
	                <NavigationSidebarPost />
                 </div>
            </section>
      </main>
</template>

<script setup>
const links = [
      { name: 'Comments', href: '#comments' },
];

</script>