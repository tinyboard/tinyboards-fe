<template>
	<footer id="footer" class="w-full bg-transparent sm:border-t dark:bg-gray-950 dark:border-white/10">
		<div class="mx-auto max-w-8xl py-5 px-2.5 sm:px-6">
			<ul class="menu flex justify-center sm:justify-start gap-2 -mx-1">
				<li v-for="link in links" :key="link.name" class="menu-item px-1 flex-shrink-0">
					<NuxtLink :to="link.href" class="text-xs text-gray-500 dark:text-gray-400 hover:text-primary">
						<strong>{{ link.name }}</strong>
					</NuxtLink>
				</li>
				<li class="menu-item px-1 flex-shrink-0">
					<button @click="pickTheme"
						class="text-xs text-gray-500 dark:text-gray-400 hover:text-primary font-bold">
						Pick Theme
					</button>
				</li>
			</ul>
			<p class="footer-attribution mt-2 text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left">
				Powered by tinyboards. Crafted with <span class="text-primary/50">&#9829;</span> by the community.
			</p>
			<ul v-if="isAdmin" class="footer-menu flex justify-center sm:justify-start gap-2 mt-4 -mx-1">
				<li class="menu-item px-1 flex-shrink-0">
					<NuxtLink to="/admin" class="text-xs text-gray-500 hover:text-primary">
						Admin Control Panel
					</NuxtLink>
				</li>
				<li class="menu-item px-1 flex-shrink-0">
					<NuxtLink to="/admin/invites" class="text-xs text-gray-500 hover:text-primary">
						Invite a friend
					</NuxtLink>
				</li>
			</ul>
		</div>
	</footer>
</template>

<script setup>
import { useModalStore } from "@/stores/StoreModal";
import { useLoggedInUser } from '@/stores/StoreAuth';

const userStore = useLoggedInUser();

// Modal
const modalStore = useModalStore();

// Theme selection
const pickTheme = () => {
	modalStore.setModal({
		modal: "ModalThemes",
		isOpen: true
	});
};

// Admin
const isAdmin = computed(() => {
	return !!userStore.user && userStore.user.is_admin;
});

// Define footer links
const links = [
	{ name: 'About', href: '/help/about' },
	{ name: 'Members', href: '/members' },
	{ name: 'Admins', href: '/admin/admins' },
	{ name: 'Rules', href: '/help/rules' },
]
</script>