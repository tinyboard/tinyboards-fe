<template>
	<div>
		<NuxtLoadingIndicator color="rgba(255,255,255,0.45)" :height="3"/>
		<!-- Navigation Bar -->
		<component :is="isAuthed ? NavbarAuthenticated : Navbar" />
		<slot/>
		<NavigationFooter />
		<DialogsToastList />
		<DialogsModalList />
	</div>
</template>

<script setup>
	import { useLoggedInUser } from '@/stores/StoreAuth';

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

	const Navbar = resolveComponent('NavigationNavbar');
	const NavbarAuthenticated = resolveComponent('NavigationNavbarAuthenticated');
</script>