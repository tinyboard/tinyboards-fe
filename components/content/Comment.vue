<template>
	<li :id="`comment-${comment.id}`" class="group flex relative mt-6 first:mt-0" :class="{ 'opacity-60 hover:opacity-100 focus:opacity-100 items-center': isCollapsed }">
		<div v-show="isCollapsed" class="absolute w-full h-full inset z-20 cursor-pointer" @click="isCollapsed = !isCollapsed"></div>
		<div class="relative flex flex-col flex-shrink-0 items-center mr-2">
			<!-- User Avatar -->
			<NuxtLink v-if="item.creator" :to="`/user/${item.creator.name}`" class="z-10">
				<img
				loading="lazy"
				:src="item.creator.avatar || 'http://placekitten.com/200/300'"
				alt="avatar"
				class="flex-shrink-0 object-cover sm:rounded-none sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"
				:class="isCollapsed ? 'w-6 h-6' : 'w-6 h-6 md:w-12 md:h-12'"
				/>
			</NuxtLink>
			<!-- Deleted User Comment -->
			<div v-else class="flex items-center justify-center text-gray-400 bg-transparent border dark:border-gray-700 border-dashed rounded-sm" :class="isCollapsed ? 'w-6 h-6 text-sm' : 'w-6 h-6 md:w-12 md:h-12 text-lg'">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
				   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				   <path d="M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7"></path>
				   <line x1="10" y1="10" x2="10.01" y2="10"></line>
				   <line x1="14" y1="10" x2="14.01" y2="10"></line>
				   <path d="M10 14a3.5 3.5 0 0 0 4 0"></path>
				</svg>
			</div>
			<!-- Comment Collapse Bar -->
			<div class="comment-collapse-bar dark:opacity-30 dark:hover:opacity-100" @click="isCollapsed = !isCollapsed" v-show="!isCollapsed"/>
		</div>
		<!-- User Details -->
		<div class="flex-grow" :class="{'flex items-center':isCollapsed}">
			<div :id="comment.id" :class="{'flex flex-grow items-center leading-none':isCollapsed}">
				<div :class="{'mb-1':!isCollapsed}">
					<div class="inline-flex flex-wrap space-x-2 text-sm text-gray-500 dark:text-gray-400">
						<NuxtLink v-if="item.creator" :to="`/user/${item.creator.name}`" class="flex items-center font-bold text-sm">
							{{ item.creator.name }}
							<span v-if="item.creator.title" class="ml-1 px-1 inline-flex text-sm font-normal leading-4 rounded-sm text-blue-700 shadow-inner-white bg-blue-100 border border-blue-200">
								{{ item.creator.title }}
							</span>
						</NuxtLink>
						<span v-else class="text-gray-400 dark:text-gray-400 font-bold">
							Deleted User
						</span>
						<!-- Parent Context Link -->
						<!--<NuxtLink v-if="comment.parent_id" :to="`#${comment.parent_id}`" v-show="!isCollapsed" class="flex items-center align-middle text-gray-400 hover:text-gray-600">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path>
							</svg>
							<span>"parent author"</span>
						</NuxtLink>-->
						<span v-show="!isCollapsed" class="space-x-2">
							<span class="font-black text-gray-400 dark:text-gray-500">·</span>
							<!-- Timestamp -->
							<span>{{ formatDate(new Date(comment.published)) }}</span>
							<!-- Edited Timestamp -->
							<span v-if="comment.updated">
								<span class="font-black text-gray-400 dark:text-gray-500">·</span>
								<span class="pl-1 italic">
									Edited {{ formatDate(new Date(comment.updated)) }}
								</span>
							</span>
						</span>
						<!-- Score -->
						<span class="hidden md:flex items-center space-x-2">
							<span class="hidden md:inline-block font-black text-gray-400 dark:text-gray-500">·</span>
							<span>
								{{ item.counts.score + voteType }} {{ item.counts.score + voteType === 1 ? 'pt' : 'pts' }}
							</span>
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
				<div class="dark:text-gray-200 break-words" v-show="!isCollapsed" v-html="comment.body_html" />
			</div>
			<!-- Comment ctions -->
			<ul class="hidden md:flex flex-grow items-center space-x-4 mb-0 mt-2" v-show="!isCollapsed">
				<li>
					<button class="text-xs font-medium hover:underline" :class="voteType === 1 ? 'text-primary' : 'text-gray-500 hover:text-gray-600 dark:text-gray-400'" @click="vote(1)">
						Upvote ({{ voteType === 1 ? item.counts.upvotes + 1 : item.counts.upvotes }})
					</button>
				</li>
				<li>
					<button class="text-xs font-medium hover:underline" :class="voteType === -1 ? 'text-orange-600' : 'text-gray-500 hover:text-gray-600 dark:text-gray-400'" @click="vote(-1)">
						Downvote ({{ voteType === -1 ? item.counts.downvotes - 1 : item.counts.downvotes }})
					</button>
				</li>
				<li v-if="isAuthed">
					<button class="text-xs font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 hover:underline" @click="isReplying = true;">
						Reply
					</button>
				</li>
			</ul>
			<!-- Rich Text Editor -->
			<!-- Write Form -->
            <div v-if="isAuthed && isReplying" class="flex md:space-x-3 mt-3">
                  <img
                  loading="lazy"
                  :src="userStore.user.avatar"
                  alt="avatar"
                  class="hidden md:inline-block flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12 object-cover rounded-sm sm:rounded-none sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"
                  />
                  <InputsComment :post-id="item.comment.post_id" :parent-id="item.comment.id" @closed="onClosed" @comment-published="onCommentPublished"/>
            </div>
			<!-- Replies -->
			<ContentCommentList v-if="item.replies.length && level <= limit" v-show="!isCollapsed" :comments="item.replies" :offset="offset"/>
			<!-- Continue Thread Link -->
			<NuxtLink v-if="item.replies.length && level > limit" :to="`/post/${item.post.id}/${comment.id}`" class="inline-block mt-2 text-primary text-sm hover:underline">
				Continue this thread &#8594;
			</NuxtLink>
		</div>
	</li>
</template>

<script setup>
	import { computed, ref } from 'vue';

	import { formatDate } from '@/utils/formatDate';

	import { useLoggedInUser } from '@/stores/StoreAuth';

	import { useVote } from '@/composables/vote';
	import { useSave } from '@/composables/save';

	const userStore = useLoggedInUser();
    const isAuthed = userStore.isAuthed;

	const { voteType, vote } = useVote();
	const { isSaved, save } = useSave();

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

	let item = props.item;
	let comment = item.comment;

	let isReplying = ref(false);
	let isCollapsed = ref(false);

	// take comment level and subtract offset (depth) to get relative level
	const level = computed(() => {
		return comment.level - props.offset
	});

	const onClosed = () => {
		isReplying.value = false;
	}

	const onCommentPublished = (comment) => {
		// Close the reply form.
		toggleReplying();
		// Append reply to list of replies.
        item.replies.unshift(comment);
    };

	// utils
	const toggleReplying = () => {
		isReplying.value = !isReplying.value;
	};
</script>

<style scoped>
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
	/*.comment-collapse-bar.reply::before {
		height: calc(100% - 24px);
	}*/
</style>