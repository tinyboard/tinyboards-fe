<template>
	<NuxtLayout name="inbox">
		<div
			class="flex flex-col h-full bg-white sm:shadow-inner-white sm:rounded-md border-b sm:border sm:overflow-hidden">
			<!-- Page Heading & Description -->
			<div v-if="notifications[type]?.length" class="flex items-center p-4 border-b">
				<h2 class="text-lg font-bold leading-6 text-gray-900 capitalize">{{ type }}</h2>
				<div class="ml-auto flex items-center space-x-4">
					<p class="text-sm text-gray-600">
						<strong>{{ unreadCount }}</strong> unread {{ type }}
					</p>
					<button class="button button-sm gray" @click="markRead" :disabled="unreadCount === 0 || isLoading">
						&#10003; Mark all read
					</button>
				</div>
			</div>
			<!-- Messages -->
			<ul v-if="notifications[type]?.length" class="h-full divide-y divide-gray-100 sm:overflow-y-auto">
				<!-- Notification -->
				<li v-for="(notification, i) in notifications[type]" :key="i" class="p-2.5 sm:p-4 flex"
					:class="{ 'bg-gray-100': notification.comment_reply?.read || notification.user_mention?.read }">
					<LazyCardsNotification :notification="notification" />
				</li>
			</ul>
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

<script setup>
// import { baseURL } from '@/server/constants';
import { useApi } from "@/composables/api";
import { formatDate } from "@/utils/formatDate";
import { useToastStore } from "@/stores/StoreToast";

const route = useRoute();
const toast = useToastStore();

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

const type = ref(route.params.type || 'replies');

const { data: notifications, pending, error, refresh } = await useApi(`/notifications/${type.value}`, {
	query: {
		limit: limit.value,
		page: page.value
	}
})

if (error.value && error.value.response) {
	throw createError({
		statusCode: 404,
		statusMessage:
			"We could not find the page you were looking for. Try better next time.",
		fatal: true,
	});
};

if (notifications.value.unread_count) {
	unreadCount.value = notifications.value.unread_count;
};

const isLoading = ref(false);

const markRead = () => {
	isLoading.value = true;
	useApi(`/notifications/${type.value}/mark_read`, {
		method: "post",
		body: {}
	})
		.then(({ data, error }) => {
			if (!error.value) {
				unreadCount.value = 0;
				// Show success toast.
				toast.addNotification({ header: 'Marked all read', message: `All ${type.value} marked as read.`, type: 'success' });
			} else {
				// Show error toast.
				toast.addNotification({ header: 'Failed to mark all read', message: 'Please try again.', type: 'error' });
				// Log the error.
				console.error(error.value);
			}
		})
		.finally(() => {
			isLoading.value = false;
		});
};

const totalPages = computed(() => {
	return Math.ceil(notifications.value.total_count / limit.value || 1);
});
</script>