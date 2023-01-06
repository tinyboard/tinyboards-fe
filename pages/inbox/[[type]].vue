<template>
	<NuxtLayout name="inbox">
		<div class="bg-white p-2.5 sm:p-4 sm:shadow-inner-xs sm:rounded-md border-y sm:border-x">
			<!-- Messages -->
			<ul v-if="notifications[type].length" class="space-y-4">
				<!-- Notification -->
				<li v-for="(notification, i) in notifications.replies" :key="i" class="flex" :class="{'bg-gray-100':!notification.comment_reply.read}">
					<LazyCardsNotification :notification="notification"/>
				</li>
			</ul>
			<!-- Empty State -->
			<div v-else class="px-4 py-24 text-center text-gray-500">
				<p>
					<span class="font-medium">
						There are no {{ route.params.type === 'unread' ? 'unread messages' : route.params.type || 'messages' }} in your inbox...
					</span>
					<br/>
					you must not be popular
				</p>
			</div>
			<!-- Pagination -->
			<LazyNavigationPaginate v-if="totalPages > 1" :total-pages="totalPages" :per-page="limit" :current-page="page" class="mt-4"/>
		</div>
	</NuxtLayout>
</template>

<script setup>
	import { baseURL } from '@/server/constants';
	import { formatDate } from "@/utils/formatDate";

	const route = useRoute();

	definePageMeta({
		'hasAuthRequired': true,
		'hasRepliesDisabled': true,
	});

	const authCookie = useCookie("token").value;

	// Pagination
	const page = computed(() => Number.parseInt(route.query.page) || 1);
	const limit = computed(() => Number.parseInt(route.query.limit) || 10);

	// Fetch notifications
	const type = ref(route.params.type || 'replies');

	const { data: notifications, pending, error, refresh } = await useFetch(`/notifications/${type.value}`, {
		query: {
			limit: limit.value,
			page: page.value
		},
		baseURL,
		headers: {
			Authorization: authCookie ? `Bearer ${authCookie}` : '',
		}
	});

	if (error.value && error.value.response) {
		throw createError({
			statusCode: 404,
			statusMessage:
			"We could not find the page you were looking for. Try better next time.",
			fatal: true,
		});
	};

	const totalPages = computed(() => {
		return Math.ceil(notifications.value.total_count / limit.value || 1);
	});
</script>