<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="modalStore.closeModal" class="modal relative z-50">
      <!-- Backdrop -->
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80" />
      </TransitionChild>
      <!-- Modal -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-2.5 sm:p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]"
            enter-from="opacity-0 scale-90" enter-to="opacity-100 scale-100"
            leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-90">
            <DialogPanel
              class="w-full max-w-xl transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all">
              <!-- Body -->
              <div class="text-center">
                <h3 class="text-lg text-gray-800 font-bold">Crop your image</h3>
                <p class="text-gray-600">Adjust this image to your liking before uploading it.</p>
              </div>
              <div class="flex flex-col justify-center mt-4">
                <Cropper class="w-full h-[500px] bg-gray-400" :src="options.image" :stencil-props="{
                  aspectRatio: (props.type == 'banner' || props.type == 'homepage_banner') ? 5 / 1 : 1 / 1
                }" :check-orientation="false" @change="onChange" />
              </div>
              <!-- Footer -->
              <div class="mt-4 flex space-x-2 justify-between">
                <div>
                  <button type="button" class="button gray" @click="close">
                    Discard
                  </button>
                </div>
                <div class="flex space-x-2">
                  <button type="button" class="button blue" @click="useOriginal">
                    Use Original
                  </button>
                  <button class="button green" @click="modalStore.closeModal">
                    Looks good!
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
import { useModalStore } from '@/stores/StoreModal';
import { useImageStore } from '@/stores/StoreImages';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  id: {
    type: Number,
    default: null,
    required: true
  },
  type: {
    type: String,
    default: 'post'
  },
  options: {
    type: Object
  }
});

const modalStore = useModalStore();
const imageStore = useImageStore();

const close = () => {
  if (props.type == "avatar") {
    imageStore.purgeAvatar();
  } else if (props.type == "default_avatar") {
    imageStore.purgeDefaultAvatar();
  } else if (props.type == "emoji") {
    imageStore.purgeEmoji();
  } else if (props.type == "homepage_banner") {
    imageStore.purgeHomepageBanner();
  } else {
    imageStore.purgeBanner()
  }
  modalStore.closeModal();
}

const useOriginal = () => {
  // Create an image element to load the original image
  const img = new Image();
  img.onload = () => {
    // Create a canvas to convert the image to data URL
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // For emojis, ensure dimensions are within backend limits (8x8 to 512x512)
    if (props.type === "emoji") {
      const width = img.width;
      const height = img.height;

      // Check if dimensions are within limits
      if (width < 8 || height < 8) {
        // Scale up maintaining aspect ratio to meet minimum 8x8
        const scale = Math.max(8 / width, 8 / height);
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
      } else if (width > 512 || height > 512) {
        // Scale down maintaining aspect ratio to fit within 512x512
        const scale = Math.min(512 / width, 512 / height);
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
      } else {
        // Use original dimensions
        canvas.width = width;
        canvas.height = height;
      }
    } else {
      // For non-emoji types, use original dimensions
      canvas.width = img.width;
      canvas.height = img.height;
    }

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert to data URL and store in appropriate store
    // For emojis, use PNG to preserve transparency
    const dataUrl = props.type === "emoji" ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg');

    if (props.type == "avatar") {
      imageStore.setAvatar(dataUrl);
    } else if (props.type == "default_avatar") {
      imageStore.setDefaultAvatar(dataUrl);
    } else if (props.type == "emoji") {
      imageStore.setEmoji(dataUrl);
    } else if (props.type == "homepage_banner") {
      imageStore.setHomepageBanner(dataUrl);
    } else {
      imageStore.setBanner(dataUrl);
    }

    // Close the modal
    modalStore.closeModal();
  };

  // Load the original image
  img.src = props.options.image;
}

const onChange = ({ canvas }) => {
  if (props.type == "avatar") {
    imageStore.setAvatar(canvas.toDataURL('image/jpeg'));
  } else if (props.type == "default_avatar") {
    imageStore.setDefaultAvatar(canvas.toDataURL('image/jpeg'));
  } else if (props.type == "homepage_banner") {
    imageStore.setHomepageBanner(canvas.toDataURL('image/jpeg'));
  } else if (props.type == "emoji") {
    // For emojis, ensure dimensions are within backend limits (8x8 to 512x512)
    const width = canvas.width;
    const height = canvas.height;

    // Create a canvas with constrained dimensions if needed
    let outputCanvas = canvas;
    if (width > 512 || height > 512 || width < 8 || height < 8) {
      outputCanvas = document.createElement('canvas');
      const ctx = outputCanvas.getContext('2d');

      // Calculate new dimensions maintaining aspect ratio within 8x8 to 512x512
      let newWidth = Math.max(8, Math.min(512, width));
      let newHeight = Math.max(8, Math.min(512, height));

      outputCanvas.width = newWidth;
      outputCanvas.height = newHeight;
      ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
    }

    imageStore.setEmoji(outputCanvas.toDataURL('image/png'));
  } else {
    imageStore.setBanner(canvas.toDataURL('image/jpeg'));
  }
};

</script>