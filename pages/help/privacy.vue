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
                    title="Privacy Policy"
                    sub-title="How we handle your personal information"
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
                    <h2>Privacy Policy</h2>
                    <p>
                        This Privacy Policy describes how we collect, use, and handle your information.
                    </p>

                    <h3>Information We Collect</h3>
                    <p>
                        We collect information you provide directly to us, such as when you create an account,
                        post content, or communicate with us.
                    </p>

                    <h3>How We Use Your Information</h3>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services.
                    </p>

                    <h3>Information Sharing</h3>
                    <p>
                        We do not sell, trade, or otherwise transfer your personal information to third parties
                        without your consent, except as described in this policy.
                    </p>

                    <h3>Data Security</h3>
                    <p>
                        We implement appropriate security measures to protect your personal information.
                    </p>

                    <h3>Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us.
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
    title: "Privacy Policy",
});

const links = [
    { name: "About", href: "/help/about" },
    { name: "Rules", href: "/help/rules" },
    { name: "Terms", href: "/help/terms" },
    { name: "Privacy", href: "/help/privacy" },
];
</script>