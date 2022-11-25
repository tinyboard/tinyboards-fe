<template>
	<div :id="`comment-${comment.id}`" class="group flex relative" :class="{ 'opacity-60 hover:opacity-100 focus:opacity-100 items-center': isCollapsed }">
		<div v-show="isCollapsed" class="absolute w-full h-full inset z-20 cursor-pointer" @click="isCollapsed = !isCollapsed"></div>
		<div class="relative flex flex-col flex-shrink-0 items-center mr-2">
			<!-- Deleted User Comment -->
			<div class="z-10">
				<img
				loading="lazy"
				src="/assets/default_pfp.png"
				alt="avatar"
				class="flex-shrink-0 object-cover sm:rounded-none sm:p-0.5 sm:border bg-white"
				:class="isCollapsed ? 'w-6 h-6' : 'w-6 h-6 md:w-9 md:h-9'"
				/>
			</div>
			<!-- Comment Collapse Bar -->
			<div class="comment-collapse-bar dark:opacity-30 dark:hover:opacity-100" @click="isCollapsed = !isCollapsed" v-show="!isCollapsed"></div>
		</div>
		<!-- User Details -->
		<div class="flex-grow" :class="{'flex items-center':isCollapsed}">
			<div :id="comment.id" :class="isCollapsed ? 'flex flex-grow items-center leading-none' : 'mb-4'">
				<div class="flex items-center" :class="isCollapsed ? 'h-6' : 'h-6 md:h-9'">
					<div class="inline-flex flex-wrap space-x-2 text-sm text-gray-500 dark:text-gray-400">
						<span>
							Comment deleted
						</span>
						<span v-show="!isCollapsed" class="space-x-2">
							<span class="font-black text-gray-400 dark:text-gray-500">·</span>
							<!-- Timestamp -->
							<span>{{ formatDate(new Date(comment.published)) }}</span>
						</span>
						<!-- Reply Count -->
						<span v-show="isCollapsed && item.replies.length" class="flex items-center space-x-2">
							<span class="font-black text-gray-400 dark:text-gray-500">·</span>
							<span>
								{{ item.replies.length }} {{ item.replies.length === 1 ? 'reply' : 'replies' }}
							</span>
						</span>
					</div>
				</div>
			</div>
			<!-- Replies -->
			<ContentCommentList v-if="item.replies.length && level <= limit" v-show="!isCollapsed" :comments="item.replies" :offset="offset"/>
			<!-- Continue Thread Link -->
			<NuxtLink v-if="item.replies.length && level > limit" :to="`/post/${item.post.id}/${comment.id}`" class="inline-block mt-2 text-primary text-sm hover:underline">
				Continue this thread &#8594;
			</NuxtLink>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import { baseURL } from "@/server/constants";
	import { formatDate } from '@/utils/formatDate';

	const props = defineProps({
		item: Object,
		offset: {
			type: Number,
		default: 0
		},
		limit: {
			type: Number,
		default: 3
		}
	});

	const item = props.item;
	const comment = item.comment;

	const isCollapsed = ref(false);

	// take comment level and subtract offset (depth) to get relative level
	const level = computed(() => {
		return comment.level - props.offset
	});
</script>

<style scoped>
	/* Collapse Bar */
	.comment-collapse-bar {
		@apply cursor-pointer
	}
	.comment-collapse-bar:hover::before {
		@apply border-primary;
	}
	.comment-collapse-bar::before {
		content: "";
		left: calc(50% - 1px);
		width: 14px;
		height: calc(100% - 24px);
		@apply absolute bottom-0 border-l border-gray-300;
	}
</style>