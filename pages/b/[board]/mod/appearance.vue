<template>
    <NuxtLayout name="settings">
        <div
            class="flex flex-col bg-white overflow-hidden shadow-inner-xs sm:border sm:rounded-md"
        >
            <!-- Page Heading & Description -->
            <div class="p-4 border-b">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                    Styling
                </h3>
                <p class="mt-1 text-sm text-gray-600">
                    The cool things about your board.
                </p>
            </div>
            <!-- Form -->
            <form @submit.prevent="submitSettings">
                <div class="flex flex-col space-y-6 divide-y bg-white p-4">
                    <!-- Photo -->
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <!-- Label -->
                        <div class="md:col-span-1">
                            <label
                                class="text-base font-bold leading-6 text-gray-900"
                                >Avatar</label
                            >
                        </div>
                        <!-- Inputs -->
                        <div
                            class="mt-4 md:col-span-2 md:mt-0 flex items-center"
                        >
                            <img
                                v-if="imageStore.avatar || settings.icon"
                                :src="imageStore.avatar ?? settings.icon"
                                class="w-20 h-20 object-cover p-0.5 border bg-white"
                            />
                            <div
                                v-else
                                class="w-20 h-20 rounded-md border border-gray-300 border-dashed"
                            ></div>
                            <div class="ml-5">
                                <label
                                    for="avatar-upload"
                                    class="inline-block button gray cursor-pointer"
                                >
                                    {{
                                        settings.icon
                                            ? "Change avatar"
                                            : "Upload avatar"
                                    }}
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    class="hidden"
                                    accept="image/png, image/jpeg, image/gif"
                                    @change="(e) => onFileChange(e, 'avatar')"
                                />
                                <small class="block mt-2 text-gray-400">
                                    PNG, JPG and GIF up to 2MB.
                                </small>
                            </div>
                        </div>
                    </div>
                    <!-- Banner -->
                    <div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
                        <!-- Label -->
                        <div class="md:col-span-1">
                            <label
                                class="text-base font-bold leading-6 text-gray-900"
                                >Banner</label
                            >
                        </div>
                        <!-- Inputs -->
                        <div class="mt-4 md:col-span-2 md:mt-0 flex flex-col">
                            <img
                                v-if="imageStore.banner || settings.banner"
                                :src="imageStore.banner ?? settings.banner"
                                class="w-full h-24 object-cover p-0.5 border bg-white"
                            />
                            <div
                                v-else
                                class="w-full h-24 rounded-md border border-gray-300 border-dashed"
                            ></div>
                            <div class="mt-5">
                                <label
                                    for="banner-upload"
                                    class="inline-block button gray cursor-pointer"
                                >
                                    {{
                                        settings.banner
                                            ? "Change banner"
                                            : "Upload banner"
                                    }}
                                </label>
                                <input
                                    id="banner-upload"
                                    type="file"
                                    class="hidden"
                                    accept="image/png, image/jpeg, image/gif"
                                    @change="(e) => onFileChange(e, 'banner')"
                                />
                                <small class="block mt-2 text-gray-400">
                                    PNG, JPG
                                    <span class="line-through">and GIF</span> up
                                    to 3MB. Recommended 1390x192 pixels.
                                </small>
                            </div>
                        </div>
                    </div>
                    <!-- Colors -->
                    <div class="md:grid md:grid-cols-3 md:gap-6 pt-4 md:pt-6">
                        <!-- Label -->
                        <div class="md:col-span-1">
                            <label
                                class="text-base font-bold leading-6 text-gray-900"
                                >Colors</label
                            >
                        </div>
                        <!-- Input -->
                        <div
                            class="mt-4 md:col-span-2 md:mt-0 flex flex-col space-y-6"
                        >
                            <div
                                class="flex flex-row justify-between border-2 rounded px-6 py-3 items-center space-x-2 w-full"
                                :style="{ 'border-color': primaryColor }"
                            >
                                <div>
                                    <h3 class="text-gray-800 font-bold">
                                        Primary color
                                    </h3>
                                    <p class="text-sm text-gray-500">
                                        The primary color used almost
                                        everywhere.
                                    </p>
                                </div>
                                <LazyPopoversColorPicker
                                    :color="primaryColor"
                                    @color-changed="
                                        (newValue) => (primaryColor = newValue)
                                    "
                                />
                            </div>
                            <div
                                class="flex flex-row justify-between border-2 rounded px-6 py-3 items-center space-x-2 w-full"
                                :style="{ 'border-color': secondaryColor }"
                            >
                                <div>
                                    <h3 class="text-gray-800 font-bold">
                                        Secondary color
                                    </h3>
                                    <p class="text-sm text-gray-500">
                                        The secondary color, used where the
                                        primary color isn't.
                                    </p>
                                </div>
                                <LazyPopoversColorPicker
                                    :color="secondaryColor"
                                    @color-changed="
                                        (newValue) =>
                                            (secondaryColor = newValue)
                                    "
                                />
                            </div>
                            <div
                                class="flex flex-row justify-between border-2 rounded px-6 py-3 items-center space-x-2 w-full"
                                :style="{ 'border-color': hoverColor }"
                            >
                                <div>
                                    <h3 class="text-gray-800 font-bold">
                                        Hover color
                                    </h3>
                                    <p class="text-sm text-gray-500">
                                        Color of things with the primary color
                                        when you hover over them.
                                    </p>
                                </div>
                                <LazyPopoversColorPicker
                                    :color="hoverColor"
                                    @color-changed="
                                        (newValue) => (hoverColor = newValue)
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Footer -->
                <div class="bg-gray-50 shadow-inner-white border-t p-4">
                    <button
                        type="submit"
                        class="button primary"
                        :class="{ loading: isLoading }"
                        :disabled="isLoading"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    </NuxtLayout>
