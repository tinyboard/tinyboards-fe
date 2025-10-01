<template>
	<!-- Avatar -->
	<NuxtLink v-if="!!notification.creator" class="flex-shrink-0" :to="`/@${notification.creator.name}`">
		<div class="sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent">
			<CardsAvatar :src="notification.creator.avatar" alt="avatar" size="xs" class="md:!w-16 md:!h-16" />
		</div>
	</NuxtLink>
	<div v-else class="flex-shrink-0">
		<div class="sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent">
			<CardsAvatar :src="null" alt="avatar" size="xs" class="md:!w-16 md:!h-16" />
		</div>
	</div>
	<!-- Details -->
	<div class="w-full ml-2">
		<p class="text-sm text-gray-600">
			<NuxtLink v-if="!!notification.creator" :to="`/@${notification.creator.name}`" class="font-bold">
				{{ notification.creator.name }}
			</NuxtLink>
			<span v-else class="font-bold">[deleted]</span>
			replied to you in
			<NuxtLink :href="context">
				{{ notification.post.title }}
			</NuxtLink>
		</p>
		<div class="prose prose-sm max-w-none" v-html="notification.bodyHTML"></div>
		<p class="mt-1 text-sm text-gray-600">
			{{ formatDate(notification.creationDate) }}
			<span class="font-black text-gray-400 dark:text-gray-500">·</span>
			<button class="text-primary" @click="isReplying = true">&nbsp;Reply</button>
		</p>
		<ul v-if="replies.length" class="mt-2 space-y-2">
			<li v-for="(reply, i) in replies" :key="i" class="flex">
				<div v-if="!!reply.creator" class="flex-shrink-0 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent">
					<CardsAvatar :src="reply.creator.avatar" alt="avatar" size="xs" class="md:!w-9 md:!h-9" />
				</div>
				<div v-else class="flex-shrink-0 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent">
					<CardsAvatar :src="null" alt="avatar" size="xs" class="md:!w-9 md:!h-9" />
				</div>
				<div class="w-full ml-2">
					<p class="text-sm text-gray-600">
						<!-- This Comment object was just added by the logged in user: creator is not null -->
						<NuxtLink :to="`/@${reply.creator!.name}`" class="font-bold">
							You
						</NuxtLink>
						replied
					</p>
					<div class="prose prose-sm max-w-none" v-html="reply.bodyHTML"></div>
					<p class="mt-1 text-sm text-gray-600">
						{{ formatDate(reply.creationDate) }}
						<span class="font-black text-gray-400 dark:text-gray-500">·&nbsp;</span>
						<NuxtLink :to="context">
							View thread
						</NuxtLink>
					</p>
				</div>
			</li>
		</ul>
		<LazyInputsComment v-if="isReplying" :post-id="notification.post.id" :parent-id="notification.id"
			@closed="isReplying = false" @comment-published="onCommentPublished" class="mt-2" />
	</div>
</template>

<script lang="ts" setup>
import { formatDate } from "@/utils/formatDate";
import { type Comment } from "@/types/types";

// TODO: discuss if notifications should have a different type
const props = defineProps<{
	notification: Comment;
}>();

const isReplying = ref(false);
const replies = ref([] as Comment[]);

// Contextual link
const context = computed(() => {
	if (!!props.notification.parentId) {
		return `/p/${props.notification.post.id}/${props.notification.parentId}`
	} else if (!!props.notification.id) {
		return `/p/${props.notification.post.id}/${props.notification.id}`
	} else {
		return `/p/${props.notification.post.id}`
	}
});

// Reply
const onCommentPublished = (comment: Comment) => {
	// Set reply to comment
	replies.value.push(comment);
	// Close the reply form
	isReplying.value = false;
};
</script>