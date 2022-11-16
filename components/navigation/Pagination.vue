<template>
	<slot
	:startPage="startPage"
	:endPage="endPage"
	:pages="pages"
	:isFirstPage="isFirstPage"
	:isLastPage="isLastPage"
	:onClickFirstPage="onClickFirstPage"
	:onClickPreviousPage="onClickPreviousPage"
	:onClickPage="onClickPage"
	:onClickNextPage="onClickNextPage"
	:onClickLastPage="onClickLastPage"
	:isPageActive="isPageActive"
	/>
</template>

<script setup>
	import { computed } from 'vue';

	// Define emit
	const emit = defineEmits(['inFocus', 'submit'])

	// Props
	const props = defineProps({
		maxVisibleButtons: {
			type: Number,
			required: false,
			default: 3
		},
		totalPages: {
			type: Number,
			required: true
		},
		total: {
			type: Number,
			required: true
		},
		perPage: {
			type: Number,
			required: true
		},
		currentPage: {
			type: Number,
			required: true
		},
	});

	// Computed properties
	const startPage = computed(() => {
		if (props.currentPage <= 1) {
			return 1;
		} else if (props.currentPage === props.totalPages) { 
			return props.totalPages - props.maxVisibleButtons + 1;
		} else {
			return props.currentPage - 1;
		}
	});

	const endPage = computed(() => {
		return Math.min(startPage.value + props.maxVisibleButtons - 1, props.totalPages);
	});

	const pages = computed(() => {
		const range = [];

		for (let i = startPage.value; i <= endPage.value; i+= 1 ) {
			range.push({
				name: i,
				isDisabled: i === props.currentPage 
			});
		}

		return range;
	});

	const isFirstPage = computed(() => {
		return props.currentPage <= 1;
	});

	const isLastPage = computed(() => {
		return props.currentPage === props.totalPages;
	});

	// Methods
	const onClickFirstPage = () => {
		emit('pagechanged', 1);
	}

	const onClickPreviousPage = () => {
		emit('pagechanged', props.currentPage - 1);
	}

	const onClickPage = (page) => {
		emit('pagechanged', page);
	}

	const onClickNextPage = () => {
		emit('pagechanged', props.currentPage + 1);
	}

	const onClickLastPage = () => {
		emit('pagechanged', props.totalPages);
	}

	const isPageActive = (page) => {
		return props.currentPage === page;
	}
</script>