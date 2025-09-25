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
            <form @submit.prevent="onSubmit" @submit="submitSettings()">
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
import { onFileChange, uploadFile } from "@/composables/images";
import { useGraphQLMutation } from "@/composables/useGraphQL";

const boardStore = useBoardStore();
const board = boardStore.board;
const modalStore = useModalStore();
const imageStore = useImageStore();

const settings = ref(JSON.parse(JSON.stringify(board)));

const primaryColor = ref(toHexCode(settings.value.primary_color));
const secondaryColor = ref(toHexCode(settings.value.secondary_color));
const hoverColor = ref(toHexCode(settings.value.hover_color));

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

    // upload images
    if (imageStore.avatar) {
        const avatar = dataURLtoFile(imageStore.avatar);
        // after converting to file is finished, delete the original b64 url
        imageStore.purgeAvatar();

        try {
            settings.value.icon = await uploadFile(avatar, "avatar");
        } catch (e) {
            console.error(e);
            isLoading.value = false;
            return;
        }
    }

    if (imageStore.banner) {
        const banner = dataURLtoFile(imageStore.banner);
        // after converting to file is finished, delete the original b64 url
        imageStore.purgeBanner();

        try {
            settings.value.banner = await uploadFile(banner, "banner");
        } catch (e) {
            console.error(e);
            isLoading.value = false;
            return;
        }
    }

    try {
        const mutation = `
            mutation updateBoardSettings($input: UpdateBoardSettingsInput!) {
                updateBoardSettings(input: $input) {
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
        `;

        const { data: result } = await useGraphQLMutation(mutation, {
            variables: {
                input: {
                    id: board.id,
                    icon: settings.value.icon,
                    banner: settings.value.banner,
                    primaryColor: toRGB(primaryColor.value),
                    secondaryColor: toRGB(secondaryColor.value),
                    hoverColor: toRGB(hoverColor.value),
                }
            }
        });

        if (result.value?.updateBoardSettings?.board) {
            // Show success toast.
            toast.addNotification({
                header: "Settings saved",
                message: "Board appearance was updated!",
                type: "success",
            });

            // Update the board store with new data
            boardStore.setBoard({
                ...board,
                icon: result.value.updateBoardSettings.board.icon,
                banner: result.value.updateBoardSettings.board.banner,
                primaryColor: result.value.updateBoardSettings.board.primaryColor,
                secondaryColor: result.value.updateBoardSettings.board.secondaryColor,
                hoverColor: result.value.updateBoardSettings.board.hoverColor
            });

            window.location.reload(true);
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
        // Log the error.
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
</script>
