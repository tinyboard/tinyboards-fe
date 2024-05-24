<template>
    <main id="layout-wizard" class="h-full grid grid-cols-1 md:grid-cols-12">
        <section class="relative col-span-full md:col-span-4 min-[2000px]:col-span-3 h-full bg-white">
            <div class="absolute top-5 left-5 flex flex-row items-center">
                <img :src="v.avatar" class="w-12 h-12 border p-0.5 bg-white mr-2" />
                <h4 class="text-gray-400 font-bold">@</h4>
                <h4 class="text-gray-700 font-bold">{{ v.name }}</h4>
            </div>
            <div class="mx-12 flex h-full items-center">
                <slot />
            </div>
        </section>
        <section class="hidden md:block md:col-span-8 bg-primary bg-opacity-20">
            <div class="h-[99vh] flex min-[2000px]:col-span-9 justify-center items-center">
                <CardsBoardPreview />
            </div>
        </section>
    </main>
</template>

<script setup>
import { useSiteStore } from '@/stores/StoreSite';
import { useLoggedInUser } from '~~/stores/StoreAuth';

const site = useSiteStore();
const userStore = useLoggedInUser();

const v = userStore.user;

useHead({
    title: `${site.name} | Board Creator Wizard 🪄`,
    meta: [
        {
            property: 'og:title',
            content: `${site.name} | Board Creator Wizard 🪄`
        }
    ],
    style: [
        `
			:root {
				--color-primary: ${site.primaryColor} !important;
				--color-secondary: ${site.secondaryColor} !important;
				--color-primary-hover: ${site.hoverColor} !important;
			}
			`,
    ],
    link: [
        {
            rel: 'icon',
            type: `image/png`,
            href: site.icon
        },
    ]
});
</script>