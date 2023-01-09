<template>
	<!-- Avatar -->
	<NuxtLink v-if="notification" class="flex-shrink-0" :to="`/user/${notification.creator.name}`">
		<img loading="lazy" :src="notification.creator.avatar || 'https://placekitten.com/36/36'" alt="avatar" class="object-cover w-6 h-6 md:w-16 md:h-16 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"/>
	</NuxtLink>
	<!-- Details -->
	<div v-if="notification" class="w-full ml-2">
		<p class="text-sm text-gray-600">
			<NuxtLink :to="`/user/${notification.creator.name}`" class="font-bold">
				{{ notification.creator.name }}
			</NuxtLink>
			replied to you in
			<NuxtLink :href="context">
				{{ notification.post.title }}
			</NuxtLink>
		</p>
		<div class="prose prose-sm max-w-none" v-html="notification.comment.body_html"></div>
		<p class="mt-1 text-sm text-gray-600">
			{{ formatDate(notification.comment.creation_date) }}
			<span class="font-black text-gray-400 dark:text-gray-500">·</span>
			<button class="text-primary" @click="isReplying = true">&nbsp;Reply</button>
		</p>
		<ul v-if="replies.length" class="mt-2 space-y-2">
			<li v-for="(reply,i) in replies" :key="i" class="flex">
				<img loading="lazy" :src="reply.creator.avatar" alt="avatar" class="flex-shrink-0 object-cover w-6 h-6 md:w-9 md:h-9 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent"/>
				<div class="w-full ml-2">
					<p class="text-sm text-gray-600">
						<NuxtLink :to="`/user/${reply.creator.name}`" class="font-bold">
							You
						</NuxtLink>
						replied
					</p>
					<div class="prose prose-sm max-w-none" v-html="reply.comment.body_html"></div>
					<p class="mt-1 text-sm text-gray-600">
						{{ formatDate(reply.comment.creation_date) }}
						<span class="font-black text-gray-400 dark:text-gray-500">·&nbsp;</span>
						<NuxtLink :to="context">
							View thread
						</NuxtLink>
					</p>
				</div>
			</li>
		</ul>
		<LazyInputsComment v-if="isReplying" :post-id="notification.post.id" :parent-id="notification.comment.id" @closed="isReplying = false" @comment-published="onCommentPublished" class="mt-2"/>
	</div>
</template>

<script setup>
	import { formatDate } from "@/utils/formatDate";

	const props = defineProps({
		notification: {
			type: Object,
			required: true
		}
	});

	const isReplying = ref(false);
	const replies = ref([]);

	// Contextual link
	const context = computed(() => {
		if (!!props.notification.comment.parent_id) {
			return `/post/${props.notification.post.id}/${props.notification.comment.parent_id}`
		} else if (!!props.notification.comment.id) {
			return `/post/${props.notification.post.id}/${props.notification.comment.id}`
		} else {
			return `/post/${props.notification.post.id}`
		}
	});

	// Reply
	const onCommentPublished = (comment) => {
	  // Set reply to comment
		replies.value.push(comment);
	  // Close the reply form
		isReplying.value = false;
	};
</script>