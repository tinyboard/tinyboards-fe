<template>
    <NuxtLayout name="wizard">
        <div class="flex flex-col w-full">
            <div class="mb-12 flex flex-row space-x-2 items-center">
                <img :src="site.icon" class="rounded w-12 h-12">
                <h3 class="text-primary font-bold text-2xl">{{ site.name }}</h3>
            </div>
            <div v-if="!site.enableBoards">
                <h1 class="text-3xl font-bold">Boards are disabled</h1>
                <p class="text-gray-600 my-6">Boards are turned off for {{ site.name }}.<br /><br />Sorry, even the wizard can't do the impossible.</p>
                <NuxtLink to="/feed" class="mt-6">
                    <button class="button gray">Go home</button>
                </NuxtLink>
            </div>
            <div v-else-if="isBanned">
                <h1 class="text-3xl font-bold">You are banned</h1>
                <p class="text-gray-600 my-6">Bruh.</p>
                <NuxtLink to="/feed" class="mt-6">
                    <button class="button gray">Go home</button>
                </NuxtLink>
            </div>
            <div v-else-if="adminRequired">
                <h1 class="text-3xl font-bold">Board creation restricted</h1>
                <p class="text-gray-600 my-6">Only admins can create new boards for some reason, it seems.</p>
                <NuxtLink to="/feed" class="mt-6">
                    <button class="button gray">Go home</button>
                </NuxtLink>
            </div>
            <component v-else :is="pages[page - 1]" />
            <div v-if="site.enableBoards && !(adminRequired || isBanned)" class="mt-12 flex flex-row space-x-4 w-full">
                <button class="button gray flex-grow-0" @click="back">{{ page > 1 ? 'Go back' : 'Cancel' }}</button>
                <button class="button primary flex-grow" :disabled="!board.boarding.canProceed || isLoading"
                    @click="next">{{ page ==
                        MAX_PAGE ? `Create +${board.name}! 🌟` : 'Continue' }}</button>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { useSiteStore } from '~~/stores/StoreSite';
import { useLoggedInUser } from '@/stores/StoreAuth';
import { useWizardStore } from '~~/stores/StoreWizard';
import { requirePermission } from '@/composables/admin';
import { useImageStore } from '@/stores/StoreImages';
import { useToastStore } from '@/stores/StoreToast';
import { toRGB } from '@/composables/colors';
import { uploadFile } from '@/composables/images';

const route = useRoute();
const router = useRouter();
const site = useSiteStore();
const board = useWizardStore();
const userStore = useLoggedInUser();
const imageStore = useImageStore();
const toast = useToastStore();

const isBanned = userStore.user.is_banned;
const adminRequired = site.boardCreationAdminOnly && !requirePermission("boards");

const page = ref(1);
const MAX_PAGE = 4;
const isLoading = ref(false);

/*if (page.value > MAX_PAGE) {
    createError({
        statusCode: 404,
        statusMessage: "That page does not exist.",
        fatal: true,
    })
}*/

definePageMeta({
    alias: ['/boards/create', '/create_board', '/abracadabra'],
    layout: false,
    isScrollDisabled: true,
    'hasAuthRequired': true,
    /*middleware: [
        function (to, from) {
            const MAX_PAGE = 4;
            const page = to.params?.page;

            if (page > 1 && (from.name !== 'boards-wizard-page' || page === from.params?.page)) {
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
    if (page.value == MAX_PAGE) {
        createBoard();
    } else {
        page.value += 1;
    }
    
    /*router.replace({
        params: {
            page: page.value
        }
    });*/
}



    const createBoard = async () => {
        isLoading.value = true;

        let [icon, banner] = ['', ''];

        // upload images
        if (imageStore.avatar) {
            const avatar = dataURLtoFile(imageStore.avatar);
            // after converting to file is finished, delete the original b64 url
            imageStore.purgeAvatar();

            try {
                icon = await uploadFile(avatar, 'avatar');
            } catch (e) {
                console.error(e);
                isLoading.value = false;
                return;
            }
        }

        if (imageStore.banner) {
            const bannerFile = dataURLtoFile(imageStore.banner);
            // after converting to file is finished, delete the original b64 url
            imageStore.purgeBanner();

            try {
                banner = await uploadFile(bannerFile, 'banner');
            } catch (e) {
                console.error(e);
                isLoading.value = false;
                return;
            }
        }

        try {
            // Use GraphQL mutation for board creation
            const response = await useAsyncGql({
                operation: 'createBoard',
                variables: {
                    input: {
                        name: board.name,
                        title: board.displayName,
                        description: board.description,
                        primaryColor: toRGB(board.primaryColor),
                        secondaryColor: toRGB(board.secondaryColor),
                        hoverColor: toRGB(board.hoverColor),
                        icon: icon,
                        banner: banner
                }
                }
            });
            const { createBoard: boardResponse } = response.data.value;

            if (boardResponse?.board) {
                const name = board.name;
                board.clear();

                // Add to user's joined and modded boards
                userStore.addJoinedBoard(boardResponse.board);
                userStore.addModdedBoard(boardResponse.board);

                // Show success message
                toast.addNotification({
                    header: 'Board created!',
                    message: `Successfully created +${name}`,
                    type: 'success'
                });

                // Navigate to the newly created board
                router.push(`/+${name}?welcome=true`);
            } else {
                throw new Error('Board creation returned null response');
            }
        } catch (error) {
            console.error('Board creation error:', error);
            toast.addNotification({
                header: 'Creation failed',
                message: 'Failed to create board. Please try again.',
                type: 'error'
            });
            isLoading.value = false;
        }
    };
</script>