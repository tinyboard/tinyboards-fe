<template>
	<div class="flex sm:gap-4" :class="[{'first:sm:rounded-t-md last:sm:rounded-b-md':isCompact},{'removed':item.post.removed}]">
		<!-- Avatar - Desktop Only -->
		<NuxtLink v-show="!isCompact" :to="`/user/${item.creator.name}`" class="sticky top-28 hidden sm:inline flex-shrink-0 h-full arrow__right">
			<img
			loading="lazy"
			:src="item.creator.avatar || 'http://placekitten.com/200/300'"
			alt="avatar"
			class="w-16 h-16 object-cover p-0.5 border bg-white hover:bg-gray-200"
			/>
		</NuxtLink>
		<div class="flex-grow p-2.5 sm:p-4 shadow-inner-white" :class="[isCompact ? 'flex items-center hover:bg-gray-50 border-inherit' : 'border-y sm:border-x sm:rounded-md',item.post.removed ? 'bg-red-100 border-red-300' : 'bg-white']">
			<NuxtLink v-show="isCompact" :to="`/user/${item.creator.name}`" class="hidden sm:flex flex-shrink-0">
				<img
				loading="lazy"
				:src="item.creator.avatar || 'http://placekitten.com/200/300'"
				alt="avatar"
				class="w-9 h-9 object-cover p-0.5 border bg-white hover:bg-gray-200"
				/>
			</NuxtLink>
			<div class="w-full" :class="{'sm:ml-4 sm:w-3/6':isCompact}">
				<!-- Author -->
				<div v-if="item.creator" scope="row" class="flex items-center text-gray-900 dark:text-white">
					<div class="flex flex-col sm:truncate">
						<p class="flex items-center font-normal text-sm text-gray-400 leading-normal">
							<NuxtLink :to="`/user/${item.creator.name}`" class="flex items-center">
								<!-- Avatar (mobile only) -->
								<img
								loading="lazy"
								:src="item.creator.avatar || 'http://placekitten.com/200/300'"
								alt="avatar"
								class="sm:hidden flex-shrink-0 w-6 h-6 object-cover"
								/>
								<!-- Username -->
								<strong class="ml-2 sm:ml-0">{{ item.creator.name }}</strong>
								<!-- Role -->
								<span v-if="item.creator.admin" class="ml-1 badge badge-blue">Admin</span>
							</NuxtLink>
							<!-- User Title -->
							<span v-if="item.creator && item.creator.title" class="ml-2 px-1 inline-flex leading-4 rounded-sm text-blue-700 shadow-inner-white bg-blue-100 border border-blue-200">
								{{ item.creator.title }}
							</span>
							<!-- Post Timestamps -->
							<span :title="item.post.published" class="ml-2">
								<span>{{ formatDate(new Date(item.post.published)) }}</span>
							</span>
							<span class="ml-2" v-if="item.post.updated">
								<span class="font-black text-gray-400 dark:text-gray-500">·</span>
								<span class="italic pl-1"> Edited {{ formatDate(new Date(item.post.updated)) }}</span>
							</span>
							<!-- Tags -->
							<span class="ml-2" v-if="item.post.nsfw" title="This post is marked 18+">
								<span class="font-black text-gray-400 dark:text-gray-500">·</span>
								<span class="badge badge-red">18+</span>
							</span>
						</p>
					</div>
				</div>
				<!-- Post Title & Body -->
				<div class="mt-2.5" :class="{'sm:mt-0':isCompact}">
					<NuxtLink class="font-medium text-gray-900 visited:text-gray-400 hover:text-secondary sm:overflow-hidden sm:text-ellipsis" :class="{'sm:text-lg':!isCompact}" :to="`/post/${item.post.id}`">
						{{ item.post.title }}
					</NuxtLink>
					<div v-if="item.post.body_html" v-show="!isCompact" class="mt-2 relative overflow-hidden" :class="{'max-h-56 overlay':!isExpanded && item.post.body.length > 800}">
						<div class="dark:text-gray-200 break-words" v-html="item.post.body_html"></div>
					</div>
				</div>
				<!-- Actions -->
				<ul class="mt-4 flex flex-grow items-center" :class="{'sm:hidden':isCompact}">
					<li class="sm:hidden">
						<NuxtLink :to="`/post/${item.post.id}`" class="text-sm font-medium leading-none text-gray-500 dark:text-gray-400 hover:text-gray-700">
							{{ item.counts.comments === 1 ? '1 reply' : `${item.counts.comments} replies` }}
						</NuxtLink>
					</li>
					<li class="ml-auto sm:ml-0 group flex items-center space-x-2 leading-none text-sm font-medium">
						<button @click="vote(1)" class="upvote" :class="voteType === 1 ? 'upvoted text-primary' : 'text-gray-500'">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
							</svg>
						</button>
						<span :class="{ 'text-primary': voteType === 1, 'text-secondary': voteType === -1, 'text-gray-900 dark:text-gray-300': voteType === 0 }">
							{{ item.counts.score + voteType }}
						</span>
						<button @click="vote(-1)" class="downvote" :class="voteType === -1 ? 'downvoted text-secondary' : 'text-gray-500'">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"></path>
							</svg>
						</button>
					</li>
					<li v-if="item.post.body.length > 800 && item.post.body_html" class="ml-6 hidden sm:list-item">
						<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700" @click="isExpanded = !isExpanded">
							<!-- Arrows In Icon -->
							<svg v-show="isExpanded" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M18 10h-4v-4"></path>
								<path d="M20 4l-6 6"></path>
								<path d="M6 14h4v4"></path>
								<path d="M10 14l-6 6"></path>
							</svg>
							<!-- Arrows Out Icon -->
							<svg v-show="!isExpanded" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<polyline points="16 4 20 4 20 8"></polyline>
								<line x1="14" y1="10" x2="20" y2="4"></line>
								<polyline points="8 20 4 20 4 16"></polyline>
								<line x1="4" y1="20" x2="10" y2="14"></line>
							</svg>
							<span class="text-sm font-medium w-12">
								{{ isExpanded ? 'Collapse' : 'Expand' }}
							</span>
						</button>
					</li>
					<li class="ml-6 hidden sm:list-item">
						<NuxtLink :to="`/post/${item.post.id}`" class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
							</svg>
							<span class="text-sm font-medium">{{ item.counts.comments }}</span>
						</NuxtLink>
					</li>
					<li class="ml-6 hidden sm:list-item">
						<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
								<rect x="9" y="3" width="6" height="4" rx="2"></rect>
							</svg>
							<span class="text-sm font-medium">Copy link</span>
						</button>
					</li>
					<li class="ml-6 hidden md:list-item">
						<button @click="save(item.post.id,'post')" class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
							<!-- Bookmark Icon -->
							<svg v-show="!item.ssaved" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2"></path>
							</svg>
							<!-- Bookmark Slash Icon -->
							<svg v-show="item.saved" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<line x1="3" y1="3" x2="21" y2="21"></line>
								<path d="M17 17v3l-5 -3l-5 3v-13m1.178 -2.818c.252 -.113 .53 -.176 .822 -.176h6a2 2 0 0 1 2 2v7"></path>
							</svg>
							<span class="text-sm font-medium">{{ item.saved ? 'Unsave' : 'Save' }}</span>
						</button>
					</li>
					<li class="ml-6 hidden md:list-item">
						<button @click="() => {}" class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
							<!-- Bell Icon -->
							<svg v-show="!item.subscribed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
								<path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
							</svg>
							<!-- Bell Slash Icon -->
							<svg v-show="item.subscribed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<line x1="3" y1="3" x2="21" y2="21"></line>
								<path d="M17 17h-13a4 4 0 0 0 2 -3v-3a7 7 0 0 1 1.279 -3.716m2.072 -1.934c.209 -.127 .425 -.244 .649 -.35a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3"></path>
								<path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
							</svg>
							<span class="text-sm font-medium">{{ item.subscribed ? 'Unsubscribe' : 'Subscribe' }}</span>
						</button>
					</li>
					<li v-if="!isAuthor" class="ml-6 hidden md:list-item">
						<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700" @click="confirmReport">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-1">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
							</svg>
							<span class="text-sm font-medium">Report</span>
						</button>
					</li>
					<li v-if="isAuthor" class="ml-6 hidden sm:list-item">
						<button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600" @click="confirmDelete">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
					<li v-if="isAdmin" class="ml-6 hidden lg:list-item">
						<button class="group flex items-center text-green-500 leading-none dark:text-green-400 hover:text-green-600" @click="pin">
							<!-- Pin Icon -->
							<svg v-show="!item.post.stickied" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"></path>
							   <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
							   <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
							</svg>
							<!-- Pin Off Icon -->
							<svg v-show="item.post.stickied" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <line x1="3" y1="3" x2="21" y2="21"></line>
							   <path d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251"></path>
							   <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
							   <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
							</svg>
							<span class="text-sm font-medium">{{ item.post.stickied ? 'Unpin' : 'Pin' }}</span>
						</button>
					</li>
					<li v-if="isAdmin" class="ml-6 hidden lg:list-item">
						<button class="group flex items-center text-red-500 leading-none dark:text-red-400 hover:text-red-600" @click="confirmRemove">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							   <path d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385"></path>
							   <path d="M6 9l4 4"></path>
							   <path d="M13 10l-4 -4"></path>
							   <path d="M3 21h7"></path>
							   <path d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z"></path>
							</svg>
							<span class="text-sm font-medium">Remove</span>
						</button>
					</li>
				</ul>
			</div>
			<!-- Post Details (compact mode only) -->
			<div v-show="isCompact" class="ml-auto w-1/6 hidden sm:flex items-center justify-between">
				<div class="flex flex-col flex-grow space-y-2 text-sm text-gray-500">
					<dl class="flex justify-between">
						<dt>Score&nbsp;</dt>
						<dd class="font-medium">{{ item.counts.score + voteType }}</dd>
					</dl>
					<dl class="flex justify-between">
						<dt>Replies&nbsp;</dt>
						<dd class="font-medium">{{ item.counts.comments }}</dd>
					</dl>
				</div>
			</div>
			<!-- Last Activity (compact mode only) -->
			<div v-show="isCompact" class="ml-auto w-1/6 hidden sm:flex items-center justify-end">

			</div>
		</div>
	</div>
