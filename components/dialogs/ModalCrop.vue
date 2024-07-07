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
                  aspectRatio: props.type == 'banner' ? 5 / 1 : 1 / 1
                }" :check-orientation="false" @change="onChange" />
              </div>
              <!-- Footer -->
              <div class="mt-4 flex space-x-2 justify-end">
                <button type="button" class="button gray" @click="close">
                  Discard
                </button>
                <button class="button green" @click="modalStore.closeModal">
                  Looks good!
                </button>
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
  } else {
    imageStore.purgeBanner()
  }
  modalStore.closeModal();
}

const onChange = ({ canvas }) => {
  if (props.type == "avatar") {
    imageStore.setAvatar(canvas.toDataURL('image/jpeg'));
  } else if (props.type == "default_avatar") {
    imageStore.setDefaultAvatar(canvas.toDataURL('image/jpeg'));
  } else {
    imageStore.setBanner(canvas.toDataURL('image/jpeg'));
  }
};

</script>