<template>
	<div class="h-full">
		<NuxtLoadingIndicator color="rgba(255,255,255,0.45)" :height="3"/>
		<!-- Navigation Bar -->
		<component :is="isAuthed ? NavbarAuthenticated : Navbar" />
		<slot/>
		<NavigationFooter :class="{'sm:hidden':!route.meta.isFooterDisabled}"/>
		<LazyDialogsToastList v-if="toastStore.hasInit"/>
		<LazyDialogsModalList v-if="modalStore.hasInit"/>
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

	// Expand image
    const getImages = () => {
    	const imageNodes = document.querySelectorAll(".img-expand");
    	// Loop through images and attach event listener
		for (let i=0; i<imageNodes.length; i++) {       
		    imageNodes[i].addEventListener('click', (e) => {
		    	modalStore.setModal({
		    		modal: "ModalImage",
		    		id: i,
		    		isOpen: true,
		    		options: {
		    			img: e.target
		    		}
		    	});
		    });
		};
    };

	watch(route, (to) => {
		if (process.client) {
			// Get all images from DOM
			getImages();
		};
	}, { immediate: true });
</script>