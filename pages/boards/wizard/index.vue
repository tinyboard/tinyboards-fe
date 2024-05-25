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
                <button class="button primary flex-grow" :disabled="!wizard.boarding.canProceed || page == MAX_PAGE"
                    @click="next">{{ page ==
                        MAX_PAGE ? `Create +${wizard.name}! 🌟` : 'Continue' }}</button>
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

const page = ref(1);
const MAX_PAGE = 4;

/*if (page.value > MAX_PAGE) {
    createError({
        statusCode: 404,
        statusMessage: "That page does not exist.",
        fatal: true,
    })
}*/

definePageMeta({
    alias: ['/boards/create', '/create_board', '/+!wizard', '/+!new', '/abracadabra'],
    layout: false,
    isScrollDisabled: true,
    'hasAuthRequired': true,
    /*middleware: [
        function (to, from) {
            const MAX_PAGE = 4;
            const page = to.params.page;

            if (page > 1 && (from.name !== 'boards-wizard-page' || page === from.params.page)) {
                return createError({
                    statusCode: 400,
                    statusMessage: "You must start from the beginning.",
                    fatal: true,
                })
            }

            if (page > MAX_PAGE) {
                return createError({
                    statusCode: 404,
                    statusMessage: "That page does not exist.",
                    fatal: true,
                })
            }
        }
    ]*/
})

// Import pages
const pageInit = defineAsyncComponent(() => import('@/components/pages/wizard/Init'));
const pageDescribe = defineAsyncComponent(() => import('@/components/pages/wizard/Describe'));
const pageImages = defineAsyncComponent(() => import('@/components/pages/wizard/Images'));
const pageColors = defineAsyncComponent(() => import('@/components/pages/wizard/Colors'));

const pages = [
    pageInit,
    pageDescribe,
    pageImages,
    pageColors
];

const back = () => {
    if (page.value == 1) {
        router.go(-1);
    } else {
        page.value -= 1;
        /*router.replace({
            params: {
                page: page.value
            }
        });*/
    }
}

const next = () => {
    page.value += 1;
    /*router.replace({
        params: {
            page: page.value
        }
    });*/
}
</script>