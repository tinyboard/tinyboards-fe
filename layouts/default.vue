<template>
	<div>
		<!-- Navigation Bar -->
		<component :is="isAuthed ? NavbarAuthenticated : Navbar" />
		<slot/>
		<NavigationFooter />
	</div>
</template>

<script setup>
	const isAuthed = true;

	const Navbar = resolveComponent('NavigationNavbar')
	const NavbarAuthenticated = resolveComponent('NavigationNavbarAuthenticated')
</script>