</template>

<script setup>
	// Props
	const props = defineProps({
		item: {
			type: Object,
			required: true
		},
		isCompact: {
			type: Boolean
		}
	});

	import { computed } from 'vue';
	import { baseURL } from "@/server/constants";
	import { useLoggedInUser } from '@/stores/StoreAuth';
	// import { useSave } from '@/composables/save';
	import { useModalStore } from '@/stores/StoreModal';
	import { useToastStore } from '@/stores/StoreToast';
	import { toPercent } from '@/utils/percent';

	// Modals & Toasts
	const modalStore = useModalStore();
	const toast = useToastStore();

	// Authentication
	const userStore = useLoggedInUser();
	const isAuthed = userStore.isAuthed;
	const authCookie = useCookie("token").value;

	// Expand & Collapse
	const isExpanded = ref(false);

	// Save
	// const { isSaved, save } = useSave();

    // Author
	const isAuthor = computed(() => {
		if (!!userStore.user && props.item.creator) {
			return userStore.user.name === props.item.creator.name
		} else {
			return false
		}
	});

	// Admin
	const isAdmin = computed(() => {
		return !!userStore.user && userStore.user.admin
	});

	// Vote
	const voteType = ref(props.item.my_vote);

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

	// Utils
	const percentUpvoted = computed(() => {
		const num = 1 - props.item.counts.downvotes / props.item.counts.upvotes;
		if (!isFinite(num)) return 0;
		return toPercent(num);
	});
</script>

<style scoped>
	.border-inherit {
		border-radius: inherit;
	}
	.arrow__right::before {
		content: '';
		position: absolute;
		top: 26px;
		right: -23px;
		display: block;
		width: 12px;
		height: 12px;
		background-color: #FFFFFF;
		transform: rotate(45deg);
		@apply border-l border-b
	}
	.removed .arrow__right::before {
		@apply bg-red-100 border-red-300;
	}
	.overlay {
		-webkit-mask-image: linear-gradient(180deg,#000 65%,transparent);
		mask-image: linear-gradient(180deg,#000 65%,transparent);
	}
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
		fill: rgba(var(--color-secondary));
	}
</style>