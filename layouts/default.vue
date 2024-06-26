<template>
	<div class="h-full" :class="{ 'overflow-hidden': route.meta.isScrollDisabled }">
		<NuxtLoadingIndicator color="rgba(255,255,255,0.45)" :height="3" />
		<!-- Navigation Bar -->
		<component :is="isAuthed ? NavbarAuthenticated : Navbar" />
		<!-- Side Navigation -->
		<NavbarLeft v-if="site.enableBoards && !route.meta.isLeftNavbarDisabled" />
		<slot />
		<NavigationFooter v-if="!route.meta.isFooterDisabled" />
		<LazyDialogsToastList v-if="toastStore.hasInit" />
		<LazyDialogsModalList v-if="modalStore.hasInit" />
	</div>
</template>

<script setup>
import { useLoggedInUser } from '@/stores/StoreAuth';
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { useSiteStore } from "@/stores/StoreSite";
import { useBoardStore } from "@/stores/StoreBoard";
// import { ref } from "vue";

//import { onMounted } from 'vue;'

const site = useSiteStore();
const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();

const primaryColor = boardStore.boardActive ? boardStore.boardView.board["primary_color"] : site.primaryColor;
const secondaryColor = boardStore.boardActive ? boardStore.boardView.board["secondary_color"] : site.secondaryColor;
const hoverColor = boardStore.boardActive ? boardStore.boardView.board["hover_color"] : site.hoverColor;

console.log("setting up head");
useHead({
	bodyAttrs: {
		class: useCookie("theme", { default: () => '' })
	},
	//title: `${site.name} | ${route.meta.title ?? 'feed'}`,
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | ${site.name}` : site.name
	},
	meta: [
		{
			property: 'og:title',
			content: `${site.name} | ${route.meta.title ?? 'feed'}`
		}
	],
	style: [
		`
			:root {
				--color-primary: ${primaryColor} !important;
				--color-secondary: ${secondaryColor} !important;
				--color-primary-hover: ${hoverColor} !important;
			}
			`,
	],
	link: [
		{
			rel: 'icon',
			type: `image/png`,
			href: site.icon
		},
	]
});
console.log("success!");

watch(
	() => boardStore.boardView,
	newBoardView => {
		// this can't happen server-side, so we can use `document` to manipulate colors
		let r = document.querySelector(':root');
		if (boardStore.boardActive) {
			r.style.setProperty('--color-primary', boardStore.boardView.board["primary_color"], "important");
			r.style.setProperty('--color-secondary', boardStore.boardView.board["secondary_color"], "important");
			r.style.setProperty('--color-primary-hover', boardStore.boardView.board["hover_color"], "important");
		} else {
			r.style.setProperty('--color-primary', site.primaryColor, "important");
			r.style.setProperty('--color-secondary', site.secondaryColor, "important");
			r.style.setProperty('--color-primary-hover', site.hoverColor, "important");
		}
	}
)

const userStore = useLoggedInUser();
const isAuthed = userStore.isAuthed;

const modalStore = useModalStore();
const toastStore = useToastStore();

/*onBeforeMount(() => {
	window.document.body.style.setProperty('--color-primary', site.color);
});*/

const Navbar = defineAsyncComponent(() => import('@/components/navigation/Navbar'));
const NavbarAuthenticated = defineAsyncComponent(() => import('@/components/navigation/NavbarAuthenticated'));
const NavbarLeft = defineAsyncComponent(() => import('@/components/navigation/NavbarLeft'));

// Expand image
const getImages = () => {
	const imageNodes = document.querySelectorAll(".img-expand");
	// Loop through images and attach event listener
	for (let i = 0; i < imageNodes.length; i++) {
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

// Dropzone
const hasDragged = ref(false);
const isDragging = ref(false);

const dropzone = () => {
	window.addEventListener('dragenter', (event) => {
		// Check boolean to fix multiple events from invoking modalStore method.
		// We cannot use pointer-events: none; until headless-ui supports portal root styling.
		// https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
		if (!modalStore.isOpen) {
			modalStore.setModal({
				modal: "ModalDrop",
				id: 1,
				isOpen: true
			});
		};
		isDragging.value = true;
	});
	window.addEventListener('dragleave', (event) => {
		event.preventDefault();
		if (!isDragging.value) {
			modalStore.closeModal();
			isDragging.value = false;
		};
	});
	window.addEventListener("dragover", (event) => {
		event.preventDefault();
		isDragging.value = false;
	});
	window.addEventListener('drop', (event) => {
		event.preventDefault();
		event.stopImmediatePropagation();
		// Redirect to submit page with encoded image
		const file = event.dataTransfer.files[0];
		// Check for valid image file type and size
		if (/\.(jpe?g|png|gif)$/i.test(file.name) && file.size <= 1000000) {
			let reader = new FileReader();
			reader.onload = () => {
				sessionStorage.setItem("image", reader.result);
				router.push('/submit');
			};
			reader.readAsDataURL(file)
		} else {
			toastStore.addNotification({ header: 'Wrong format or size', message: 'Try a PNG, JPG and GIF up to 1MB.', type: 'error' });
		};
		// Close modal
		isDragging.value = false;
		modalStore.closeModal();
	});
};

// Watch for route changes
watch(route, (to) => {
	if (process.client) {
		// Get all images from DOM
		getImages();
		dropzone();
	};
}, { immediate: true });
</script>
