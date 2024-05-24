<template>
    <NuxtLayout name="wizard">
        <div class="flex flex-col w-full">
            <div class="mb-12 flex flex-row space-x-2 items-center">
                <img :src="site.icon" class="rounded w-12 h-12">
                <h3 class="text-primary font-bold text-2xl">{{ site.name }}</h3>
            </div>
            <component :is="pages[page - 1]" />
            <div class="mt-12 flex flex-row space-x-4 w-full">
                <button class="button gray flex-grow-0" @click="back">{{ page > 1 ? 'Go back' : 'Cancel' }}</button>
                <button class="button primary flex-grow" :disabled="!wizard.boarding.canProceed"
                    @click="next">Continue</button>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { useSiteStore } from '~~/stores/StoreSite';
import { useWizardStore } from '~~/stores/StoreWizard';

const route = useRoute();
const router = useRouter();
const site = useSiteStore();
const wizard = useWizardStore();

const page = ref(parseInt(route.params.page) || 1);
const MAX_PAGE = 2;

/*if (page.value > MAX_PAGE) {
    createError({
        statusCode: 404,
        statusMessage: "That page does not exist.",
        fatal: true,
    })
}*/

definePageMeta({
    alias: ['/boards/create/:page?', '/create_board/:page?', '/+!wizard/:page?', '/+!new/:page?', '/abracadabra/:page?'],
    layout: false,
    isScrollDisabled: true,
})

// Import pages
const pageInit = defineAsyncComponent(() => import('@/components/pages/wizard/Init'));
const pageDescribe = defineAsyncComponent(() => import('@/components/pages/wizard/Describe'));

const pages = [
    pageInit,
    pageDescribe
];

const back = () => {
    if (page.value == 1) {
        router.go(-1);
    } else {
        page.value -= 1;
        router.replace({
            params: {
                page: page.value
            }
        });
    }
}

const next = () => {
    page.value += 1;
    router.replace({
        params: {
            page: page.value
        }
    });
}
</script>