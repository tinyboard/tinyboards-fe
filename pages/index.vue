<template>
      <main class="flex flex-col pt-12 sm:pt-14">
            <!-- Mobile Banner -->
            <MediaBanner
            class="relative sm:hidden"
            />
            <!-- Sub Navigation -->
            <section>
                  <NavigationNavbarSub :links="links"/>
            </section>
            <!-- Main Content -->
            <section class="container mx-auto max-w-8xl grid grid-cols-12 pt-10 sm:px-4 md:px-6">
                  <div class="col-span-full flex gap-6 py-4 sm:py-8">
                        <!-- Main Content -->
                        <NuxtLayout name="feed"/>
                        <!-- Sidebar -->
                        <NavigationSidebar />
                  </div>
            </section>
      </main>
</template>

<script setup>
      const links = [
      { name: 'Hot', href: '/feed' },
      { name: 'Latest', href: '/feed?sort=new' },
      { name: 'Top All', href: '/feed?sort=top&time=all' },
      { name: 'Top Month', href: '/feed?sort=top&time=month' },
      { name: 'Top Week', href: '/feed?sort=top&time=week' },
      { name: 'Top Day', href: '/feed?sort=top&time=day' },
      { name: 'Most Comments', href: '/feed?sort=top&time=all&type=comments' },
      { name: 'Latest Comments', href: '/feed?sort=new&type=comments' }
      ];
</script>