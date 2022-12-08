<template>
	<!-- Modals -->
	<component v-if="modal" :is-open="isOpen" :id="id" :type="type" :is="components[modal]"/>
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

	const isOpen = computed(() => {
		return store.isOpen
	});

	// Import modal components.
	const modalDelete = defineAsyncComponent(() => import('@/components/dialogs/ModalDelete'));
	const modalReport = defineAsyncComponent(() => import('@/components/dialogs/ModalReport'));
	const modalRemove = defineAsyncComponent(() => import('@/components/dialogs/ModalRemove'));

	// Object lookup to select modal.
	const components = { 
		'ModalDelete': modalDelete,
		'ModalReport': modalReport,
		'ModalRemove': modalRemove
	};
</script>