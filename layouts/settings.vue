<template>
    <main id="layout-settings" class="flex flex-col pt-12 sm:pt-14">
        <!-- Sub Navigation & Banner -->
        <section class="flex flex-col">
            <NavigationNavbarSub
                v-if="(isBoardActive && isMod) || !isBoardActive"
                :links="isBoardActive ? boardLinks : profileLinks"
                class="sm:order-first"
            />
            <div
                class="order-first sm:order-last container mx-auto max-w-4xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6"
            >
                <!-- Banner -->
                <CardsBanner
                    v-if="!isBoardActive"
                    class="col-span-full"
                    title="Settings"
                    sub-title="Manage your public profile and more."
                    image-url="''"
                />
            </div>
        </section>
        <!-- Main Content -->
        <section
            class="container mx-auto grid grid-cols-12 sm:px-4 sm:py-6 md:px-6"
            :class="[
                route.meta.maxWidth
                    ? `max-w-${route.meta.maxWidth}`
                    : 'max-w-4xl',
            ]"
        >
            <div class="col-span-full flex flex-col gap-6">
                <!-- Settings -->
                <slot />
            </div>
        </section>
    </main>
</template>

<script setup>
import { useSiteStore } from "@/stores/StoreSite";
import { useBoardStore } from "@/stores/StoreBoard";
const route = useRoute();
const site = useSiteStore();
const boardStore = useBoardStore();

const isBoardActive = boardStore.board && Object.keys(boardStore.board).length > 0;
const board = isBoardActive ? boardStore.board : null;
const boardName = isBoardActive ? board?.name : "";
const isMod = isBoardActive ? board?.myModPermissions !== 0 : false;

definePageMeta({
    isLeftNavbarDisabled: true,
});

// useHead({
// 	title: `${site.name} | ${route.meta.title ?? 'profile'}`,
// 	meta: [{ property: 'og:title',
// 		content: `${site.name} | ${route.meta.title}`
// 	}]
// });

const profileLinks = [
    { name: "Profile", href: "/settings/" },
    { name: "Account", href: "/settings/account" },
    { name: "Notifications", href: "/settings/notifications" },
    { name: "Content", href: "/settings/content" },
    { name: "Hidden", href: "/settings/hidden" },
];

const boardLinks = [
    { name: "General", href: `/b/${boardName}/mod/settings` },
    { name: "Appearance", href: `/b/${boardName}/mod/appearance` },
    { name: "Sidebar", href: `/b/${boardName}/mod/sidebar` },
    { name: "Mods", href: `/b/${boardName}/mod/mods` },
    { name: "Banned Users", href: `/b/${boardName}/mod/bans` },
];
</script>
