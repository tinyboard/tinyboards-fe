<template>
    <div
        class="h-full"
        :class="{ 'overflow-hidden': route.meta.isScrollDisabled }"
    >
        <NuxtLoadingIndicator color="rgba(255,255,255,0.45)" :height="3" />
        <!-- Navigation Bar -->
        <NavbarAuthenticated v-if="isAuthed" />
        <Navbar v-else />
        <!-- Side Navigation -->
        <!--<NavbarLeft
            v-if="site.enableBoards && !route.meta.isLeftNavbarDisabled"
        />-->
        <slot />
        <NavigationFooter v-if="!route.meta.isFooterDisabled" />
        <LazyDialogsToastList v-if="toastStore.hasInit" />
        <LazyDialogsModalList v-if="modalStore.hasInit" />
    </div>
</template>

<script setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
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

// Helper function to normalize color format (handles both hex and RGB string formats)
function normalizeColor(color) {
    if (!color) return null;

    // If already in RGB format (e.g., "60, 105, 145"), return as-is
    if (/^\d+,\s*\d+,\s*\d+$/.test(color)) {
        return color;
    }

    // If hex format, convert to RGB
    const hex = color.replace('#', '');
    if (hex.length === 6) {
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `${r}, ${g}, ${b}`;
    }

    return null;
}

// Make colors reactive computed values so they update when board changes
const primaryColor = computed(() => {
    const hasBoard = boardStore.hasBoard;
    return hasBoard
        ? normalizeColor(boardStore.board?.primaryColor) || "60, 105, 145"
        : normalizeColor(site.primaryColor) || "60, 105, 145";
});

const secondaryColor = computed(() => {
    const hasBoard = boardStore.hasBoard;
    return hasBoard
        ? normalizeColor(boardStore.board?.secondaryColor) || "96, 128, 63"
        : normalizeColor(site.secondaryColor) || "96, 128, 63";
});

const hoverColor = computed(() => {
    const hasBoard = boardStore.hasBoard;
    return hasBoard
        ? normalizeColor(boardStore.board?.hoverColor) || "54, 94, 129"
        : normalizeColor(site.hoverColor) || "54, 94, 129";
});


useHead({
    bodyAttrs: {
        class: useCookie("theme", { default: () => "" }),
    },
    //title: `${site.name} | ${route.meta.title ?? 'feed'}`,
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} | ${site.name}` : site.name;
    },
    meta: [
        {
            property: "og:title",
            content: `${site.name} | ${route.meta.title ?? "feed"}`,
        },
    ],
    style: [
        () => `
			:root {
				--color-primary: ${primaryColor.value} !important;
				--color-secondary: ${secondaryColor.value} !important;
				--color-primary-hover: ${hoverColor.value} !important;
			}
			`,
    ],
    link: [
        {
            rel: "icon",
            type: `image/png`,
            href: site.icon,
        },
    ],
});

watch(
    () => boardStore.board,
    (newBoard) => {
        // DOM manipulation must be client-side only
        if (process.client && typeof document !== 'undefined') {
            let r = document.querySelector(":root");
            if (r) {
                if (boardStore.hasBoard) {
                    r.style.setProperty(
                        "--color-primary",
                        normalizeColor(boardStore.board?.primaryColor) || "60, 105, 145",
                        "important",
                    );
                    r.style.setProperty(
                        "--color-secondary",
                        normalizeColor(boardStore.board?.secondaryColor) || "96, 128, 63",
                        "important",
                    );
                    r.style.setProperty(
                        "--color-primary-hover",
                        normalizeColor(boardStore.board?.hoverColor) || "54, 94, 129",
                        "important",
                    );
                } else {
                    r.style.setProperty(
                        "--color-primary",
                        normalizeColor(site.primaryColor) || "60, 105, 145",
                        "important",
                    );
                    r.style.setProperty(
                        "--color-secondary",
                        normalizeColor(site.secondaryColor) || "96, 128, 63",
                        "important",
                    );
                    r.style.setProperty(
                        "--color-primary-hover",
                        normalizeColor(site.hoverColor) || "54, 94, 129",
                        "important",
                    );
                }
            }
        }
    },
    { immediate: true }
);

const userStore = useLoggedInUser();
const isAuthed = computed(() => userStore.isAuthed);

const modalStore = useModalStore();
const toastStore = useToastStore();

/*onBeforeMount(() => {
	window.document.body.style.setProperty('--color-primary', site.color);
});*/

const Navbar = defineAsyncComponent(
    () => import("@/components/navigation/Navbar"),
);
const NavbarAuthenticated = defineAsyncComponent(
    () => import("@/components/navigation/NavbarAuthenticated"),
);
const NavbarLeft = defineAsyncComponent(
    () => import("@/components/navigation/NavbarLeft"),
);

// Expand image
const getImages = () => {
    if (process.client && typeof document !== 'undefined') {
        const imageNodes = document.querySelectorAll(".img-expand");
        // Loop through images and attach event listener
        for (let i = 0; i < imageNodes.length; i++) {
            imageNodes[i].addEventListener("click", (e) => {
                modalStore.setModal({
                    modal: "ModalImage",
                    id: i,
                    isOpen: true,
                    options: {
                        img: e.target,
                    },
                });
            });
        }
    }
};

// Dropzone
const hasDragged = ref(false);
const isDragging = ref(false);

const dropzone = () => {
    if (process.client && typeof window !== 'undefined') {
        window.addEventListener("dragenter", (event) => {
            // Check boolean to fix multiple events from invoking modalStore method.
            // We cannot use pointer-events: none; until headless-ui supports portal root styling.
            // https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
            if (!modalStore.isOpen) {
                modalStore.setModal({
                    modal: "ModalDrop",
                    id: 1,
                    isOpen: true,
                });
            }
            isDragging.value = true;
        });
        window.addEventListener("dragleave", (event) => {
            event.preventDefault();
            if (!isDragging.value) {
                modalStore.closeModal();
                isDragging.value = false;
            }
        });
        window.addEventListener("dragover", (event) => {
            event.preventDefault();
            isDragging.value = false;
        });
        window.addEventListener("drop", (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            // Redirect to submit page with encoded image
            const file = event.dataTransfer?.files?.[0];
            // Check for valid image file type and size
            if (file && /\.(jpe?g|png|gif)$/i.test(file.name) && file.size <= 1000000) {
                if (typeof FileReader !== 'undefined') {
                    let reader = new FileReader();
                    reader.onload = () => {
                        if (process.client && typeof sessionStorage !== 'undefined') {
                            sessionStorage.setItem("image", reader.result);
                            router.push("/submit");
                        }
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                toastStore.addNotification({
                    header: "Wrong format or size",
                    message: "Try a PNG, JPG and GIF up to 1MB.",
                    type: "error",
                });
            }
            // Close modal
            isDragging.value = false;
            modalStore.closeModal();
        });
    }
};

// Watch for route changes
watch(
    route,
    (to) => {
        if (process.client) {
            // Get all images from DOM
            getImages();
            dropzone();
        }
    },
    { immediate: true },
);
</script>
