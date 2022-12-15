<template>
	<div>
		<p v-if="route.meta.hasRepliesDisabled" class="mb-1">
			<NuxtLink external :href="`/post/${item.post.id}/${comment.id}`">
				{{ item.post.title }}
			</NuxtLink>
		</p>
		<div :id="`comment-${comment.id}`" class="comment group flex relative" :class="{ 'opacity-60 hover:opacity-100 focus:opacity-100 items-center': isCollapsed }">
			<!-- Stretched Click Area -->
			<div v-show="isCollapsed" class="absolute w-full h-full inset z-20 cursor-pointer" @click="isCollapsed = !isCollapsed"></div>
			<!-- Comment -->
			<div class="relative flex flex-col flex-shrink-0 items-center mr-2">
				<!-- User Avatar -->
				<NuxtLink v-if="item.creator" :to="`/user/${item.creator.name}`" class="z-10">
					<img
					loading="lazy"
					:src="item.creator.avatar || 'http://placekitten.com/200/300'"
					alt="avatar"
					class="flex-shrink-0 object-cover w-6 h-6 md:w-9 md:h-9 sm:rounded-none sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"
					/>
				</NuxtLink>
				<!-- Comment Collapse Bar -->
				<div class="comment-collapse-bar dark:opacity-30 dark:hover:opacity-100" @click="isCollapsed = !isCollapsed" v-show="!isCollapsed"></div>
			</div>
			<!-- User Details -->
			<div class="flex-grow" :class="{'flex items-center':isCollapsed}">
				<div :id="comment.id" :class="{'flex flex-grow items-center leading-none':isCollapsed}">
					<div class="flex items-center min-h-[24px] sm:min-h-[36px]">
						<div class="inline-flex flex-wrap space-x-2 text-sm text-gray-500 dark:text-gray-400">
							<NuxtLink v-if="item.creator" :to="`/user/${item.creator.name}`" class="flex items-center text-sm">
								<strong>{{ item.creator.name }}</strong>
								<!-- Role -->
								<span v-if="item.creator.admin" class="ml-1 badge badge-blue">Admin</span>
							</NuxtLink>
							<!-- Parent Context Link -->
							<!--<NuxtLink v-if="comment.parent_id" :to="`#${comment.parent_id}`" v-show="!isCollapsed" class="flex items-center align-middle text-gray-400 hover:text-gray-600">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								   <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path>
								</svg>
								<span>"parent author"</span>
							</NuxtLink>-->
							<span v-show="!isCollapsed" class="space-x-2">
								<!-- Timestamp -->
								<span :title="comment.published">{{ formatDate(new Date(comment.published)) }}</span>
								<!-- Edited Timestamp -->
								<span v-if="comment.updated">
									<span class="font-black text-gray-400 dark:text-gray-500">·</span>
									<span :title="comment.updated" class="pl-1 italic">
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
					<!-- Comment Edit Form -->
					<InputsEdit v-if="isEditing" :id="comment.id" :body="comment.body" type="comment" @hasEdited="onHasEdited" @closed="isEditing = false;"/>
					<!-- Comment Text Body -->
					<div class="comment-body" v-show="!isCollapsed && !isEditing" v-html="comment.body_html"></div>
				</div>
				<!-- Comment Actions -->
				<ul class="relative flex flex-grow flex-wrap items-center space-x-4" v-show="!isCollapsed && !isEditing">
					<li>
						<!-- If logged in, allow upvoting -->
						<button v-if="isAuthed" class="text-xs font-medium" :class="[{'cursor-not-allowed':item.post.deleted},voteType === 1 ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400']" @click="vote(1)" :disabled="item.post.deleted">
							Upvote ({{ voteType === 1 ? item.counts.upvotes + 1 : item.counts.upvotes }})
						</button>
						<!-- Else, redirect to login -->
						<NuxtLink v-else to="/login" class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
							Upvote ({{ voteType === 1 ? item.counts.upvotes + 1 : item.counts.upvotes }})
						</NuxtLink>
					</li>
					<li>
						<!-- If logged in, allow downvoting -->
						<button v-if="isAuthed" class="text-xs font-medium" :class="[{'cursor-not-allowed':item.post.deleted},voteType === -1 ? 'text-secondary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400']" @click="vote(-1)" :disabled="item.post.deleted">
							Downvote ({{ voteType === -1 ? item.counts.downvotes - 1 : item.counts.downvotes }})
						</button>
						<!-- Else, redirect to login -->
						<NuxtLink v-else to="/login" class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">
							Downvote ({{ voteType === -1 ? item.counts.downvotes - 1 : item.counts.downvotes }})
						</NuxtLink>
					</li>
					<li v-if="isAuthed && !isAuthor && !route.meta.hasRepliesDisabled && !item.post.locked && !item.post.deleted">
						<button @click="isReplying = true" class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
							Reply
						</button>
					</li>
					<li v-if="isAuthed">
						<button class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400" @click="save">
							{{ isSaved ? 'Unsave' : 'Save' }}
						</button>
					</li>
					<li v-if="isAuthed && isAuthor">
						<button @click="isEditing = !isEditing" class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
							Edit
						</button>
					</li>
					<li v-if="isAuthed && isAuthor">
						<button @click="confirmDelete" class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
							Delete
						</button>
					</li>
					<li v-if="isAuthed && !isAuthor">
						<button @click="confirmReport" class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
							Report
						</button>
					</li>
					<li v-if="isAdmin && !isAuthor">
						<button @click="confirmRemove" class="text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400">
							Remove
						</button>
					</li>
				</ul>
				<!-- Write Form -->
		            <div v-if="isAuthed && isReplying" class="relative flex md:space-x-2 mt-4">
		                  <img
		                  loading="lazy"
		                  :src="userStore.user.avatar"
		                  alt="avatar"
		                  class="hidden md:inline-block flex-shrink-0 w-9 h-9 object-cover rounded-sm sm:rounded-none sm:p-0.5 sm:border bg-white"
		                  />
		                  <InputsComment :post-id="item.comment.post_id" :parent-id="item.comment.id" @closed="isReplying = false;" @comment-published="onCommentPublished"/>
		            </div>
				<!-- Replies -->
				<ListsComments v-if="!route.meta.hasRepliesDisabled && item.replies.length && level <= limit" v-show="!isCollapsed" :comments="item.replies" :offset="offset" class="relative"/>
				<!-- Continue Thread Link -->
				<NuxtLink v-if="item.replies.length && level > limit" v-show="!isCollapsed" :to="`/post/${item.post.id}/${comment.id}`" class="relative inline-block text-primary text-sm hover:underline mt-2">
					Continue this thread &#8594;
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import { baseURL } from "@/server/constants";
	import { formatDate } from '@/utils/formatDate';
	import { useLoggedInUser } from '@/stores/StoreAuth';
	import { useModalStore } from '@/stores/StoreModal';
	import { useToastStore } from '@/stores/StoreToast';
	import { useCommentsStore } from '@/stores/StoreComments';

	const route = useRoute();

      const modalStore = useModalStore();
      const toast = useToastStore();

	const userStore = useLoggedInUser();
	const isAuthed = userStore.isAuthed;

	const authCookie = useCookie("token").value;

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

	const item = ref(props.item);
	const comment = ref(props.item.comment);

	const commentsStore = useCommentsStore();
	commentsStore.comments.push(props.item);

	const isReplying = ref(false);
	const isCollapsed = ref(false);

	// take comment level and subtract offset (depth) to get relative level
	const level = computed(() => {
		return comment.value.level - props.offset
	});

	const onCommentPublished = (comment) => {
		// Append reply to list of replies.
		item.value.replies.unshift(comment);
		// Close the reply form.
		toggleReplying();
		// Navigate to comment if replies are hidden.
		if (route.meta.hasRepliesDisabled) {
			navigateTo(`/post/${item.value.post.id}/${comment.comment.parent_id}/#${comment.comment.id}`);
		};
	};

	// Vote
      const voteType = ref(item.value.my_vote);
      const vote = async (type = 0) => {
            voteType.value = voteType.value === type ? 0 : type;

            await useFetch(`/comments/${comment.value.id}/vote`, {
                  baseURL,
                  method: "post",
                  body: {
                        "score": voteType
                  },
                  headers: {
                        Authorization: authCookie ? `Bearer ${authCookie}` : '',
                  }
            })
            .then(({ data, error }) => {
                  if (data.value) {
                        data = JSON.parse(JSON.stringify(data.value));
                        console.log(data);
                  } else {
                        // Revert failed vote & show error toast.
                        setTimeout(() => {
                              voteType.value = 0;
                              toast.addNotification({
                                    header:'Vote failed',
                                    message:'Your vote failed to cast. Please try again.',
                                    type:'error'
                              });
                        }, 400);
                        // Log the error.
                        console.log(error.value);
                  };
            });
      };

      // Author
      const isAuthor = computed(() => {
      	if (userStore.user && item.value.creator) {
      		return userStore.user.name === item.value.creator.name
      	} else {
      		return false
      	}
      });

      // Admin
      const isAdmin = computed(() => {
		return !!userStore.user && userStore.user.admin
	});

      // Edit
      const isEditing = ref(false);
      const onHasEdited = (payload) => {
      	// Update comment with saved edits.
      	comment.value = payload.comment_view.comment;
      }

      // Save
      const isSaved = ref(comment.value.saved);
      const save = async () => {
      	isSaved.value = !isSaved.value;
      	await useFetch(`/comments/${comment.value.id}/save`, {
      		baseURL,
      		method: "post",
      		body: {
      			"save": !isSaved.value
      		},
      		headers: {
      			Authorization: authCookie ? `Bearer ${authCookie}` : '',
      		}
      	})
      	.then(({ data, error }) => {
      		if (data.value) {
      			data = JSON.parse(JSON.stringify(data.value));
      		} else {
                		// Revert failed save & show error toast.
      			setTimeout(() => {
      				isSaved.value = false;
      				toast.addNotification({
      					header:'Saving failed',
      					message:'Failed to save the comment. Please try again.',
      					type:'error'
      				});
      			}, 400);
                		// Log the error.
      			console.error(error.value);
      		};
      	});
      };

      // Delete
      const confirmDelete = () => {
            modalStore.setModal({
            	modal: 'ModalDelete',
            	id: comment.value.id,
            	contentType: 'comment',
            	isOpen: true
            });
      };

      // Report
      const confirmReport = () => {
            modalStore.setModal({
            	modal: 'ModalReport',
            	id: comment.value.id,
            	contentType: 'comment',
            	isOpen: true
            });
      };

      // Remove
	const confirmRemove = () => {
		modalStore.setModal({
			modal: 'ModalRemove',
			id: comment.value.id,
			contentType: 'comment',
			isOpen: true
		});
	};

	// utils
	const toggleReplying = () => {
		isReplying.value = !isReplying.value;
	};
</script>

<style scoped>
	:target::before {
		content: '';
		display: block;
		height: 3.5rem;
		margin: -3.5rem 0 0;
		pointer-events: none;
		z-index: -1;
	}
	:target::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		z-index: 0;
		animation: blinker 3000ms ease-out forwards;
		pointer-events: none;
		@apply w-full h-full bg-yellow-100
	}
	:target * {
		position: relative;
		z-index: 1;
	}
	/* Comment Body */
	.comment-body {
		@apply prose prose-sm text-gray-900 max-w-none;
	}
	.comment-body :deep(img) {
		max-width: 100px;
		aspect-ratio: auto;
	}
	@media (min-width: 768px) {
		.comment-body :deep(img) {
			max-width: 240px;
		}
		:target:before {
		    content: "";
		    display: block;
		    height: 104px;
		    margin: -104px 0 0;
		}
	}
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
	/* Animation */
	@keyframes blinker {
	  from {
	   	opacity: 100;
	  }
	  to {
	  	opacity: 0;
	  }
	}
</style>