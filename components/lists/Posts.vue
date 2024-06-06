<template>
	<div id="posts-list" class="flex flex-col" :class="isCompact ? 'border-y sm:border-x rounded-md divide-y' : 'space-y-2 sm:space-y-4'">
		<CardsPost v-for="post in posts" :item="post" :key="post.post.id" :isCompact="isCompact" :boardPage="boardPage" />
	</div>
</template>
<script setup>
import { computed } from 'vue';
import { useLoggedInUser } from '@/stores/StoreAuth';
import { formatDate } from '@/utils/formatDate';

const route = useRoute();

const props = defineProps({
	posts: {
		type: Array,
		required: true
	},
	isCompact: {
		type: Boolean
	},

});

const boardPage = computed(() => route.params.hasOwnProperty('board'));
console.log(props.boardPage);
</script>