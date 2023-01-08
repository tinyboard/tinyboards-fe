<template>
	<!-- Modals -->
	<component v-if="modal" :is-open="isOpen" :id="id" :type="type" :options="options" :is="components[modal]"/>
</template>

<script setup>
	import { computed, defineAsyncComponent, ref } from 'vue';
	import { useModalStore } from '@/stores/StoreModal';

	// Define state and its variables.
	const store = useModalStore();

	const modal = computed(() => {
		return store.modal
	});

	const id = computed(() => {
		return store.id
	});

	const type = computed(() => {
		return store.contentType
	});

	const options = computed(() => {
		return store.options
	});

	const isOpen = computed(() => {
		return store.isOpen
	});

	// Import modal components.
	const modalDelete = defineAsyncComponent(() => import('@/components/dialogs/ModalDelete'));
	const modalReport = defineAsyncComponent(() => import('@/components/dialogs/ModalReport'));
	const modalSticky = defineAsyncComponent(() => import('@/components/dialogs/ModalSticky'));
	const modalLock = defineAsyncComponent(() => import('@/components/dialogs/ModalLock'));
	const modalRemove = defineAsyncComponent(() => import('@/components/dialogs/ModalRemove'));
	const modalAdmin = defineAsyncComponent(() => import('@/components/dialogs/ModalAdmin'));
	const modalBan = defineAsyncComponent(() => import('@/components/dialogs/ModalBan'));
	const modalPurge = defineAsyncComponent(() => import('@/components/dialogs/ModalPurge'));
	const modalImage = defineAsyncComponent(() => import('@/components/dialogs/ModalImage'));

	// Object lookup to select modal.
	const components = { 
		'ModalDelete': modalDelete,
		'ModalReport': modalReport,
		'ModalSticky': modalSticky,
		'ModalLock': modalLock,
		'ModalRemove': modalRemove,
		'ModalAdmin': modalAdmin,
		'ModalBan': modalBan,
		'ModalPurge': modalPurge,
		'ModalImage': modalImage
	};
</script>