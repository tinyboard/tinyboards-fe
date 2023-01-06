<template>
	<div>
		<NuxtLoadingIndicator color="rgba(255,255,255,0.45)" :height="3"/>
		<!-- Navigation Bar -->
		<component :is="isAuthed ? NavbarAuthenticated : Navbar" />
		<slot/>
		<NavigationFooter />
		<LazyDialogsToastList v-if="toastStore.notifications.length"/>
		<LazyDialogsModalList v-if="!!modalStore.modal"/>
	</div>
</template>

<script setup>
	import { useLoggedInUser } from '@/stores/StoreAuth';
	import { useModalStore } from "@/stores/StoreModal";
	import { useToastStore } from "@/stores/StoreToast";

	const route = useRoute();

	useHead({
		title: `Tinyboards | ${route.meta.title ?? 'feed'}`,
		meta: [
		{
			property: 'og:title',
			content: `Tinyboards | ${route.meta.title ?? 'feed'}`
		}
		]
	});

	const userStore = useLoggedInUser();
	const isAuthed = userStore.isAuthed;

	const modalStore = useModalStore();
	const toastStore = useToastStore();

	const Navbar = 	defineAsyncComponent(() => import('@/components/navigation/Navbar'));
	const NavbarAuthenticated = defineAsyncComponent(() => import('@/components/navigation/NavbarAuthenticated'));
</script>