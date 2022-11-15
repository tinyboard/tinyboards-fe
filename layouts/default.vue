<template>
	<div>
		<!-- Navigation Bar -->
		<component :is="isAuthed ? NavbarAuthenticated : Navbar" />
		<slot/>
		<NavigationFooter />
		<DialogsToastList />
	</div>
</template>

<script setup>
	import { useLoggedInUser } from '@/stores/StoreAuth';

	let userStore = useLoggedInUser();

	const isAuthed = userStore.isAuthed;

	const Navbar = resolveComponent('NavigationNavbar');
	const NavbarAuthenticated = resolveComponent('NavigationNavbarAuthenticated');
</script>