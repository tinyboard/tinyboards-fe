<template>
      <main class="flex pt-12 sm:pt-14">
            <!-- Sub Navigation -->
            <section>
                  <NavigationNavbarSub :links="links"/>
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

<script setup>
      const links = [
            { name: 'Hot', href: '/feed' },
            { name: 'Latest', href: '/learderboard' },
            { name: 'Top All', href: '/members' },
            { name: 'Top Month', href: '/rules' },
            { name: 'Top Week', href: '/rules' },
            { name: 'Top Day', href: '/wiki' },
            { name: 'Most Comments', href: '/wiki' },
            { name: 'Latest Comments', href: '/wiki' }
      ];
</script>