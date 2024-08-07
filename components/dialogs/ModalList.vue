<template>
    <!-- Modals -->
    <component
        v-if="modal"
        :is-open="isOpen"
        :id="id"
        :type="type"
        :options="options"
        :is="components[modal]"
    />
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from "vue";
import { useModalStore } from "@/stores/StoreModal";

// Define state and its variables.
const store = useModalStore();

const modal = computed(() => {
    return store.modal;
});

const id = computed(() => {
    return store.id;
});

const type = computed(() => {
    return store.contentType;
});

const options = computed(() => {
    return store.options;
});

const isOpen = computed(() => {
    return store.isOpen;
});

// Import modal components.
const modalDelete = defineAsyncComponent(
    () => import("@/components/dialogs/ModalDelete"),
);
const modalReport = defineAsyncComponent(
    () => import("@/components/dialogs/ModalReport"),
);
const modalSticky = defineAsyncComponent(
    () => import("@/components/dialogs/ModalSticky"),
);
const modalLock = defineAsyncComponent(
    () => import("@/components/dialogs/ModalLock"),
);
const modalRemoveOrApprove = defineAsyncComponent(
    () => import("@/components/dialogs/ModalRemoveOrApprove"),
);
const modalAdmin = defineAsyncComponent(
    () => import("@/components/dialogs/ModalAdmin"),
);
const modalMod = defineAsyncComponent(
    () => import("@/components/dialogs/ModalMod"),
);
const modalLeaveAdmin = defineAsyncComponent(
    () => import("@/components/dialogs/ModalLeaveAdmin"),
);
const modalLeaveMod = defineAsyncComponent(
    () => import("@/components/dialogs/ModalLeaveMod"),
);
const modalTransferOwnership = defineAsyncComponent(
    () => import("@/components/dialogs/ModalTransferOwnership"),
);
const modalBan = defineAsyncComponent(
    () => import("@/components/dialogs/ModalBan"),
);
const modalPurge = defineAsyncComponent(
    () => import("@/components/dialogs/ModalPurge"),
);
const modalImage = defineAsyncComponent(
    () => import("@/components/dialogs/ModalImage"),
);
const modalDrop = defineAsyncComponent(
    () => import("@/components/dialogs/ModalDrop"),
);
const modalThemes = defineAsyncComponent(
    () => import("@/components/dialogs/ModalThemes"),
);
const modalCrop = defineAsyncComponent(
    () => import("@/components/dialogs/ModalCrop"),
);
const modalOptions = defineAsyncComponent(
    () => import("@/components/dialogs/ModalOptions"),
);

// Object lookup to select modal.
const components = {
    ModalDelete: modalDelete,
    ModalReport: modalReport,
    ModalSticky: modalSticky,
    ModalLock: modalLock,
    ModalRemoveOrApprove: modalRemoveOrApprove,
    ModalAdmin: modalAdmin,
    ModalMod: modalMod,
    ModalLeaveAdmin: modalLeaveAdmin,
    ModalLeaveMod: modalLeaveMod,
    ModalTransferOwnership: modalTransferOwnership,
    ModalBan: modalBan,
    ModalPurge: modalPurge,
    ModalImage: modalImage,
    ModalDrop: modalDrop,
    ModalThemes: modalThemes,
    ModalCrop: modalCrop,
    ModalOptions: modalOptions,
};
</script>
