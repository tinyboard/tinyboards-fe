<template>
  <main class="flex flex-col pt-12 sm:pt-14">
    <!-- Sub Navigation & Banner -->
    <section class="flex flex-col">
      <NavigationNavbarSub :links="links" class="sm:order-first" />
      <div
        class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6"
      >
        <!-- Banner -->
        <CardsBanner
          title="House Rules"
          sub-title="Please follow these when chilling out here."
          image-url="/img/artwork/front-page.jpeg"
          class="col-span-full"
        />
      </div>
    </section>
    <!-- Main Content -->
    <section
      class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6"
    >
      <div class="col-span-full flex gap-6">
        <!-- Main Content -->
        <div class="w-full">
          <!-- Rules -->
          <div class="prose prose-sm dark:prose-invert">
            <h2>Rules</h2>
            <p>
              Violating any of these rules can result in a ban. The moderators
              reserve the right to update these rules at anytime. In general,
              don't be a jerk.
            </p>
            <ol>
              <li>
                Be nice to each other - do not bully or harass other members.
              </li>
              <li>No illegal content - zero tolerance.</li>
            </ol>
          </div>
        </div>
        <!-- Sidebar -->
        <ContainersSidebar />
      </div>
    </section>
  </main>
</template>

<script setup>
import { useSiteStore } from "@/stores/StoreSite";
const site = useSiteStore();

useHead({
  title: `${site.name} | Rules`,
  meta: [
    {
      property: "og:title",
      content: `${site.name} | Rules`,
    },
  ],
});

const links = [
  { name: "Get Started", href: "/help/get-started" },
  { name: "About", href: "/help/about" },
  { name: "FAQ", href: "/help/faq" },
  { name: "House Rules", href: "/help/rules" },
  {
    name: "Formatting Guide",
    href: "https://www.markdownguide.org/cheat-sheet/",
    target: "_blank",
    isExternal: true,
  },
];
</script>
