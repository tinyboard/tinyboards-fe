<template>
	<div>
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
		title: `TinyBoards | ${route.meta.title ?? 'Feed'}`,
		meta: [
		{
			property: 'og:title',
			content: `TinyBoards | ${route.meta.title}`
		}
		]
	});

	const userStore = useLoggedInUser();
	const isAuthed = userStore.isAuthed;

	const Navbar = resolveComponent('NavigationNavbar');
	const NavbarAuthenticated = resolveComponent('NavigationNavbarAuthenticated');
</script>