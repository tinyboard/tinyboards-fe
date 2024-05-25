<template>
    <div class="space-y-4">
        <h1 class="text-4xl text-gray-800 font-bold">Upload some images 🖼️</h1>
        <p class="text-gray-700">What is +{{ board.name }} without a good banner, after all?</p>
        <div>
            <label class="text-base font-bold leading-6 text-gray-900">Icon</label>

            <!-- Inputs -->
            <div class="flex items-center">
                <img v-if="imageStore.avatar" :src="imageStore.avatar"
                    class="w-20 h-20 object-cover p-0.5 border bg-white" />
                <div v-else class="w-20 h-20 rounded-md border border-gray-300 border-dashed"></div>
                <div class="ml-5">
                    <label for="avatar-upload" class="inline-block button gray cursor-pointer">
                        {{ imageStore.avatar ? 'Change icon' : 'Upload icon' }}
                    </label>
                    <input id="avatar-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif"
                        @change="e => onFileChange(e, 'avatar')" />
                    <small class="block mt-2 text-gray-400">
                        PNG, JPG <span class="line-through">and GIF</span> up to 1MB.
                    </small>
                </div>
            </div>
        </div>
        <div>
            <label class="text-base font-bold leading-6 text-gray-900">Banner</label>
            <!-- Inputs -->
            <div class="flex flex-col">
                <img v-if="imageStore.banner" :src="imageStore.banner"
                    class="w-full h-24 object-cover p-0.5 border bg-white" />
                <div v-else class="w-full h-24 rounded-md border border-gray-300 border-dashed"></div>
                <div class="mt-5">
                    <label for="banner-upload" class="inline-block button gray cursor-pointer">
                        {{ imageStore.banner ? 'Change banner' : 'Upload banner' }}
                    </label>
                    <input id="banner-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif"
                        @change="e => onFileChange(e, 'banner')" />
                    <small class="block mt-2 text-gray-400">
                        PNG, JPG <span class="line-through">and GIF</span> up to 3MB. Recommended 1390x192 pixels.
                    </small>
                </div>
            </div>
        </div>
        <p class="text-sm text-gray-600">This step can be skipped.</p>
    </div>
</template>

<script setup>
import { useWizardStore } from '@/stores/StoreWizard';
import { useImageStore } from '@/stores/StoreImages';
import { useModalStore } from '@/stores/StoreModal';
import { useToastStore } from '@/stores/StoreToast';
import { ref } from 'vue';

const board = useWizardStore();
const imageStore = useImageStore();
const modalStore = useModalStore();
const toast = useToastStore();

// File inputs
const onFileChange = (e, type) => {
    console.log("file change");
    const file = e.target.files[0];

    const maxFileSize = type == "avatar" ? 1024 * 1024 : 3 * 1024 * 1024;

    if (file.size > maxFileSize) {
        toast.addNotification({ header: 'Your files are too large!', message: `Max size for ${type}s is ${type == 'avatar' ? 1 : 3}MB.`, type: 'error' });
        console.error("Image too large");
        return;
    }

    modalStore.setModal({
        modal: "ModalCrop",
        id: 0,
        contentType: type,
        isOpen: true,
        options: {
            image: URL.createObjectURL(file)
        }
    });
};
</script>