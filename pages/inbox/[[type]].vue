<template>
	<NuxtLayout name="inbox">
		<div class="bg-white sm:shadow-inner-xs sm:rounded-md border-b sm:border overflow-hidden">
			<!-- Page Heading & Description -->
			<div v-if="notifications[type].length" class="flex items-center p-4 border-b">
				<h2 class="text-lg font-medium leading-6 text-gray-900 capitalize">{{ type }}</h2>
				<div class="ml-auto flex items-center space-x-4">
					<p class="text-sm text-gray-600">
						You have <strong>{{ notifications.total_count ?? 0 }}</strong> unread {{ type === 'unread' ? 'unread messages' : type || 'messages' }}
					</p>
					<button class="button button-sm gray">
						&#10003; Mark all read
					</button>
				</div>
			</div>
			<!-- Messages -->
			<ul v-if="notifications[type].length" class="divide-y divide-gray-100">
				<!-- Notification -->
				<li v-for="(notification, i) in notifications.replies" :key="i" class="p-2.5 sm:p-4 flex" :class="{'bg-gray-50':notification.comment_reply.read}">
					<LazyCardsNotification :notification="notification"/>
				</li>
			</ul>
			<!-- Empty State -->
			<div v-else class="px-4 py-24 text-center text-gray-500">
				<p>
					<span class="font-medium">
						There are no {{ type === 'unread' ? 'unread messages' : type || 'messages' }} in your inbox...
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