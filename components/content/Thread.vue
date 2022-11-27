<template>
	<div class="relative w-full flex flex-col space-y-6">
		<div class="w-full sm:p-4 bg-white sm:border sm:shadow-inner-xs sm:rounded-md">
			<!-- Pinned Banner -->
			<div v-if="item.counts.stickied" class="flex items-center mb-4 bg-white border-t border-b sm:border sm:rounded-md overflow-hidden">
				<div class="flex items-center justify-center w-10 h-10 bg-white border-r">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="text-primary w-4 h-4">
						<path fill-rule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="text-base text-primary pl-3">This post has been pinned by the moderators.</div>
			</div>
			<!-- Post Body -->
			<!-- Post Meta Information & Content -->
			<div class="flex flex-shrink-0 items-center justify-between p-2.5 sm:p-0 border-b sm:border-0 dark:border-gray-700 dark:border-opacity-70">
				<div class="flex items-center w-full overflow-x-auto">
					<!-- Avatar -->
					<NuxtLink v-if="item.creator" :to="`/user/${item.creator.name}`" class="mr-2">
						<img
						loading="lazy"
						:src="item.creator.avatar || 'http://placekitten.com/200/300'"
						alt="avatar"
						class="flex-shrink-0 w-9 h-9 object-cover rounded-sm sm:rounded-none sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"
						/>
					</NuxtLink>
					<!-- Deleted User -->
					<img
					v-else
					loading="lazy"
					src="/assets/default_pfp.png"
					alt="avatar"
					class="mr-2 flex-shrink-0 w-9 h-9 object-cover rounded-sm sm:rounded-none sm:p-0.5 sm:border bg-white"
					/>
					<div class="flex flex-col leading-normal">
						<NuxtLink v-if="item.creator" :to="`/user/${item.creator.name}`" class="flex items-center text-sm font-bold">
							{{ item.creator.name }}
							<!-- Title -->
							<span v-if="item.creator.title" class="ml-1 px-1 inline-flex text-sm font-normal leading-4 rounded-sm text-blue-700 shadow-inner-white bg-blue-100 border border-blue-200">
								{{ item.creator.title }}
							</span>
							<!-- Role -->
						</NuxtLink>
						<span v-else class="text-sm text-gray-400 dark:text-gray-400 font-bold">
							deleted user
						</span>
						<p class="flex items-center space-x-2 text-sm text-gray-400">
							<!-- Timestamp -->
							<span>{{ formatDate(new Date(item.post.published)) }}</span>
							<span v-if="item.post.updated">
								<span class="font-black text-gray-400 dark:text-gray-500">·</span>
								<span class="pl-1 italic">
									Edited {{ formatDate(new Date(item.post.updated)) }}
								</span>
							</span>
							<!-- Ratio -->
							<span>
								<span class="font-black text-gray-400 dark:text-gray-500">·</span>
								<span class="pl-2">
									{{ percentUpvoted }}% upvoted
								</span>
							</span>
							<!-- Tags -->
							<span v-if="item.post.nsfw" title="This post is marked 18+">
								<span class="font-black text-gray-400 dark:text-gray-500">·</span>
								<span class="badge badge-red">18+</span>
							</span>
						</p>
					</div>
				</div>
				<div class="hidden md:block">
					<!-- External Link Icon -->
					<a v-if="item.post.url && item.post.type === 'link'" :href="item.post.url" target="_blank" class="block">
						<i class="far fa-external-link text-gray-400"></i>
					</a>
				</div>
				<button class="flex items-center justify-center md:hidden -mr-1 p-1 text-gray-600 dark:text-gray-400">
					<i class="far fa-ellipsis-h fa-fw fa-lg"></i>
				</button>
			</div>
			<!-- Post Content -->
			<div class="px-2.5 sm:px-0 mt-3 sm:mt-4">
				<!-- Title -->
				<h1 class="text-lg md:text-xl leading-normal font-bold dark:text-gray-100 mb-2">
					{{ item.post.title }}
				</h1>
			</div>
			<!-- Post Embed -->
			<div class="px-2.5 sm:px-0 mt-3 sm:mt-4" v-if="item.post.url && item.post.type !== 'image'">
				<LinkPreview
				:domain="'post.domain placeholder'"
				:title="'post.metaTitle placeholder'"
				:thumbnail="'post.thumbUrl placeholder'"
				:url="item.post.url"
				:preview="'post.metaDescription placeholder'"
				/>
			</div>
			<!-- Post Image -->
			<div v-if="item.post.type === 'image'" class="flex justify-center mt-3 md:mt-4">
				<img
				:src="item.post.url"
				alt="Post image"
				class="w-full h-full object-cover"
				/>
			</div>
			<!-- Post Edit Form -->
			<InputsEdit v-if="isEditing" :id="item.post.id" :body="item.post.body" @closed="isEditing = false;"/>
			<!-- Post Text Body -->
			<div v-if="item.post.body_html" v-show="!isEditing" class="px-2.5 sm:px-0 mt-3 sm:mt-4 relative overflow-hidden">
				<div class="dark:text-gray-200 break-words" v-html="item.post.body_html"></div>
			</div>
			<!-- Footer -->
			<div v-show="!isEditing" class="flex justify-between items-center px-2.5 py-4 sm:px-0 sm:py-0 mt-3 sm:mt-6">
				<!-- Desktop actions -->
				<ul class="hidden md:flex flex-grow items-center space-x-6">
					<li class="group flex items-center space-x-2 leading-none text-sm font-medium">
						<button @click="vote(1)" class="upvote" :class="voteType === 1 ? 'upvoted text-primary' : 'text-gray-500'">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-4 h-4">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
							</svg>
						</button>
						<span :class="{ 'text-primary': voteType === 1, 'text-orange-600': voteType === -1, 'text-gray-900 dark:text-gray-300': voteType === 0 }">
							{{ item.counts.score + voteType }}
						</span>
						<button @click="vote(-1)" class="downvote" :class="voteType === -1 ? 'downvoted text-orange-600' : 'text-gray-500'">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-4 h-4">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"></path>
							</svg>
						</button>
					</li>
					<li>
						<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
							</svg>
							<span class="text-sm font-medium">{{ item.counts.comments }} {{ item.counts.comments === 1 ? 'Comment' : 'Comments'}}</span>
						</button>
					</li>
					<li>
						<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
								<rect x="9" y="3" width="6" height="4" rx="2"></rect>
							</svg>
							<span class="text-sm font-medium">Copy link</span>
						</button>
					</li>
					<li>
						<button @click="save(item.post.id,'post')" class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
							<!-- Bookmark Icon -->
							<svg v-show="!isSaved" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2"></path>
							</svg>
							<!-- Bookmark Slash Icon -->
							<svg v-show="isSaved" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<line x1="3" y1="3" x2="21" y2="21"></line>
								<path d="M17 17v3l-5 -3l-5 3v-13m1.178 -2.818c.252 -.113 .53 -.176 .822 -.176h6a2 2 0 0 1 2 2v7"></path>
							</svg>
							<span class="text-sm font-medium">{{ isSaved ? 'Unsave' : 'Save' }}</span>
						</button>
					</li>
					<li>
						<button @click="() => {}" class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
							<!-- Bell Icon -->
							<svg v-show="!isSubscribed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
								<path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
							</svg>
							<!-- Bell Slash Icon -->
							<svg v-show="isSubscribed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<line x1="3" y1="3" x2="21" y2="21"></line>
								<path d="M17 17h-13a4 4 0 0 0 2 -3v-3a7 7 0 0 1 1.279 -3.716m2.072 -1.934c.209 -.127 .425 -.244 .649 -.35a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3"></path>
								<path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
							</svg>
							<span class="text-sm font-medium">{{ isSubscribed ? 'Unsubscribe' : 'Subscribe' }}</span>
						</button>
					</li>
					<li v-if="!isAuthor">
						<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700" @click="confirmReport()">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 group-hover:opacity-100 w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
							</svg>
							<span class="text-sm font-medium">Report</span>
						</button>
					</li>
					<li v-if="isAuthor">
						<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600" @click="confirmDelete()">
							<svg xmlns="http://www.w3.org/2000/svg" class="opacity-70 group-hover:opacity-100 w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<line x1="4" y1="7" x2="20" y2="7"></line>
								<line x1="10" y1="11" x2="10" y2="17"></line>
								<line x1="14" y1="11" x2="14" y2="17"></line>
								<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
								<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
							</svg>
							<span class="text-sm font-medium">Delete</span>
						</button>
					</li>
					<li v-if="isAuthor">
						<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600" @click="isEditing = !isEditing">
							<svg xmlns="http://www.w3.org/2000/svg" class="opacity-70 group-hover:opacity-100 w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
								<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
								<path d="M16 5l3 3"></path>
							</svg>
							<span class="text-sm font-medium">
								Edit
							</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
		<!-- Banner -->
		<div v-if="!isAuthed" id="comments" class="w-full border rounded-md p-4 shadow-inner-white">
			<p class="text-base text-gray-500 dark:text-gray-100 text-center">
				<strong>Want to join the discussion? </strong>
				<NuxtLink to="/sign-up">Sign up to comment</NuxtLink>
			</p>
		</div>
		<!-- Comment Section -->
		<div class="flex flex-col">
			<!-- Count Heading & Sort -->
			<div class="flex items-end justify-between sm:mb-2">
				<strong class="px-2.5 md:px-0 text-base font-bold dark:text-gray-100">
					{{ item.counts.comments === 1 ? '1 comment' : `${item.counts.comments} comments` }}
				</strong>
				<MenusSort :sorts="sorts"/>
			</div>
			<!-- Comments & States -->
			<div class="sm:bg-gradient-to-b from-gray-200/50 p-2.5 sm:p-4 sm:shadow-inner-xs sm:rounded-md sm:border sm:border-b-0 sm:border-transparent">
				<!-- Write Form -->
				<div v-if="isAuthed" class="flex md:space-x-2">
					<img
					loading="lazy"
					:src="userStore.user.avatar"
					alt="avatar"
					class="hidden md:inline-block flex-shrink-0 w-9 h-9 object-cover rounded-sm sm:rounded-none sm:p-0.5 sm:border bg-white"
					/>
					<InputsComment :post-id="item.post.id" :parent-id="null" @comment-published="onCommentPublished"/>
				</div>
				<!-- Comments -->
				<ContentCommentList v-if="comments.length" :comments="comments" :offset="offset"/>
				<!-- Empty -->
				<div v-if="comments.length === 0" class="px-4 py-24 text-center text-gray-400">
					<p>
						This post sucks so bad, no one's bothered to reply to it.
						<br>
						You could be the first one to point that out and laugh at it.
					</p>
				</div>
				<!-- Error -->
				<div v-else-if="commentsError" class="px-4 py-24 text-center text-gray-400">
					<p>An unknown error occured.</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		item: {
			type: Object,
			required: true
		},
		comments: {
			type: Array,
			required: true
		}
	});

	import { reactive, computed } from 'vue';
	import { baseURL } from "@/server/constants";
	import { useLoggedInUser } from '@/stores/StoreAuth';
	import { usePost } from '@/composables/post';
	import { usePostComments } from '@/composables/comments';
	import { formatDate } from '@/utils/formatDate';
	import { toPercent } from '@/utils/percent'
	import { useSave } from '@/composables/save';
	import { useSubscribe } from '@/composables/subscribe';
	import { useModalStore } from '@/stores/StoreModal';
	import { useToastStore } from '@/stores/StoreToast';

	const modalStore = useModalStore();
	const toast = useToastStore();

	const route = useRoute();
	const userStore = useLoggedInUser();

	const isAuthed = userStore.isAuthed;
	const authCookie = useCookie("token").value;

    // Define post actions
	const { isSaved, save } = useSave();
	const { isSubscribed, subscribe } = useSubscribe();

    // Voting
	let voteType = ref(props.item.my_vote);

	const vote = async (type = 0) => {
		voteType.value = voteType.value === type ? 0 : type;

		await useFetch(`/posts/${props.item.post.id}/vote`, {
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

	// Comments
	const onCommentPublished = (comment) => {
		props.comments.unshift(comment)
	};

    // Utils
	const percentUpvoted = computed(() => {
		const num = 1 - props.item.counts.downvotes / props.item.counts.upvotes;
		if (!isFinite(num)) return 0;
		return toPercent(num);
	});

    // Author
	const isAuthor = computed(() => {
		if (userStore.user && props.item.creator) {
			return userStore.user.name === props.item.creator.name
		} else {
			return false
		}
	});

    // Edit
	const isEditing = ref(false);

    // Delete
	const confirmDelete = () => {
		modalStore.setModal({
			modal: 'ModalDelete',
			id: props.item.post.id,
			contentType: 'post',
			isOpen: true
		});
	};

      // Report
	const confirmReport = () => {
		modalStore.setModal({
			modal: 'ModalReport',
			id: props.item.post.id,
			contentType: 'post',
			isOpen: true
		});
	};

	// Comment sort options.
	const sorts = [
	{
		name: 'Hot',
		key: 'hot'
	},
	{
		name: 'Latest',
		key: 'new'
	},
	{
		name: 'Oldest',
		key: 'old'
	},
	{
		name: 'Top All',
		key: 'top'
	}
	]
</script>

<style scoped>
	.upvoted > svg {
		fill: rgba(var(--color-primary));
	}
	.upvote:active > svg, .downvote:active > svg {
		transform: translateY(-8px);
		transition: transform 200ms cubic-bezier(.1,-.5,.6,1.2);
	}
	.downvote:active > svg {
		transform: translateY(8px);
	}
	.downvoted > svg {
		fill: rgba(234, 88, 12, 1);
	}
</style>