</template>
<script setup>
import { ref } from "vue";
import { useToastStore } from "@/stores/StoreToast";
import { useBoardStore } from "@/stores/StoreBoard";
import { useAPI } from "@/composables/api";
import { useModalStore } from "@/stores/StoreModal";
import { useImageStore } from "@/stores/StoreImages";
import { dataURLtoFile } from "@/utils/files";
import { toHexCode, toRGB } from "@/composables/colors";
import { onFileChange } from "@/composables/images";
import { useGraphQLMutation } from "@/composables/useGraphQL";
import { useGqlMultipart } from "@/composables/graphql_multipart";

const boardStore = useBoardStore();
const board = boardStore.board;
const modalStore = useModalStore();
const imageStore = useImageStore();

// Ensure board exists before proceeding
if (!board) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Board not found'
    });
}

const settings = ref(JSON.parse(JSON.stringify(board)));

const primaryColor = ref(toHexCode(settings.value.primary_color || '#3B82F6'));
const secondaryColor = ref(toHexCode(settings.value.secondary_color || '#6B7280'));
const hoverColor = ref(toHexCode(settings.value.hover_color || '#2563EB'));

definePageMeta({
    hasAuthRequired: true,
    alias: ["/+:board/mod/a", "/+:board/mod/appearance"],
    isLeftNavbarDisabled: true,
});

useHead({
    title: `${board.name} Settings`,
});

const toast = useToastStore();

const isLoading = ref(false);

const submitSettings = async () => {
    isLoading.value = true;

    // Prepare files for upload
    const files = {};
    if (imageStore.avatar) {
        files["iconFile"] = dataURLtoFile(imageStore.avatar);
        imageStore.purgeAvatar();
    }

    if (imageStore.banner) {
        files["bannerFile"] = dataURLtoFile(imageStore.banner);
        imageStore.purgeBanner();
    }

    try {
        // Validate color values before sending
        const primaryRGB = toRGB(primaryColor.value);
        const secondaryRGB = toRGB(secondaryColor.value);
        const hoverRGB = toRGB(hoverColor.value);

        if (!primaryRGB || !secondaryRGB || !hoverRGB) {
            throw new Error('Invalid color values. Please check your color selections.');
        }

        const { data: result } = await useGqlMultipart({
            query: `
                mutation UpdateBoardSettings(
                    $input: UpdateBoardSettingsInput!,
                    $iconFile: Upload,
                    $bannerFile: Upload
                ) {
                    updateBoardSettings(
                        input: $input,
                        iconFile: $iconFile,
                        bannerFile: $bannerFile
                    ) {
                        board {
                            id
                            name
                            title
                            description
                            icon
                            banner
                            primaryColor
                            secondaryColor
                            hoverColor
                        }
                    }
                }
            `,
            variables: {
                input: {
                    boardId: board.id,
                    primaryColor: primaryRGB,
                    secondaryColor: secondaryRGB,
                    hoverColor: hoverRGB,
                },
                iconFile: null,
                bannerFile: null
            },
            files
        });

        if (result.value?.updateBoardSettings?.board) {
            const updatedBoard = result.value.updateBoardSettings.board;

            // Update the board store with new data
            boardStore.setBoard({
                ...board,
                icon: updatedBoard.icon,
                banner: updatedBoard.banner,
                primaryColor: updatedBoard.primaryColor,
                secondaryColor: updatedBoard.secondaryColor,
                hoverColor: updatedBoard.hoverColor
            });

            // Show success toast
            toast.addNotification({
                header: "Settings saved",
                message: "Board appearance was updated!",
                type: "success",
            });

            // Use router navigation instead of hard reload
            await navigateTo(`/b/${board.name}`);
        } else {
            throw new Error('Failed to update board appearance');
        }
    } catch (error) {
        // Show error toast.
        toast.addNotification({
            header: "Saving failed",
            message: "Board appearance failed to save.",
            type: "error",
        });
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
</script>
