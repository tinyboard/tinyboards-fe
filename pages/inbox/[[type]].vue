<template>
	<NuxtLayout name="inbox">
		<div
			class="flex flex-col h-full bg-white sm:shadow-inner-white sm:rounded-md border-b sm:border sm:overflow-hidden">
			<!-- Page Heading & Description -->
			<div v-if="notifications?.length" class="flex items-center p-4 border-b">
				<h2 class="text-lg font-bold leading-6 text-gray-900 capitalize">{{ type }}</h2>
				<div class="ml-auto flex items-center space-x-4">
					<p class="text-sm text-gray-600">
						<strong>{{ unreadCount }}</strong> unread {{ type }}
					</p>
					<button class="button button-sm gray" @click="markRead" :disabled="unreadCount === 0 || isLoading">
						<span v-if="isLoading">Loading...</span>
						<span v-else>&#10003; Mark all read</span>
					</button>
				</div>
			</div>
			<!-- Notifications -->
			<ul v-if="notifications?.length" class="h-full divide-y divide-gray-100 sm:overflow-y-auto">
				<!-- Notification -->
				<li v-for="(notification, i) in notifications" :key="notification.id || i" class="p-2.5 sm:p-4"
					:class="{ 'bg-gray-100': notification.isRead }">
					<LazyCardsNotificationItem :notification="notification" @marked-read="onNotificationMarkedRead" />
				</li>
			</ul>
			<!-- Loading State -->
			<div v-else-if="pending" class="px-4 py-24 text-center text-gray-500">
				<p>Loading notifications...</p>
			</div>
			<!-- Empty State -->
			<div v-else class="px-4 py-24 text-center text-gray-500">
				<p>
					<span class="font-medium">
						There are no {{ type === 'unread' ? 'unread messages' : type || 'messages' }} in your inbox...
					</span>
					<br />
					you must not be popular
				</p>
			</div>
			<!-- Pagination -->
			<LazyNavigationPaginate v-if="totalPages > 1" :total-pages="totalPages" :per-page="limit" :current-page="page"
				class="border-t p-2.5 sm:p-4" />
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
// import { baseURL } from '@/server/constants';
import { formatDate } from "@/utils/formatDate";
import { useToastStore } from "@/stores/StoreToast";
import { useNotificationRefresh } from '@/composables/notificationRefresh';

const route = useRoute();
const toast = useToastStore();
const { refreshNotificationCounts } = useNotificationRefresh();

definePageMeta({
	'hasAuthRequired': true,
	'hasRepliesDisabled': true,
	'isFooterDisabled': true
});

const authCookie = useCookie("token").value;

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 10);

// Fetch notifications
const unreadCount = ref(0);

const type = ref(route.params?.type || 'replies');

const { data: notifications, pending, error, refresh } = await useAsyncQuery('getNotifications', {
	unreadOnly: type.value === 'unread',
	limit: limit.value,
	page: page.value
});

if (error.value && error.value.response) {
	throw createError({
		statusCode: 404,
		statusMessage:
			"We could not find the page you were looking for. Try better next time.",
		fatal: true,
	});
};

// Calculate unread count from the notifications array
const calculateUnreadCount = () => {
	if (notifications.value) {
		const unreadNotifications = notifications.value.filter(n => !n.isRead);
		unreadCount.value = unreadNotifications.length;
	} else {
		unreadCount.value = 0;
	}
};

// Calculate initial unread count
calculateUnreadCount();

// Recalculate when notifications change
watch(notifications, calculateUnreadCount, { deep: true });

const isLoading = ref(false);

const markRead = async () => {
	isLoading.value = true;

	try {
		const result = await GqlMarkNotificationsRead({
			markAll: true
		});

		if (result.markNotificationsRead?.success) {
			// Update local notifications to be marked as read
			if (notifications.value) {
				notifications.value = notifications.value.map(notification => ({
					...notification,
					isRead: true
				}));
			}

			// Recalculate unread count
			calculateUnreadCount();

			// Refresh notification counts in navbar and other components
			refreshNotificationCounts();

			// Show success toast.
			toast.addNotification({
				header: 'Marked all read',
				message: `All ${type.value} marked as read.`,
				type: 'success'
			});
		} else {
			throw new Error('Failed to mark notifications as read');
		}
	} catch (error) {
		// Show error toast.
		toast.addNotification({
			header: 'Failed to mark all read',
			message: 'Please try again.',
			type: 'error'
		});
		// Log the error.
		console.error('Error marking notifications as read:', error);
	} finally {
		isLoading.value = false;
	}
};

// Handle individual notification marked as read
const onNotificationMarkedRead = (notificationId) => {
	if (notifications.value) {
		const notificationIndex = notifications.value.findIndex(n => n.id === notificationId);
		if (notificationIndex !== -1) {
			// Update the notification to mark it as read
			notifications.value[notificationIndex].isRead = true;
			// Recalculate unread count
			calculateUnreadCount();
		}
	}
};

const totalPages = computed(() => {
	// Since we don't have totalCount from the GraphQL query,
	// we'll assume there are more pages if we get the full limit of notifications
	// This is not perfect but works for basic pagination
	if (!notifications.value?.length) return 1;

	// If we received fewer than the limit, we're on the last page
	if (notifications.value.length < limit.value) {
		return page.value;
	}

	// Otherwise, assume there's at least one more page
	return page.value + 1;
});
</script>