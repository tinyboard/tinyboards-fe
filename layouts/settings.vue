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
import { useLoggedInUser } from '@/stores/StoreAuth';
import { requireModPermission } from '@/composables/mod';
const route = useRoute();
const site = useSiteStore();
const boardStore = useBoardStore();
const user = useLoggedInUser();

const isBoardActive = boardStore.board && Object.keys(boardStore.board).length > 0;
const board = isBoardActive ? boardStore.board : null;
const boardName = isBoardActive ? board?.name : "";
const isMod = isBoardActive ? (board?.myModPermissions !== 0 || user.adminLevel > 0) : false;

// Check specific mod permissions (admins have all permissions)
const hasConfigPerms = computed(() => user.adminLevel > 0 || (isBoardActive && requireModPermission(board?.myModPermissions || 0, 'config')));
const hasAppearancePerms = computed(() => user.adminLevel > 0 || (isBoardActive && requireModPermission(board?.myModPermissions || 0, 'appearance')));
const hasEmojiPerms = computed(() => user.adminLevel > 0 || (isBoardActive && requireModPermission(board?.myModPermissions || 0, 'emoji')));
const hasUserPerms = computed(() => user.adminLevel > 0 || (isBoardActive && requireModPermission(board?.myModPermissions || 0, 'users')));

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

const boardLinks = computed(() => {
    const links = [];

    if (hasConfigPerms.value) {
        links.push({ name: "General", href: `/b/${boardName}/mod/` });
        links.push({ name: "Sections", href: `/b/${boardName}/mod/sections` });
        links.push({ name: "Reactions", href: `/b/${boardName}/mod/reactions` });
        links.push({ name: "Sidebar", href: `/b/${boardName}/mod/sidebar` });
    }

    if (hasAppearancePerms.value) {
        links.push({ name: "Appearance", href: `/b/${boardName}/mod/appearance` });
    }

    if (hasEmojiPerms.value) {
        links.push({ name: "Emojis", href: `/b/${boardName}/mod/emojis` });
    }

    if (hasUserPerms.value) {
        links.push({ name: "Mods", href: `/b/${boardName}/mod/mods` });
        links.push({ name: "Banned Users", href: `/b/${boardName}/mod/bans` });
    }

    return links;
});
</script>
