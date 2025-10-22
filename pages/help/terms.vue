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
                    title="Terms of Service"
                    sub-title="Terms and conditions for using this service"
                    :image-url="site.homepageBanner"
                    :icon-type="site.homepageBanner ? undefined : 'posts'"
                    class="col-span-full"
                />
            </div>
        </section>
        <!-- Main Content -->
        <section
            class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6"
        >
            <div class="col-span-full max-w-4xl mx-auto">
                <div class="prose prose-sm dark:prose-invert">
                    <h2>Terms of Service</h2>
                    <p>
                        By using this service, you agree to the following terms and conditions.
                    </p>

                    <h3>Acceptable Use</h3>
                    <p>
                        You agree to use this service responsibly and in accordance with all applicable laws.
                    </p>

                    <h3>Content</h3>
                    <p>
                        You are responsible for any content you post or share on this platform.
                    </p>

                    <h3>Privacy</h3>
                    <p>
                        Your privacy is important to us. Please review our Privacy Policy for more information.
                    </p>

                    <p class="text-sm text-gray-500 mt-8">
                        Last updated: {{ new Date().toLocaleDateString() }}
                    </p>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { useSiteStore } from "@/stores/StoreSite";
const site = useSiteStore();

definePageMeta({
    isLeftNavbarDisabled: true,
});

useHead({
    title: "Terms of Service",
});

const links = [
    { name: "About", href: "/help/about" },
    { name: "Rules", href: "/help/rules" },
    { name: "Terms", href: "/help/terms" },
    { name: "Privacy", href: "/help/privacy" },
];
</script>