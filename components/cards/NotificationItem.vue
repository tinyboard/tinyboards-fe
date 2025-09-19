<template>
	<div class="flex w-full">
		<!-- Avatar -->
		<div class="flex-shrink-0">
			<NuxtLink v-if="creator" :to="`/@${creator.name}`">
				<img loading="lazy" :src="creator.avatar || 'https://placekitten.com/36/36'" :alt="`${creator.displayName || creator.name} avatar`"
					class="object-cover w-6 h-6 md:w-16 md:h-16 sm:p-0.5 sm:border bg-white hover:bg-gray-200 hover:border-transparent rounded" />
			</NuxtLink>
			<img v-else loading="lazy" src="https://placekitten.com/36/36" alt="System notification"
				class="object-cover w-6 h-6 md:w-16 md:h-16 sm:p-0.5 sm:border bg-white rounded" />
		</div>

		<!-- Content -->
		<div class="w-full ml-2">
			<!-- Reply Notification -->
			<div v-if="notification.kind === 'REPLY' && notification.comment">
				<p class="text-sm text-gray-600">
					<NuxtLink v-if="creator" :to="`/@${creator.name}`" class="font-bold">
						{{ creator.displayName || creator.name }}
					</NuxtLink>
					<span v-else class="font-bold">[deleted]</span>
					replied to you in
					<NuxtLink :to="postLink" class="font-medium text-blue-600 hover:underline">
						{{ notification.comment.post.title }}
					</NuxtLink>
				</p>
				<div class="prose prose-sm max-w-none mt-1" v-html="notification.comment.body"></div>
			</div>

			<!-- Mention Notification -->
			<div v-else-if="notification.kind === 'MENTION' && notification.comment">
				<p class="text-sm text-gray-600">
					<NuxtLink v-if="creator" :to="`/@${creator.name}`" class="font-bold">
						{{ creator.displayName || creator.name }}
					</NuxtLink>
					<span v-else class="font-bold">[deleted]</span>
					mentioned you in
					<NuxtLink :to="postLink" class="font-medium text-blue-600 hover:underline">
						{{ notification.comment.post.title }}
					</NuxtLink>
				</p>
				<div class="prose prose-sm max-w-none mt-1" v-html="notification.comment.body"></div>
			</div>

			<!-- Post Notification (if applicable) -->
			<div v-else-if="notification.post">
				<p class="text-sm text-gray-600">
					<NuxtLink v-if="creator" :to="`/@${creator.name}`" class="font-bold">
						{{ creator.displayName || creator.name }}
					</NuxtLink>
					<span v-else class="font-bold">[System]</span>
					created a post in
					<span class="font-medium">+{{ notification.post.board?.name }}</span>
				</p>
				<NuxtLink :to="`/post/${notification.post.id}`" class="font-medium text-blue-600 hover:underline">
					{{ notification.post.title }}
				</NuxtLink>
				<div v-if="notification.post.body" class="prose prose-sm max-w-none mt-1" v-html="notification.post.body"></div>
			</div>

			<!-- Fallback for unknown notification types -->
			<div v-else>
				<p class="text-sm text-gray-600">
					You have a new notification
				</p>
			</div>

			<!-- Timestamp and actions -->
			<div class="mt-1 flex items-center text-sm text-gray-500 space-x-1">
				<span>{{ formatDate(notification.created) }}</span>
				<span class="font-black text-gray-400">·</span>
				<NuxtLink v-if="postLink" :to="postLink" class="text-primary hover:underline">
					View
				</NuxtLink>
				<!-- Individual notification actions -->
				<template v-if="!notification.isRead">
					<span class="font-black text-gray-400">·</span>
					<button @click="markAsRead" class="text-primary hover:underline" :disabled="isMarkingRead">
						{{ isMarkingRead ? 'Marking...' : 'Mark as read' }}
					</button>
				</template>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { formatDate } from "@/utils/formatDate";
import { useToastStore } from "@/stores/StoreToast";
import { useNotificationRefresh } from '@/composables/notificationRefresh';

interface NotificationCreator {
	name: string;
	displayName?: string;
	avatar?: string;
}

interface NotificationComment {
	id: number;
	body: string;
	creationDate: string;
	creator: NotificationCreator;
	post: {
		id: number;
		title: string;
	};
}

interface NotificationPost {
	id: number;
	title: string;
	body?: string;
	creationDate: string;
	creator: NotificationCreator;
	board?: {
		name: string;
		title: string;
	};
}

interface Notification {
	id: number;
	kind: string;
	isRead: boolean;
	created: string;
	comment?: NotificationComment;
	post?: NotificationPost;
}

const props = defineProps<{
	notification: Notification;
}>();

const emit = defineEmits<{
	'marked-read': [notificationId: number];
}>();

const toast = useToastStore();
const { refreshNotificationCounts } = useNotificationRefresh();
const isMarkingRead = ref(false);

// Get the creator from either the comment or post
const creator = computed((): NotificationCreator | null => {
	return props.notification.comment?.creator || props.notification.post?.creator || null;
});

// Generate the link to the post/comment
const postLink = computed((): string => {
	if (props.notification.comment) {
		return `/post/${props.notification.comment.post.id}/${props.notification.comment.id}`;
	} else if (props.notification.post) {
		return `/post/${props.notification.post.id}`;
	}
	return '#';
});

// Mark individual notification as read
const markAsRead = async () => {
	isMarkingRead.value = true;

	try {
		const result = await GqlMarkNotificationsRead({
			notificationIds: [props.notification.id],
			markAll: false
		});

		if (result.markNotificationsRead?.success) {
			// Emit event to parent component to update the notification
			emit('marked-read', props.notification.id);

			// Refresh notification counts in navbar and other components
			refreshNotificationCounts();

			toast.addNotification({
				header: 'Marked as read',
				message: 'Notification marked as read.',
				type: 'success'
			});
		} else {
			throw new Error('Failed to mark notification as read');
		}
	} catch (error) {
		console.error('Error marking notification as read:', error);
		toast.addNotification({
			header: 'Failed to mark as read',
			message: error.message || 'Unable to mark notification as read.',
			type: 'error'
		});
	} finally {
		isMarkingRead.value = false;
	}
};
</script>